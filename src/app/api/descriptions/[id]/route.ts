import {NextRequest, NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import {cookies} from "next/headers";
import handleError from "../../../lib/errors/userErrors";
import {getUserIdFromToken} from "../../../lib/auth/getUserIdFromToken";

export const DELETE = async (
  req: NextRequest,
  context: {params: Promise<{id: string}>}
) => {
  try {
    const {id} = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw handleError(401, "Brak tokena");
    if (!id) throw handleError(400, "Nieprawidłowe ID opisu");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    const result = await User.findByIdAndUpdate(
      userId,
      {$pull: {savedDescriptions: {_id: id}}},
      {new: true}
    );
    if (!result) throw handleError(404, "Opis nie znaleziony");

    return NextResponse.json({message: "Opis usunięty"}, {status: 200});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
};
