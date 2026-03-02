import { describe, it, expect, vi, beforeEach } from "vitest";
import { signIn, verifyToken, setAuthCookie, signOut, auth } from "./auth";
import { getUser } from "./actions/userActions";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Mock dependencies
vi.mock("./actions/userActions", () => ({
    getUser: vi.fn(),
}));

vi.mock("bcrypt", () => ({
    default: {
        compare: vi.fn(),
    },
    compare: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn(),
    },
    sign: vi.fn(),
    verify: vi.fn(),
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("auth.ts", () => {
    const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashed_password",
        role: "USER",
        created_at: new Date(),
        updated_at: new Date(),
    };

    const mockToken = "mock_token";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("signIn", () => {
        it("should sign in successfully and set a cookie", async () => {
            vi.mocked(getUser).mockResolvedValue(mockUser as any);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
            vi.mocked(jwt.sign).mockReturnValue(mockToken as any);

            const mockSet = vi.fn();
            vi.mocked(cookies).mockResolvedValue({
                set: mockSet,
            } as any);

            await signIn("test@example.com", "password");

            expect(getUser).toHaveBeenCalledWith("test@example.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("password", mockUser.password);
            expect(jwt.sign).toHaveBeenCalled();
            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                name: "auth-token",
                value: mockToken,
            }));
        });

        it("should throw error if user is not found", async () => {
            vi.mocked(getUser).mockResolvedValue(null);

            await expect(signIn("test@example.com", "password")).rejects.toThrow("User not found!");
        });

        it("should throw error if password does not match", async () => {
            vi.mocked(getUser).mockResolvedValue(mockUser as any);
            vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

            await expect(signIn("test@example.com", "password")).rejects.toThrow("Invalid password!");
        });
    });

    describe("verifyToken", () => {
        it("should return payload for a valid token", async () => {
            const payload = { user: { id: 1 } };
            vi.mocked(jwt.verify).mockReturnValue(payload as any);

            const result = await verifyToken(mockToken);

            expect(result).toBe(payload);
        });

        it("should return null for an invalid token", async () => {
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const result = await verifyToken(mockToken);

            expect(result).toBeNull();
        });
    });

    describe("setAuthCookie", () => {
        it("should set the auth-token cookie with correct options", async () => {
            const mockSet = vi.fn();
            vi.mocked(cookies).mockResolvedValue({
                set: mockSet,
            } as any);

            await setAuthCookie(mockToken);

            expect(mockSet).toHaveBeenCalledWith({
                name: "auth-token",
                value: mockToken,
                httpOnly: true,
                secure: false, // process.env.NODE_ENV is not "production" during tests
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
        });
    });

    describe("signOut", () => {
        it("should delete the auth-token cookie", async () => {
            const mockDelete = vi.fn();
            vi.mocked(cookies).mockResolvedValue({
                delete: mockDelete,
            } as any);

            await signOut();

            expect(mockDelete).toHaveBeenCalledWith("auth-token");
        });
    });

    describe("auth", () => {
        it("should return the session if a valid token exists in cookies", async () => {
            const mockGet = vi.fn().mockReturnValue({ value: mockToken });
            vi.mocked(cookies).mockResolvedValue({
                get: mockGet,
            } as any);

            const payload = { user: { id: 1 } };
            vi.mocked(jwt.verify).mockReturnValue(payload as any);

            const result = await auth();

            expect(result).toBe(payload);
        });

        it("should return null if no token exists", async () => {
            const mockGet = vi.fn().mockReturnValue(undefined);
            vi.mocked(cookies).mockResolvedValue({
                get: mockGet,
            } as any);

            const result = await auth();

            expect(result).toBeNull();
        });

        it("should return null if token verification fails", async () => {
            const mockGet = vi.fn().mockReturnValue({ value: mockToken });
            vi.mocked(cookies).mockResolvedValue({
                get: mockGet,
            } as any);

            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error("Verification failed");
            });

            const result = await auth();

            expect(result).toBeNull();
        });
    });
});
