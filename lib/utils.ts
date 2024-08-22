import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import * as cheerio from 'cheerio';

export function stripHtml(html:string) {
    const data = cheerio.load(html);
    const text = data.text();
    return text;
  }
