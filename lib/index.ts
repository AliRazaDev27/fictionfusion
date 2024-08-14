export type Key = "isbn" | "olid"
export type Size = "S" | "M" | "L"
export const getOpenLibraryCoverLink =  (key:Key,value:string,size:Size) => {
    return `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg?default=false`
}