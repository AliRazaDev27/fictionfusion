export type Key = "isbn" | "olid" | "id"
export type Size = "S" | "M" | "L"
export const getOpenLibraryCoverLink =  (value:string|null) => {
    if(!value) return "/bookplaceholder.svg"
    value = value.trim()
    let key = "isbn"
    if(value.startsWith("OL")){
        key="olid"
    }
    else if(value.length === 8){
        key = "id"
    }
    return `https://covers.openlibrary.org/b/${key}/${value}-M.jpg`
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
    return `${tmdb_baseUrl}${size}${value}`
 }   

async function getSignedUrl() {
  const response = await fetch('/api/getSignedUrl', {
    method: 'POST',
  });
  return response.json();
}

export async function uploadToCloudinary(file) {
  const { signature, timestamp, cloud_name, api_key } = await getSignedUrl();
  if(!signature || !timestamp || !cloud_name || !api_key) return
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;

  const response = await fetch(cloudinaryUploadUrl, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

export interface Film {
  year: string;
  title: string;
  link: string | undefined;
  episodes: string;
  role: string;
  rating: string;
}

export interface FilmData {
  [category: string]: Film[];
}