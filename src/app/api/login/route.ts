import {NextRequest, NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import handleError from "../../lib/errors/userErrors";

export const POST = async (req: NextRequest) => {
  try {
    const {email, password} = await req.json();
    await connectMongo();

    const user = await User.findOne({email});
    if (!user) {
      throw handleError(401, "Nieprawidłowy email lub hasło");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw handleError(401, "Nieprawidłowy email lub hasło");
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Zalogowano",
      isPro: user.isPro,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure:true,
      sameSite:"lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dni
    });

    return response;
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Wewnętrzny błąd serwera"},
      {status: error.status || 500}
    );
  }
};
