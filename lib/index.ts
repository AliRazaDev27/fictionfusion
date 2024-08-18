export type Key = "isbn" | "olid"
export type Size = "S" | "M" | "L"
export const getOpenLibraryCoverLink =  (key:Key,value:string|null,size:Size) => {
    console.log(value)
    if(!value) return "/bookplaceholder.svg"
    value = value.trim()
    return `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg?default=false`
}
export const getOpenLibraryAuthorLink =  (key:Key,value:string,size:Size) => {
    if(!value) return "/bookplaceholder.svg"
    let cleanValue = value.trim()
    if(value.startsWith("{\"")){
        cleanValue = value.slice(2,-2)
        console.log("clean",cleanValue)
    }
    

    return `https://covers.openlibrary.org/a/${key}/${cleanValue}-${size}.jpg?default=false`
}
export const getAuthorId = (value:string) => {
    if(!value) return
    value = value.trim()
    if(value.startsWith("{\"")){
        value = value.slice(2,-2)
    }
    return value
}