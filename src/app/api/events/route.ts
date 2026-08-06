import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "../../lib/auth/getUserIdFromToken";
import handleError from "../../lib/errors/userErrors";
import { trackEvent } from "../../lib/analytics/trackEvent";
import { connectMongo } from "../../lib/mongoose";
import Event from "../../models/Event";
import type { EventName } from "../../models/Event";

const ALLOWED_CLIENT_EVENTS: EventName[] = ["paywall_view", "template_selected"];

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    const body = await req.json();
    const event = body?.event as EventName | undefined;
    const payload = body?.payload as Record<string, unknown> | undefined;

    if (!event || !ALLOWED_CLIENT_EVENTS.includes(event)) {
      throw handleError(400, "Nieprawidłowy typ eventu");
    }

    await trackEvent(event, {
      userId: String(userId),
      payload: payload ?? {},
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "Błąd serwera" },
      { status: error.status || 500 }
    );
  }
}

/** Podgląd ostatnich eventów zalogowanego użytkownika (np. do Billing/analytics). */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw handleError(401, "Brak tokena");

    const userId = getUserIdFromToken(token);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const event = searchParams.get("event") as EventName | null;

    await connectMongo();

    const query: { userId: string; event?: EventName } = { userId: String(userId) };
    if (event) query.event = event;

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("event payload createdAt")
      .lean();

    return NextResponse.json({ events });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "Błąd serwera" },
      { status: error.status || 500 }
    );
  }
}
