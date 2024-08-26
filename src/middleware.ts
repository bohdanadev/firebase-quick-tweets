import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === "/" && !searchParams.has("mode")) {
    const url = req.nextUrl.clone();
    url.searchParams.set("mode", "login");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
