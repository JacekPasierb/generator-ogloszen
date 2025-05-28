import {stripe} from "@/app/lib/stripe";
import {cookies} from "next/headers";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";
import {NextRequest, NextResponse} from "next/server";
import handleError from "../../lib/errors/userErrors";
import {getUserIdFromToken} from "../../lib/auth/getUserIdFromToken";

export async function POST(req: NextRequest) {
  try {
    const {session_id} = await req.json();

    if (!session_id) throw handleError(400, "Brak session_id");

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      throw handleError(400, "Płatność nie zakończona");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    await User.findByIdAndUpdate(userId, {isPro: true, aiUsed: 0}, {new: true});

    return NextResponse.json({paid: true});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
}

export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) throw handleError(400, "Brak session_id");

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw handleError(400, "Płatność nie zakończona");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    await connectMongo();

    await User.findByIdAndUpdate(userId, {isPro: true, aiUsed: 0}, {new: true});

    return NextResponse.json({paid: true});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
}
