import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';
import * as bookSchema from './bookSchema';
import * as celebSchema from './celebSchema';
import * as ignorelistSchema from './ignorelistSchema';
import * as listSchema from './listSchema';
import * as movieSchema from './movieSchema';
import * as musicSchema from './musicSchema';
import * as showSchema from './showSchema';
import * as taskSchema from './taskSchema';
import * as userListTable from './userListTable';
import * as userSchema from './userSchema';

config({ path: '.env.local' }); // or .env

export const db = drizzle(sql, { schema: { ...bookSchema, ...celebSchema, ...ignorelistSchema, ...listSchema, ...movieSchema, ...musicSchema, ...showSchema, ...taskSchema, ...userListTable, ...userSchema } });
