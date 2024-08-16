"use server";
import { franc } from "franc";
import { addBook, deleteImageFromOlid, setCoverImage } from "@/lib/database/bookSchema";
export async function getBookFromOpenLibrary(bookName:string){
    try{
    let safeTitle = bookName.trim()   
    const titleUrl = encodeURIComponent(safeTitle);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${titleUrl}`
    );
    const result = await response.json();
    const book = result.docs[0];
      let {title, first_publish_year, number_of_pages_median, ratings_average, edition_key} = book
      let {author_key,cover_edition_key} = book
      if(!author_key){
        author_key = "Unknown"
      }
      if(Array.isArray(author_key)){
        author_key = author_key[0]
      }
      console.log(cover_edition_key)
      if(!cover_edition_key){
        cover_edition_key = edition_key[0]
      }
      if(!first_publish_year){
        first_publish_year = "null"
      }
      let altTitle = title
      if(franc(title) !== "eng"){
        altTitle = name
      }
      const author_name = book?.author_name ? book?.author_name[0] : "";
      let first_sentence = ""
      if(book?.first_sentence){
        if(Array.isArray(book?.first_sentence)){
          let sentence = book?.first_sentence.find((value:string)=> franc(value)==="eng")
          if(sentence){
            first_sentence = sentence
          }
          else{
            first_sentence = book?.first_sentence[0]
          }
        }
        else{
          first_sentence = book?.first_sentence
        }
      }
      const store = await addBook({
        title:altTitle, author_name,author_id:author_key, cover_edition_key, first_publish_year, first_sentence, olid:edition_key, number_of_pages:number_of_pages_median, rating:ratings_average
      })

} catch (err) {
  console.log(err);
}
}
export async function deleteImageFromGallery(value:string,id:number){
const result = await deleteImageFromOlid(value,id)
return result
}
export async function setBookCoverImage(value:string,id:number){
  const result = await setCoverImage(value,id)
  return result
}
