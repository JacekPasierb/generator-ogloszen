import {NextRequest, NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const {email, password} = await req.json();
  await connectMongo();

  const user = await User.findOne({email});
  if (!user) {
    return NextResponse.json(
      {error: "Nieprawidłowy email lub hasło"},
      {status: 401}
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      {error: "Nieprawidłowy email lub hasło"},
      {status: 401}
    );
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
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dni
  });

  return response;
};
