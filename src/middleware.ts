import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/session";

const protectedRoutes = ["/dashboard"] as const;

const redirectRoutes = [
  { path: "/auth/signin", redirect: "/dashboard" },
  { path: "/auth/signup", redirect: "/dashboard" },
  { path: "/", redirect: "/dashboard" },
] as const;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isRedirectRoute = redirectRoutes.some((route) => route.path === path);

  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
    }
    return NextResponse.next();
  }

  const session = await decrypt(cookie);

  // If in a protected route and not logged in
  if (isProtectedRoute && !session?.data.userId) {
    console.log("Redirected to sign-in page to login.");
    return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
  }

  // If logged in on a redirect route
  if (isRedirectRoute && session?.data.userId) {
    const redirectRoute = redirectRoutes.find((route) => route.path === path);
    console.log(path + ": Redirect route accessed while logged in.");
    return NextResponse.redirect(
      new URL(redirectRoute?.redirect || "/dashboard", req.nextUrl)
    );
  }

  return NextResponse.next();
}
