import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import User from "@/app/models/User";
import {connectMongo} from "@/app/lib/mongoose";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const POST = async (req: Request) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({error: "Brak tokena"}, {status: 401});

    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    await connectMongo();
    const user = await User.findById(userId);
    if (!user || !user.isPro)
      return NextResponse.json({error: "Brak dostępu"}, {status: 403});

    const {input} = await req.json();
    const prompt = `Na podstawie poniższego opisu stwórz atrakcyjne ogłoszenie sprzedaży w stylu marketingowym:\n\n${input}`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
    });

    const description = response.choices[0].message.content;

    // 👇 Tutaj dodajesz inkrementację zużycia
    await User.findByIdAndUpdate(userId, {
      $inc: {aiUsed: 1},
    });

    // 👇 Sprawdzenie czy użytkownik wykorzystał cały pakiet
    const updatedUser = await User.findById(userId);
    if (updatedUser && updatedUser.aiUsed >= updatedUser.aiLimit) {
      await User.findByIdAndUpdate(userId, {isPro: false, aiUsed: 50});
    }

    return NextResponse.json({description});
  } catch (err) {
    console.error("❌ Błąd API GPT:", err);
    return NextResponse.json({error: "Wewnętrzny błąd serwera"}, {status: 500});
  }
};
