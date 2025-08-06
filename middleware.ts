import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl;
  const appId = pathname.split("/").filter(Boolean)[0];
  const chatId = searchParams.get("chatId");

  console.log("Pathname:", pathname);
  console.log("App ID:", appId);
  console.log("Chat ID:", chatId);
  const token = request.cookies.get("access_token");
  if (token) {
    return NextResponse.next();
  }
  const loginUrl = new URL(`/${appId}/login`, request.url);
  return NextResponse.redirect(loginUrl);
  // const loginUrl = new URL("/login", request.url);
  // return NextResponse.redirect(loginUrl);
};

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password|[^/]+/login).*)",
};
