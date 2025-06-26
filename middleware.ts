// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = ["/auth", "/api/auth"].some((p) => path.startsWith(p));

  if (isPublicPath) return NextResponse.next();

  const token = request.cookies.get("next-auth.session-token")?.value || 
                request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};