"use client";

import useSWR from "swr";

export type Plan = "free" | "start" | "standard" | "pro";

export interface UserResponse {
  email: string;
  plan: Plan;
  aiUsed: number;
  aiLimit: number;
}

export type MeResponse = UserResponse | {error: string};

const isPaidPlan = (plan: Plan) => plan !== "free";

const fetcher = async (url: string): Promise<MeResponse> => {
  const res = await fetch(url, {credentials: "include"});
  return res.json();
};

function getErrorMessage(err: unknown): string | null {
  if (!err) return null;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return null;
}

export function useUser() {
  const {data, error, mutate, isValidating} = useSWR<MeResponse>(
    "/api/me",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      // ważne: w auth nie chcesz “szalejących” refetchy
      // revalidateOnReconnect: false, // opcjonalnie
    }
  );

  // 1) Initial: jeszcze nie wiemy nic — NIE mówimy “niezalogowany”
  if (data === undefined) {
    return {
      user: undefined as UserResponse | null | undefined,
      loading: true,
      validating: isValidating,
      error: null as string | null,
      mutate,

      // derived defaults (bezpieczne dla UI)
      plan: "free" as Plan,
      isPaid: false,
      aiUsed: 0,
      aiLimit: 0,
      aiLeft: 0,
    };
  }

  const isAuthed = !("error" in data);
  const user = isAuthed ? (data as UserResponse) : null;

  const plan: Plan = user?.plan ?? "free";
  const aiUsed = user?.aiUsed ?? 0;
  const aiLimit = user?.aiLimit ?? 0;
  const aiLeft = Math.max(0, aiLimit - aiUsed);

  return {
    user,
    loading: false,
    validating: isValidating,
    error: isAuthed
      ? null
      : (data as {error: string}).error ??
        getErrorMessage(error) ??
        "Unauthorized",

    mutate,

    // ✅ single source for UI
    plan,
    isPaid: isPaidPlan(plan),
    aiUsed,
    aiLimit,
    aiLeft,
  };
}
