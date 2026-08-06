import {consumeCredit, getAvailableCredits} from "../../lib/db/consumeCredit";
import User from "../../models/User";
import handleError from "../../lib/errors/userErrors";

jest.mock("../../models/User");
jest.mock("../../lib/mongoose", () => ({
  connectMongo: jest.fn(),
}));

describe("consumeCredit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should consume trial credit when available", async () => {
    const mockUser = {
      _id: "userId",
      trialCredits: 2,
      aiLimit: 0,
      aiUsed: 0,
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      trialCredits: 1,
    });

    const result = await consumeCredit("userId");

    expect(result).toBe(true);
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      {_id: "userId", trialCredits: {$gt: 0}},
      {$inc: {trialCredits: -1}},
      {new: true}
    );
  });

  it("should consume paid credit when no trial credits", async () => {
    const mockUser = {
      _id: "userId",
      trialCredits: 0,
      aiLimit: 10,
      aiUsed: 5,
    };

    (User.findById as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockUser);
    (User.findOneAndUpdate as jest.Mock)
      .mockResolvedValueOnce(null) // trial credit nie znaleziony (race condition)
      .mockResolvedValueOnce({...mockUser, aiUsed: 6}); // paid credit zużyty

    const result = await consumeCredit("userId");

    expect(result).toBe(true);
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: "userId",
        $expr: {$lt: ["$aiUsed", "$aiLimit"]},
      },
      {$inc: {aiUsed: 1}},
      {new: true}
    );
  });

  it("should return false when no credits available", async () => {
    const mockUser = {
      _id: "userId",
      trialCredits: 0,
      aiLimit: 10,
      aiUsed: 10,
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    const result = await consumeCredit("userId");

    expect(result).toBe(false);
  });

  it("should throw error when user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(consumeCredit("invalidId")).rejects.toThrow(
      "Użytkownik nie istnieje"
    );
  });
});

describe("getAvailableCredits", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct credits count", async () => {
    const mockUser = {
      _id: "userId",
      trialCredits: 2,
      aiLimit: 10,
      aiUsed: 3,
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await getAvailableCredits("userId");

    expect(result).toEqual({
      trialCredits: 2,
      paidCredits: 7,
      total: 9,
    });
  });

  it("should return zero when all credits used", async () => {
    const mockUser = {
      _id: "userId",
      trialCredits: 0,
      aiLimit: 10,
      aiUsed: 10,
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await getAvailableCredits("userId");

    expect(result).toEqual({
      trialCredits: 0,
      paidCredits: 0,
      total: 0,
    });
  });
});
