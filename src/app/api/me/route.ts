import {cookies} from "next/headers";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import {NextResponse} from "next/server";
import handleError from "../../lib/errors/userErrors";
import {getUserIdFromToken} from "../../lib/auth/getUserIdFromToken";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    const user = await User.findById(userId).select("email plan aiUsed aiLimit");
    if (!user) throw handleError(401, "Użytkownik nie znaleziony");

   
    return NextResponse.json({
      email: user.email,
      plan: user.plan ?? "free",
      aiUsed: user.aiUsed ?? 0,
      aiLimit: user.aiLimit ?? 0,
    });

  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
};
