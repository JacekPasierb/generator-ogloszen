import User from "../../models/User";

export const incrementAiUsage = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {$inc: {aiUsed: 1}});
};
