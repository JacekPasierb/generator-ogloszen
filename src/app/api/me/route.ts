import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import {NextResponse} from "next/server";

export const GET = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json(null, {status: 401});

  const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
  };
  await connectMongo();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json(null, {status: 401});

  return NextResponse.json({
    email: user.email,
    isPro: user.isPro,
    aiUsed: user.aiUsed,
    aiLimit: user.aiLimit,
  });
};
