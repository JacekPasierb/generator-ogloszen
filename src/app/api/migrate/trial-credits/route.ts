import {NextResponse} from "next/server";
import {connectMongo} from "@/app/lib/mongoose";
import User from "@/app/models/User";

/**
 * Migracja: Ustawia trialCredits=0 dla wszystkich istniejących użytkowników.
 * Nowi użytkownicy dostają automatycznie 2 trialCredits przy rejestracji.
 * 
 * Użycie: GET /api/migrate/trial-credits
 * 
 * UWAGA: Uruchom to tylko raz po wdrożeniu funkcji trial credits!
 */
export const GET = async () => {
  try {
    await connectMongo();

    // Znajdź wszystkich użytkowników, którzy nie mają ustawionego trialCredits
    // (lub mają undefined/null - dla bezpieczeństwa ustawiamy wszystkim 0)
    const result = await User.updateMany(
      { trialCredits: { $exists: false } },
      { $set: { trialCredits: 0 } }
    );

    // Również ustaw 0 dla użytkowników, którzy mają null/undefined
    const result2 = await User.updateMany(
      { trialCredits: null },
      { $set: { trialCredits: 0 } }
    );

    return NextResponse.json({
      message: "Migracja zakończona pomyślnie",
      updated: result.modifiedCount + result2.modifiedCount,
      matched: result.matchedCount + result2.matchedCount,
    });
  } catch (err) {
    const error = err as {message?: string};
    return NextResponse.json(
      {error: error.message || "Błąd migracji"},
      {status: 500}
    );
  }
};
