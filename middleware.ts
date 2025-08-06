// import { NextRequest, NextResponse } from "next/server";

// export const middleware = (request: NextRequest) => {
//   const { pathname, searchParams } = request.nextUrl;

//   const token = request.cookies.get("access_token");
//   if (token) {
//     return NextResponse.next();
//   }
//   const loginUrl = new URL(`/login?appId=${appId}`, request.url);
//   return NextResponse.redirect(loginUrl);
//   // const loginUrl = new URL("/login", request.url);
//   // return NextResponse.redirect(loginUrl);
// };

// export const config = {
//   matcher:
//     "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password|[^/]+/login).*)",
// };

import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const appId = searchParams.get("appId");
  const token = request.cookies.get("access_token");
  if (token) {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", request.url);
  if (appId) {
    loginUrl.searchParams.set("appId", appId);
  }
  return NextResponse.redirect(loginUrl);
};

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password).*)",
};
