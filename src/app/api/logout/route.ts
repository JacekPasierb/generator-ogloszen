import {NextResponse} from "next/server";

export const POST = async () => {
  const response = NextResponse.json({success: true});
  response.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
};
