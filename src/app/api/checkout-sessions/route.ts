import {NextRequest, NextResponse} from "next/server";
import handleError from "../../lib/errors/userErrors";
import {plans} from "../../data/plans";
import {cookies} from "next/headers";
import {getUserIdFromToken} from "../../lib/auth/getUserIdFromToken";
import {stripe} from "../../lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const {planId} = await req.json();
    if (!planId) throw handleError(400, "Brak planId");

    const plan = plans.find((p) => p.id === planId);
    if (!plan) throw handleError(400, "Nieprawidłowy plan");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);

    const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pl",

      line_items: [{price: plan.stripePriceId, quantity: 1}],

      // 🔑 Kluczowe: identyfikacja usera i planu w webhooku
      client_reference_id: userId,
      metadata: {
        userId,
        planId: plan.id,
      },

      success_url: `${appUrl}/dashboard?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?cancelled=1`,
    });

    return NextResponse.json({url: session.url});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd serwera"},
      {status: error.status || 500}
    );
  }
}
