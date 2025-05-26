import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectMongo } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export const POST = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Brak tokena" }, { status: 401 });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    await connectMongo();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isPro: true,
        aiUsed: 0,  
       },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pakiet aktywowany", isPro: true });
  } catch (err) {
    console.error("Błąd aktywacji:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
};
