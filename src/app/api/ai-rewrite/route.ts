import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "../../lib/auth/getUserIdFromToken";
import {
  rewriteListingText,
  type RewriteMode,
} from "../../lib/ai/rewriteListing";
import { checkRateLimit } from "../../lib/rateLimit";
import handleError from "../../lib/errors/userErrors";
import { connectMongo } from "../../lib/mongoose";
import User from "../../models/User";
import { trackEvent } from "../../lib/analytics/trackEvent";

const VALID_MODES: RewriteMode[] = [
  "shorter",
  "stronger_cta",
  "formal",
  "no_emoji",
];

/** Poprawa wygenerowanego tekstu — bez zużycia kredytu (lekka operacja). */
export const POST = async (req: Request) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    const user = await User.findById(userId).select("_id");
    if (!user) throw handleError(404, "Użytkownik nie istnieje");

    const rateLimit = checkRateLimit(`rewrite:${userId}`);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      throw handleError(
        429,
        `Zbyt wiele requestów. Spróbuj ponownie za ${resetIn} sekund.`
      );
    }

    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text : "";
    const title =
      typeof body?.title === "string" ? body.title.trim() : undefined;
    const mode =
      typeof body?.mode === "string" &&
      VALID_MODES.includes(body.mode as RewriteMode)
        ? (body.mode as RewriteMode)
        : null;

    if (!mode) throw handleError(400, "Nieprawidłowy tryb poprawy");

    const result = await rewriteListingText({ text, mode, title });

    await trackEvent("generate", {
      userId: String(userId),
      payload: { action: "rewrite", mode },
    });

    return NextResponse.json({
      description: result.description,
      title: result.title,
    });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "Wewnętrzny błąd serwera" },
      { status: error.status || 500 }
    );
  }
};
