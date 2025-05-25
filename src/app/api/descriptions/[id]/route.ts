import {NextRequest, NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({error: "Nieautoryzowany"}, {status: 401});

  try {
    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    await connectMongo();
    

    if (!id) {
      return NextResponse.json(
        {error: "Nieprawidłowe ID opisu"},
        {status: 400}
      );
    }

    const result = await User.findByIdAndUpdate(
      userId,
      {$pull: {savedDescriptions: {_id: id}}},
      {new: true}
    );

    if (!result) {
      return NextResponse.json({error: "Opis nie znaleziony"}, {status: 404});
    }

    return NextResponse.json({message: "Opis usunięty"}, {status: 200});
  } catch (err) {
    console.error("Błąd usuwania opisu:", err);
    return NextResponse.json({error: "Błąd serwera"}, {status: 500});
  }
};
