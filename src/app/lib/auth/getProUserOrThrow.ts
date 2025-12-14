import User from "../../models/User";
import handleError from "../errors/userErrors";
import { connectMongo } from "../mongoose";

type Plan = "free" | "start" | "standard" | "pro";

export const getPaidUserOrThrow = async (userId: string) => {
  await connectMongo();

  const user = await User.findById(userId).select("plan aiUsed aiLimit email");
  if (!user) throw handleError(404, "Użytkownik nie istnieje");

  const plan: Plan = (user.plan ?? "free") as Plan;

  if (plan === "free") {
    throw handleError(403, "Brak dostępu – konto nie ma aktywnego pakietu");
  }

  if ((user.aiLimit ?? 0) <= 0) {
    throw handleError(403, "Pakiet nieaktywny (brak limitu)");
  }

  if ((user.aiUsed ?? 0) >= (user.aiLimit ?? 0)) {
    throw handleError(403, "Wykorzystałeś limit opisów w tym pakiecie");
  }

  return user;
};
