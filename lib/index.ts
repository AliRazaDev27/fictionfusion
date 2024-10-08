export type Key = "isbn" | "olid"
export type Size = "S" | "M" | "L"
export const getOpenLibraryCoverLink =  (key:Key,value:string|null,size:Size) => {
    if(!value) return "/bookplaceholder.svg"
    value = value.trim()
    return `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg?default=false`
}
export const getOpenLibraryAuthorLink =  (key:Key,value:string,size:Size) => {
    if(!value) return "/bookplaceholder.svg"
    let cleanValue = value.trim()
    if(value.startsWith("{\"")){
        cleanValue = value.slice(2,-2)
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
type PosterSize = 
      "w92"|
      "w154"|
      "w185"|
      "w342" |
      "w500" |
      "w780" |
      "original"
    
const tmdb_baseUrl = "https://image.tmdb.org/t/p/" 
 export const getMoviePosterLink = (value:string,size:PosterSize) => {
    if(!value) return "/bookplaceholder.svg"
    return `${tmdb_baseUrl}w185${value}`
 }   