import { SQL } from "drizzle-orm"

export type User = {
    id: string
    name: string
    email: string
    role: string
    password: string
    created_at: string
    updated_at: string
}
export type Book = {
    id?:number
    title: string
    author_name: string
    author_id: string
    cover_edition_key: string
    first_publish_year: string
    first_sentence: string|null
    olid: string[]|null
    number_of_pages: number|null
    rating: string|null
}
export type SortBook = {
    year_newest:SQL<unknown>
    year_oldest:SQL<unknown>
    rating_max:SQL<unknown>
    rating_min:SQL<unknown>
    pages_max:SQL<unknown>
    pages_min:SQL<unknown>
    [key:string]:SQL<unknown>
}
export type Show = {
    id:number,
    name:string,
    type:string,
    language:string,
    genres:string[]|null,
    status:string,
    runtime:string,
    premiered:string,
    ended:string,
    rating:{
        average?:number|null
    },
    image:{
        medium?:string,
        original?:string,
    },
    summary:string,
}
