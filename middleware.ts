import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("access_token");
  if (token) {
    return NextResponse.next();
  }
  
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
};

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password).*)",
};
