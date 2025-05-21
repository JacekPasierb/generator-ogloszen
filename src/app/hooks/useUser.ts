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

  return {
    user: data,
    isPro: data?.isPro ?? false,
    aiUsed: data?.aiUsed ?? 0,
    aiLimit: data?.aiLimit ?? 0,
    loading: isLoading,
    error,
    mutate,
  };
}
