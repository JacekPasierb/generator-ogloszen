import handleError from "../errors/userErrors";
import {stripe} from "../stripe";

export const createCheckoutSession = async (): Promise<string> => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1RSnYTG8nESrhIoFcIhYzF2n",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?cancelled=true`,
    });

    if (!session.url) {
      throw handleError(500, "Nie udało się uzyskać adresu URL sesji Stripe");
    }

    return session.url;
  } catch {
    throw handleError(500, "Błąd podczas tworzenia sesji płatności");
  }
};
