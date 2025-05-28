"use client";
import useSWR from "swr";

interface UserResponse {
  email: string;
  isPro: boolean;
  aiUsed: number;
  aiLimit: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const {data, error, isLoading, mutate} = useSWR<UserResponse>(
    "/api/me",
    fetcher
  );

  const isUser = data && !("error" in data);

  return {
    user: isUser ? data : null,
    isPro: isUser ? data?.isPro ?? false : false,
    aiUsed: isUser ? data?.aiUsed ?? 0 : 0,
    aiLimit: isUser ? data?.aiLimit ?? 0 : 0,
    loading: isLoading,
    error: isUser ? null : data?.error || error,
    mutate,
  };
}
