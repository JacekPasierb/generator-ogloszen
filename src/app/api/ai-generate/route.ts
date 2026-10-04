import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "../../lib/auth/getUserIdFromToken";
import {
  generateDescription,
  isValidImageDataUrl,
} from "../../lib/ai/generateDescription";
import { consumeCredit, getAvailableCredits } from "../../lib/db/consumeCredit";
import { checkRateLimit } from "../../lib/rateLimit";
import handleError from "../../lib/errors/userErrors";
import { connectMongo } from "../../lib/mongoose";
import User from "../../models/User";
import { trackEvent } from "../../lib/analytics/trackEvent";
import {
  VALID_TEMPLATES,
  type TemplateId,
} from "../../data/templates";
import { VALID_PORTALS, type PortalId } from "../../data/portals";

const MAX_IMAGES = 3;

export const POST = async (req: Request) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    const user = await User.findById(userId).select("email aiUsed");
    if (!user) throw handleError(404, "Użytkownik nie istnieje");

    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      throw handleError(
        429,
        `Zbyt wiele requestów. Spróbuj ponownie za ${resetIn} sekund.`
      );
    }

    const body = await req.json();
    const input = typeof body?.input === "string" ? body.input : "";

    const rawUrls: string[] = [];
    if (Array.isArray(body?.imageDataUrls)) {
      for (const item of body.imageDataUrls) {
        if (typeof item === "string" && item.trim()) {
          rawUrls.push(item.trim());
        }
      }
    }
    if (typeof body?.imageDataUrl === "string" && body.imageDataUrl.trim()) {
      rawUrls.unshift(body.imageDataUrl.trim());
    }
    const imageDataUrls = [...new Set(rawUrls)].slice(0, MAX_IMAGES);
    const hasImage = imageDataUrls.length > 0;

    const templateId =
      typeof body?.templateId === "string" &&
      VALID_TEMPLATES.includes(body.templateId)
        ? (body.templateId as TemplateId)
        : "default";
    const portalId =
      typeof body?.portalId === "string" &&
      VALID_PORTALS.includes(body.portalId as PortalId)
        ? (body.portalId as PortalId)
        : "olx";
    /** Zawsze pełny pakiet (tytuł + short + opis) — bez osobnego przełącznika w UI */
    const outputFormat = "full" as const;
    const variants = body?.variants === true;

    for (const url of imageDataUrls) {
      if (!isValidImageDataUrl(url)) {
        throw handleError(
          400,
          "Nieprawidłowe zdjęcie (dozwolone: JPG/PNG/WebP, max ~1 MB po kompresji)."
        );
      }
    }

    if (!hasImage) {
      if (!input.trim()) {
        throw handleError(400, "Podaj słowa kluczowe albo dodaj zdjęcie");
      }
      if (input.trim().length < 10) {
        throw handleError(400, "Opis musi mieć co najmniej 10 znaków");
      }
    }

    if (input.length > 500) {
      throw handleError(400, "Input zbyt długi (max 500 znaków)");
    }

    const credits = await getAvailableCredits(userId);
    if (credits.total <= 0) {
      throw handleError(
        403,
        "Brak dostępnych kredytów. Wybierz pakiet, aby kontynuować."
      );
    }

    const result = await generateDescription(input, {
      templateId,
      portalId,
      outputFormat,
      imageDataUrls: hasImage ? imageDataUrls : undefined,
      variants,
    });

    const creditConsumed = await consumeCredit(userId);
    if (!creditConsumed) {
      throw handleError(
        403,
        "Brak dostępnych kredytów. Wybierz pakiet, aby kontynuować."
      );
    }

    await trackEvent("generate", {
      userId: String(userId),
      payload: {
        templateId,
        portalId,
        outputFormat,
        hasImage,
        imageCount: imageDataUrls.length,
        variants,
      },
    });

    return NextResponse.json({
      description: result.long,
      title: result.title || undefined,
      short: result.short || undefined,
      keywords: result.keywords ?? [],
      features: result.features ?? [],
      checklist: result.checklist ?? [],
      variants: result.variants ?? undefined,
      credits: await getAvailableCredits(userId),
    });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    const status = error.status || 500;
    const message = error.message || "Wewnętrzny błąd serwera";
    return NextResponse.json({ error: message }, { status });
  }
};
