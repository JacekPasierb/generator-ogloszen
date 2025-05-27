import jwt from "jsonwebtoken";

export const getUserIdFromToken = (token: string): string => {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return userId;
  };