import {NextRequest, NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import handleError from "../../lib/errors/userErrors";

export const POST = async (req: NextRequest) => {
  try {
    const {email, password, acceptedTerms} = await req.json();

    if (!acceptedTerms) {
      throw handleError(400, "Brak akceptacji regulaminu");
    }
    await connectMongo();
    const existing = await User.findOne({email});
    if (existing) {
      throw handleError(400, "Użytkownik już istnieje");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({email, passwordHash, isPro: false});

    return NextResponse.json({
      message: "Konto utworzone",
      userId: newUser._id,
    });
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Wewnętrzny błąd serwera"},
      {status: error.status || 500}
    );
  }
};
