import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {UserRole} from "@/lib/data-type";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/login', process.env.NEXT_PUBLIC_NATUREX_BACKEND as string))
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