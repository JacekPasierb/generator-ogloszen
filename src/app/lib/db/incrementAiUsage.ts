import User from "../../models/User";

export const incrementAiUsage = async (userId: string) => {
    await User.findByIdAndUpdate(userId, { $inc: { aiUsed: 1 } });
  
    const updatedUser = await User.findById(userId);
    if (updatedUser && updatedUser.aiUsed >= updatedUser.aiLimit) {
      await User.findByIdAndUpdate(userId, {
        isPro: false,
        aiUsed: 50, // reset do limitu darmowego
      });
    }
  };
  