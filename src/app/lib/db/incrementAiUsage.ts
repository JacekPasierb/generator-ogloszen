import User from "../../models/User";

export const incrementAiUsage = async (userId: string) => {
  // 1) +1 użycie
  await User.findByIdAndUpdate(userId, { $inc: { aiUsed: 1 } });

  // 2) sprawdzamy czy limit się skończył i w razie czego cofamy plan na free
  const updatedUser = await User.findById(userId).select("aiUsed aiLimit plan");
  if (!updatedUser) return;

  if ((updatedUser.aiUsed ?? 0) >= (updatedUser.aiLimit ?? 0)) {
    await User.findByIdAndUpdate(userId, {
      plan: "free",
      aiLimit: 0,
      aiUsed: 0, // albo zostaw ile zużył; ja wolę 0 po powrocie do free
    });
  }
};
