import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as cheerio from 'cheerio';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
  export const movieSortOptions = [
    { value: "year_newest", label: "Year: Newest" },
    { value: "year_oldest", label: "Year: Oldest" },
    { value: "rating_max", label: "Rating: High to Low" },
    { value: "rating_min", label: "Rating: Low to High" },
  ]
export function getSortOptions(type:string) {
  // can be improved
  if(type === "books"){
    return bookSortOptions
  }
  if(type === "shows"){
    return showSortOptions
  }
  if(type === "movies"){
    return movieSortOptions
  }
  return []
}
const genre = {
  "28": "Action",
  "12": "Adventure",
  "16": "Animation",
  "35": "Comedy",
  "80": "Crime",
  "99": "Documentary",
  "18": "Drama",
  "10751": "Family",
  "14": "Fantasy",
  "36":"History",
  "27":"Horror",
  "10402":"Music",
  "9648":"Mystery",
  "10749":"Romance",
  "878":"Science Fiction",
  "10770":"TV Movie",
  "53":"Thriller",
  "10752":"War",
  "37":"Western",
}
export function getGenre(id) {
  return genre[id]
}