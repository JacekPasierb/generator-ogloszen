import {NextRequest, NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import bcrypt from "bcryptjs";
import User from "../../models/User";

export const POST = async (req: NextRequest) => {
  const {email, password, acceptedTerms} = await req.json();

  if (!acceptedTerms)
    NextResponse.json({error: "Brak akceptacji regulaminu"}, {status: 400});

  await connectMongo();

  const existing = await User.findOne({email});
  if (existing) {
    return NextResponse.json({error: "Użytkownik już istnieje"}, {status: 400});
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({email, passwordHash, isPro: false});

  return NextResponse.json({message: "Konto utworzone", userId: newUser._id});
};
