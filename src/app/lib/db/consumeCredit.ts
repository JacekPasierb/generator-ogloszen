import User from "../../models/User";
import handleError from "../errors/userErrors";

/**
 * Atomowo zużywa jeden kredyt (najpierw trial, potem paid).
 * Zwraca true jeśli kredyt został zużyty, false jeśli brak dostępnych kredytów.
 * Zapewnia atomowość operacji - kredyty nigdy nie spadną poniżej zera.
 */
export const consumeCredit = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId).select("trialCredits aiLimit aiUsed");
  
  if (!user) {
    throw handleError(404, "Użytkownik nie istnieje");
  }

  const trialCredits = user.trialCredits ?? 0;
  const paidCredits = Math.max(0, (user.aiLimit ?? 0) - (user.aiUsed ?? 0));
  const totalAvailable = trialCredits + paidCredits;

  if (totalAvailable <= 0) {
    return false; // Brak dostępnych kredytów
  }

  // Atomowo zużyj kredyt: najpierw trial, potem paid
  if (trialCredits > 0) {
    // Zużyj trial credit
    const result = await User.findOneAndUpdate(
      { _id: userId, trialCredits: { $gt: 0 } },
      { $inc: { trialCredits: -1 } },
      { new: true }
    );
    
    if (!result) {
      // Race condition - ktoś inny zużył trial credit, spróbuj paid
      return await consumePaidCredit(userId);
    }
    
    return true;
  } else {
    // Zużyj paid credit
    return await consumePaidCredit(userId);
  }
};

/**
 * Atomowo zużywa jeden płatny kredyt.
 */
const consumePaidCredit = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId).select("aiLimit aiUsed");
  
  if (!user) {
    throw handleError(404, "Użytkownik nie istnieje");
  }

  const paidCredits = Math.max(0, (user.aiLimit ?? 0) - (user.aiUsed ?? 0));
  
  if (paidCredits <= 0) {
    return false;
  }

  // Atomowo zwiększ aiUsed tylko jeśli nie przekroczymy limitu
  const result = await User.findOneAndUpdate(
    { 
      _id: userId,
      $expr: { $lt: ["$aiUsed", "$aiLimit"] }
    },
    { $inc: { aiUsed: 1 } },
    { new: true }
  );

  return result !== null;
};

/**
 * Sprawdza dostępność kredytów bez ich zużywania.
 */
export const getAvailableCredits = async (userId: string): Promise<{
  trialCredits: number;
  paidCredits: number;
  total: number;
}> => {
  const user = await User.findById(userId).select("trialCredits aiLimit aiUsed");
  
  if (!user) {
    throw handleError(404, "Użytkownik nie istnieje");
  }

  const trialCredits = Math.max(0, user.trialCredits ?? 0);
  const paidCredits = Math.max(0, (user.aiLimit ?? 0) - (user.aiUsed ?? 0));
  const total = trialCredits + paidCredits;

  return {
    trialCredits,
    paidCredits,
    total,
  };
};
