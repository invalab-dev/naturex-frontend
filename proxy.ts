import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {UserRole} from "@/lib/data-type";

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    const url = new URL('/login', req.nextUrl.origin);
    return NextResponse.rewrite(url);
  }
  // if(req.url.startsWith("/login")){
  //   return NextResponse.next();
  // }
  //
  // const token = req.cookies.get("access_token")?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", process.env.MEXT_PUBLIC_NATUREX_BACKEND));
  // }
  //
  // const secret = new TextEncoder().encode(process.env.SECRET);
  // const { payload } = (await jwtVerify(token, secret)) as {
  //   payload: {
  //     userRoles: UserRole[];
  //   };
  // };
  //
  // return NextResponse.next();
}