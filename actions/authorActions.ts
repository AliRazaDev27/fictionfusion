export async function getAuthorInfo(authorID: string) {
    const result = await fetch(`https://openlibrary.org/authors/${authorID}.json`);
    const response = await result.json();
    return response;
}
export async function getBooksFromAuthor(authorID: string) {
    const result = await fetch(`https://openlibrary.org/authors/${authorID}/works.json?limit=100`);
    const response = await result.json();
    return response
}