import User from "../../models/User";
import handleError from "../errors/userErrors";
import {connectMongo} from "../mongoose";

export const getProUserOrThrow = async (userId: string) => {
  await connectMongo();
  const user = await User.findById(userId);
  if (!user) {
    throw handleError(404, "Użytkownik nie istnieje");
  }

  if (!user.isPro) {
    throw handleError(403, "Brak dostępu – konto nie ma statusu Pro");
  }
  return user;
};
