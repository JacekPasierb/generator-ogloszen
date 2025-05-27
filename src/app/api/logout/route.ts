import {NextResponse} from "next/server";

export const POST = async () => {
  try {
    const response = NextResponse.json({success: true});
    response.cookies.set("token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json(
      {error: "Wewnętrzny błąd podczas wylogowania"},
      {status: 500}
    );
  }
};
