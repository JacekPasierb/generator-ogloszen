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

    const user = await User.findById(userId);
    if (!user) throw handleError(404, "Użytkownik nie znaleziony");
    if (!user.isPro)
      throw handleError(403, "Brak dostępu do zapisywania opisów");
    if (user.savedDescriptions.length >= 5) {
      throw handleError(400, "Można zapisać maksymalnie 5 opisów");
    }

    const {description} = await req.json();
    if (!description) throw handleError(400, "Brak opisu do zapisania");

    user.savedDescriptions.push({text: description, date: new Date()});
    await user.save();

    return NextResponse.json({message: "Opis zapisany pomyślnie"});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
};
