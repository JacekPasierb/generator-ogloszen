import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/app/lib/stripe";
import { connectMongo } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import { plans } from "@/app/data/plans";

export const runtime = "nodejs"; // ważne

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Brak stripe-signature" }, { status: 400 });
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Nieprawidłowy podpis webhook" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const userId = session?.metadata?.userId || session?.client_reference_id;
      const planId = session?.metadata?.planId;

      if (!userId || !planId) {
        return NextResponse.json({ error: "Brak userId/planId w metadata" }, { status: 400 });
      }

      const plan = plans.find((p) => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: "Nieprawidłowy planId" }, { status: 400 });
      }

      await connectMongo();

      await User.findByIdAndUpdate(
        userId,
        {
          plan: plan.id,
          aiLimit: plan.aiLimit,
          aiUsed: 0,
        },
        { new: true }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
