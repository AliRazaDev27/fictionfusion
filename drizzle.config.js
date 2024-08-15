import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';
config({ path: '.env.local' });
export default defineConfig({
  schema: "./lib/database/*.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  }
});