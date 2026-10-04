import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import {getUserIdFromToken} from "../../lib/auth/getUserIdFromToken";
import handleError from "../../lib/errors/userErrors";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    const user = await User.findById(userId).select("savedDescriptions");
    if (!user) throw handleError(404, "Użytkownik nie znaleziony");
    return NextResponse.json({descriptions: user.savedDescriptions});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    const user = await User.findById(userId).select("plan savedDescriptions");
    if (!user) throw handleError(404, "Użytkownik nie znaleziony");

    const plan = user.plan ?? "free";
    const savedCount = user.savedDescriptions?.length ?? 0;
    /** Trial / free: do 2 zapisów; płatne plany: do 5 */
    const maxSaved = plan === "free" ? 2 : 5;

    if (savedCount >= maxSaved) {
      throw handleError(
        400,
        plan === "free"
          ? "W trialu możesz zapisać maksymalnie 2 opisy. Wybierz pakiet, aby zapisać więcej."
          : "Można zapisać maksymalnie 5 opisów"
      );
    }

    const body = await req.json();
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";
    const title =
      typeof body?.title === "string" && body.title.trim()
        ? body.title.trim().slice(0, 120)
        : undefined;
    const short =
      typeof body?.short === "string" && body.short.trim()
        ? body.short.trim().slice(0, 200)
        : undefined;

    if (!description) throw handleError(400, "Brak opisu do zapisania");

    user.savedDescriptions.push({
      text: description,
      title: title || undefined,
      short: short || undefined,
      date: new Date(),
    });
    await user.save();

    return NextResponse.json({ message: "Opis zapisany pomyślnie" });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "Błąd serwera" },
      { status: error.status || 500 }
    );
  }
};

