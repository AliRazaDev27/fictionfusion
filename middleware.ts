import { auth } from "@/auth"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server"

export default NextAuth(authConfig).auth;
export const config = {
    matcher: [
        '/((?!api|login|signup|_next/static|_next/image|favicon.ico).*)'
    ],
}
