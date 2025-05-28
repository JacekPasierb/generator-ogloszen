import {mutate} from "swr";

export const loginUser = async (values: {email: string; password: string}) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(values),
   
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd logowania");
  }

  return data;
};

export const registerUser = async (values: {
  email: string;
  password: string;
  acceptedTerms: boolean;
}) => {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Błąd rejestracji");
  }

  return data;
};

export const logoutUser = async () => {
  const res = await fetch("/api/logout", {
    method: "POST",
  });
  

  if (!res.ok) {
    throw new Error("Nie udało się wylogować");
  }

  await mutate("/api/me", undefined);
};
