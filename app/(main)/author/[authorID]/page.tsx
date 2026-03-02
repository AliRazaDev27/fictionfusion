import { getAuthorInfo, getBooksFromAuthor } from "@/actions/authorActions";
import Link from "next/link";
import {franc} from "franc";



export default async function Page(props: any) {
  const params = await props.params;
  const authorID = params.authorID;
  const books = await getBooksFromAuthor(authorID);
  const englishBooks = books?.entries.filter((book: any) => franc(book?.title) === "eng");
  const uniqueTitle = new Set(englishBooks?.map((book: any) => book?.title));
  const uniqueBooks = Array.from(uniqueTitle);
  const author = await getAuthorInfo(authorID);
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 py-8 text-white">
      <div className="row-start-2 md:row-start-1 px-4">
        <h1 className="text-3xl">Notable Works</h1>
        <div className="px-2 pt-2 text-white/70">
        <ol className="list-decimal list-inside space-y-3">
        {uniqueBooks && uniqueBooks.map((title: any,index:number) => (
          <li key={index}><Link href={`/search/books?query=${title}`}>{title}</Link></li>
        ) 
        )}
        </ol>
        </div>
      </div>
      <div className="px-4">
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-lg italic">Author Name</p>
          <h1 className="text-xl md:text-2xl text-white/80">{author?.name}</h1>
        </div>
       <div className="flex gap-4 md:gap-8">
       <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Born</p>
          <p className="text-white/70">{author?.birth_date}</p>
        </div>
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Died</p>
          <p className="text-white/70">{author?.death_date}</p>
        </div>
       </div>
        
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Wikipedia</p>
          {author?.wikipedia && (
            <a href={author.wikipedia} target="_blank">
              <p className="text-white/70">{author.wikipedia}</p>
            </a>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg italic">Biography</p>
          <p className="text-white/70">{author?.bio?.value ? author?.bio?.value : author?.bio  }</p>
        </div>

        <div className="flex flex-wrap gap-2  shadow-lg rounded-lg">
          {author?.photos && Array.isArray(author.photos) && author.photos.map((id: string, index: number) => {
            return (
              <div key={index}>
                <img
                  src={`https://covers.openlibrary.org/a/id/${id}-M.jpg`}
                  alt="author_photo"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
