import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";

import { stripe } from "@/app/lib/stripe";
import { connectMongo } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import { plans } from "@/app/data/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Brak stripe-signature" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Brak STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Nieprawidłowy podpis webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId ?? session.client_reference_id ?? null;
      const planId = session.metadata?.planId ?? null;

      if (!userId || !planId) {
        return NextResponse.json(
          { error: "Brak userId/planId w metadata" },
          { status: 400 }
        );
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
  } catch (e: unknown) {
    console.error("Stripe webhook error:", e);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
