export type Key = "isbn" | "olid"
export type Size = "S" | "M" | "L"
export const getOpenLibraryCoverLink =  (key:Key,value:string,size:Size) => {
    console.log(value)
    if(!value) return
    value = value.trim()
    return `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg?default=false`
}
export const getOpenLibraryAuthorLink =  (key:Key,value:string,size:Size) => {
    
    let cleanValue = value.trim()
    if(value.startsWith("{\"")){
        cleanValue = value.slice(2,-2)
        console.log("clean",cleanValue)
    }
    

    return `https://covers.openlibrary.org/a/${key}/${cleanValue}-${size}.jpg?default=false`
}