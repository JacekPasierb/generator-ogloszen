import {NextResponse} from "next/server";

import {stripe} from "../../lib/stripe";

export async function POST() {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1RSkSJ4PTJFcKLjRhsZlpQ7T",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
    return NextResponse.json({url: session.url});
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({error: err.message}, {status: 500});
    }

    return NextResponse.json({error: "Wystąpił nieznany błąd"}, {status: 500});
  }
} 
