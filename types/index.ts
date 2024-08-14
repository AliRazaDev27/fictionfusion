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
    title: string
    author: string
    cover_edition_key: string
    first_publish_year: string
    first_sentence: string|null
    isbn: string[]|null
    number_of_pages: number|null
    rating: string|null
}