import { connectMongo } from "../mongoose";
import Event, { EventName } from "../../models/Event";

/**
 * Zapisuje event do kolekcji events (analityka konwersji).
 * Nie loguje wrażliwych danych (hasła, pełne opisy).
 */
export async function trackEvent(
  event: EventName,
  options?: { userId?: string; payload?: Record<string, unknown> }
): Promise<void> {
  try {
    await connectMongo();
    await Event.create({
      userId: options?.userId,
      event,
      payload: options?.payload ?? {},
    });
  } catch (e) {
    console.error("trackEvent error:", e);
  }
}
