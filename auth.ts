"use server";
import { getUser } from "./actions/userActions"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // For managing cookies in server actions

const AUTH_SECRET = process.env.AUTH_SECRET || "your_secret_key";

export const signIn = async (email, password) => {
  const user = await getUser(email);
  if (!user) {
    throw new Error("User not found!");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password!");
  }

  // Create JWT token
  const token = jwt.sign(
    {
      user:{
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  },
    AUTH_SECRET,
    { expiresIn: "1d" }
  );
  await setAuthCookie(token);
  return;
};

export const verifyToken = async(token) => {
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch {
    return null;
  }
};

export const setAuthCookie = async(token) => {
  await (await cookies()).set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const clearAuthCookie = async() => {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
};

export const signOut = async() => {
  await clearAuthCookie();
}
export const auth = async() => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const session = await verifyToken(token);
  return session as {
    user: {
      id: number,
      name: string,
      email: string,
      role: "ADMIN" | "USER",
    },
    iat: number,
    exp: number,
  };
};