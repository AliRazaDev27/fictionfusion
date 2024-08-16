import { getAuthorInfo, getBooksFromAuthor } from "@/actions/authorActions";

export default async function Page({ params }: any) {
  const authorID = params.authorID;
  const books = await getBooksFromAuthor(authorID);
  const author = await getAuthorInfo(authorID);
  return (
    <div className=" grid grid-cols-2 gap-4 ">
      <div>
        {books?.entries && Array.isArray(books?.entries) && books.entries.map((book: any, index: number) => (
          <div key={index} className="p-4">
            <div className="flex gap-4">
              <span className="font-bold">{index + 1}</span>
              <h1>{book?.title}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="">
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Author Name</p>
          <h1>{author?.name}</h1>
        </div>
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Alternate Names</p>
          <ul className="flex flex-col gap-2">
            {author?.alternate_names && Array.isArray(author.alternate_names) && author.alternate_names.map((name: any, index: number) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Birth Date</p>
          <p>{author?.birth_date}</p>
        </div>
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Death Date</p>
          <p>{author?.death_date}</p>
        </div>
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Wikipedia</p>
          {author?.wikipedia && (
            <a href={author.wikipedia} target="_blank">
              {author.wikipedia}
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <p className="font-semibold text-lg italic">Biography</p>
          <p>{author?.bio?.value ? author?.bio?.value : author?.bio  }</p>
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
