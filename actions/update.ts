"use server"

import { getAllBooks, updateDescription } from "@/lib/database/bookSchema"

export async function addDescription(){
    const books = await getAllBooks();
    for(let book of books){
        const title = book.title;
        const result =  await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`);
        const data = await result.json();
        const items = data.items;
        for(let item of items){
            if(item.volumeInfo.title.includes(title)){
                const description = item.volumeInfo.description;
                if(!description) continue;
                const result = await updateDescription(book.id,description);
                if(result.success){
                    console.log(`Updated description for ${title}`);
                }
                else{
                    console.log(`Failed to update description for ${title}`);
                }
                break;
            }
        }
    }
    return;
}