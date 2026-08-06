import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "../../lib/auth/getUserIdFromToken";
import { generateDescription } from "../../lib/ai/generateDescription";
import { consumeCredit, getAvailableCredits } from "../../lib/db/consumeCredit";
import { checkRateLimit } from "../../lib/rateLimit";
import handleError from "../../lib/errors/userErrors";
import { connectMongo } from "../../lib/mongoose";
import User from "../../models/User";
import { trackEvent } from "../../lib/analytics/trackEvent";
import type { TemplateId } from "../../data/templates";

const VALID_TEMPLATES = ["default", "car", "rental", "job", "services", "marketplace"];

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
    const input = body?.input;
    const templateId = typeof body?.templateId === "string" && VALID_TEMPLATES.includes(body.templateId)
      ? (body.templateId as TemplateId)
      : "default";
    const outputFormat = body?.outputFormat === "full" ? "full" : "simple";

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      throw handleError(400, "Brak lub nieprawidłowy input");
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

    const creditConsumed = await consumeCredit(userId);
    if (!creditConsumed) {
      throw handleError(
        403,
        "Brak dostępnych kredytów. Wybierz pakiet, aby kontynuować."
      );
    }

    const result = await generateDescription(input, {
      templateId,
      outputFormat,
    });

    await trackEvent("generate", {
      userId: String(userId),
      payload: { templateId, outputFormat },
    });

    const description = typeof result === "string" ? result : result.long;
    const title = typeof result === "string" ? undefined : result.title;
    const short = typeof result === "string" ? undefined : result.short;

    return NextResponse.json({
      description,
      title,
      short,
      credits: await getAvailableCredits(userId),
    });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    const status = error.status || 500;
    const message = error.message || "Wewnętrzny błąd serwera";
    return NextResponse.json({ error: message }, { status });
  }
};
