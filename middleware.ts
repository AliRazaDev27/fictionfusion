import { auth } from "@/auth"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server"
// export async function middleware(request:NextRequest){
//     const session = await auth()
//     if(!session) return NextResponse.redirect(new URL("/login", request.url))

// }

export default NextAuth(authConfig).auth;
export const config = {
    matcher: [
        '/((?!api|login|signup|_next/static|_next/image|favicon.ico).*)'
    ],
}
