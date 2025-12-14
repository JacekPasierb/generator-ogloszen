import User from "../../models/User";
import handleError from "../errors/userErrors";
import { connectMongo } from "../mongoose";


type Plan = "free" | "start" | "standard" | "pro";

export const getProUserOrThrow = async (userId: string) => {
  await connectMongo();

  const user = await User.findById(userId).select("plan aiUsed aiLimit email");
  console.log("jest user", user);
  
  if (!user) throw handleError(404, "Użytkownik nie istnieje");

  const plan: Plan = (user.plan ?? "free") as Plan;
console.log("tu dochodzi plan", plan);

  if (plan === "free") {
    throw handleError(403, "Brak dostępu – konto nie ma aktywnego pakietu");
  }
console.log("tu tez dochodzi");

  // if ((user.aiLimit ?? 0) <= 0) {
  //   throw handleError(403, "Pakiet nieaktywny (brak limitu)");
  // }
console.log("user limit",user.aiLimit);
console.log("user aiUsed",user.aiUsed);

  // if ((user.aiUsed ?? 0) >= (user.aiLimit ?? 0)) {
  //   throw handleError(403, "Wykorzystałeś limit opisów w tym pakiecie");
  // }

  return user;
};
