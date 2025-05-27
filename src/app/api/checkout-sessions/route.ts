import {NextResponse} from "next/server";
import {createCheckoutSession} from "../../lib/stripe/createCheckoutSession";

export async function POST() {
  try {
    const url = await createCheckoutSession();
    return NextResponse.json({url});
  } catch (err) {
    const error = err as {status?: number; message?: string};
    const status = error.status || 500;
    const message = error.message || "Wewnętrzny błąd serwera";

    return NextResponse.json({error: message}, {status});
  }
}
