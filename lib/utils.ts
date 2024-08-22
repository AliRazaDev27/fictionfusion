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

export const bookSortOptions = [
    { value: "year_newest", label: "Year: Newest" },
    { value: "year_oldest", label: "Year: Oldest" },
    { value: "rating_max", label: "Rating: High to Low" },
    { value: "rating_min", label: "Rating: Low to High" },
    { value: "pages_max", label: "Page Count: High to Low" },
    { value: "pages_min", label: "Page Count: Low to High" },
  ]

  export const showSortOptions = [
    { value: "year_newest", label: "Year: Newest" },
    { value: "year_oldest", label: "Year: Oldest" },
    { value: "rating_max", label: "Rating: High to Low" },
    { value: "rating_min", label: "Rating: Low to High" },
  ]
export function getSortOptions(type) {
  if(type === "books"){
    return bookSortOptions
  }
  if(type === "shows"){
    return showSortOptions
  }
  return []
}