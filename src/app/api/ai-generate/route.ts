import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getUserIdFromToken} from "../../lib/auth/getUserIdFromToken";
import {getProUserOrThrow} from "../../lib/auth/getProUserOrThrow";
import {generateDescription} from "../../lib/ai/generateDescription";
import {incrementAiUsage} from "../../lib/db/incrementAiUsage";
import handleError from "../../lib/errors/userErrors";

export const POST = async (req: Request) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");
    
    console.log("Sprawdzamy Id uzytkownika");
    const userId = getUserIdFromToken(token);
    console.log("Mamy Id uzytkownika", userId);
    console.log("Sprawdza czy uzytkownik ma wykupiony plan ");
    
    await getProUserOrThrow(userId);
    console.log("Przeszlo czyli ma wykupiony plan");
    console.log("Przechodzimy do generowania opisu");
    const {input} = await req.json();
    const description = await generateDescription(input);
console.log("Wygenerowano opis");
console.log("Przechodzimy do inkrementacji");

    await incrementAiUsage(userId);

    return NextResponse.json({description});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    const status = error.status || 500;
    const message = error.message || "Wewnętrzny błąd serwera";
    return NextResponse.json({error: message}, {status});
  }
};
