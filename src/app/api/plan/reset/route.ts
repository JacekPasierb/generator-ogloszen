import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongo } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import handleError from "@/app/lib/errors/userErrors";
import { getUserIdFromToken } from "@/app/lib/auth/getUserIdFromToken";

export const POST = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);

    await connectMongo();

    const user = await User.findById(userId);
    if (!user) throw handleError(404, "Użytkownik nie znaleziony");

    // Reset pakietu (Twoje założenie: user klika "odnów" => wraca do free)
    user.plan = "free";
    user.aiLimit = 0;
    user.aiUsed = 0;

    // opcjonalnie: czyścisz to, co ma sens biznesowo
    // user.planActivatedAt = null;
    // user.stripeLastCheckoutSessionId = null;

    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "Błąd serwera" },
      { status: error.status || 500 }
    );
  }
};
