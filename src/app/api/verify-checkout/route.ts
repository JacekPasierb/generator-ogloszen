import { stripe } from "@/app/lib/stripe";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectMongo } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Brak session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Płatność nie zakończona" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Brak tokena" }, { status: 401 });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    await connectMongo();
    await User.findByIdAndUpdate(
      userId,
      { isPro: true, aiUsed: 0 },
      { new: true }
    );

    return NextResponse.json({ paid: true });
  } catch (err) {
    console.error("❌ Błąd aktywacji:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
