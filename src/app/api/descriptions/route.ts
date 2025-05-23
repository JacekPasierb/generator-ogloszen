import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";

export const GET = async () => {
  try {
    // Pobieranie tokena z ciasteczek
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({error: "Brak tokena"}, {status: 401});

    // Weryfikacja tokena JWT
    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Połączenie z bazą danych
    await connectMongo();

    // Pobieranie użytkownika z bazy danych
    const user = await User.findById(userId).select("savedDescriptions");
    if (!user)
      return NextResponse.json(
        {error: "Użytkownik nie znaleziony"},
        {status: 404}
      );

    // Zwracanie zapisanych opisów
    return NextResponse.json(
      {descriptions: user.savedDescriptions},
      {status: 200}
    );
  } catch (error) {
    console.error("Błąd pobierania opisów:", error);
    return NextResponse.json({error: "Błąd serwera"}, {status: 500});
  }
};

export const POST = async (req: NextRequest) => {
  try {
    // Odczyt tokena z ciasteczek
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({error: "Brak tokena"}, {status: 401});

    // Weryfikacja tokena
    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Połączenie z bazą danych
    await connectMongo();

    // Sprawdzenie użytkownika
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        {error: "Użytkownik nie znaleziony"},
        {status: 404}
      );

    // Sprawdzenie pakietu PRO
    if (!user.isPro)
      return NextResponse.json(
        {error: "Brak dostępu do zapisywania opisów"},
        {status: 403}
      );

    if (user.savedDescriptions.length >= 5) {
      return NextResponse.json(
        {error: "Można zapisać maksymalnie 5 opisów"},
        {status: 400}
      );
    }

    // Pobranie danych z żądania
    const {description} = await req.json();
    if (!description)
      return NextResponse.json(
        {error: "Brak opisu do zapisania"},
        {status: 400}
      );

    // Zapis opisu do bazy danych
    user.savedDescriptions.push({text: description, date: new Date()});
    await user.save();

    return NextResponse.json(
      {message: "Opis zapisany pomyślnie"},
      {status: 200}
    );
  } catch (error) {
    console.error("Błąd zapisywania opisu:", error);
    return NextResponse.json({error: "Wewnętrzny błąd serwera"}, {status: 500});
  }
};
