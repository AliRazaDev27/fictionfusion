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