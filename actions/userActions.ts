"use server"
import { sql } from "@vercel/postgres"
import { hash } from "bcrypt"
import { db } from "@/lib/database";
import { UserTable } from "@/lib/database/userSchema";
import { eq } from "drizzle-orm";

export const getUserTable = async () => {
    const selectResult = await db.select().from(UserTable);
    return selectResult
};

export async function getUser(email: string) {
    const selectResult = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email)).limit(1);
    if (selectResult.length === 0) return null;
    return selectResult[0];
}
export async function createUser(name: string, email: string, password: string, role: string) {
    try {
        await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(64), email VARCHAR(64), password VARCHAR(128), role VARCHAR(5), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`
        {
            const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`
            if (rows.length > 0) throw new Error("Email already exists, try another email")
        }

        const hashPassword = await hash(password, 10)
        const { rows } = await sql`INSERT INTO users (name, email, password, role ) VALUES (${name}, ${email}, ${hashPassword}, ${role} ) RETURNING *`
        return rows
    }
    catch (err: any) {
        console.log(err)
        throw new Error(err.message)
    }
}