import { auth } from "@/auth";
import { getBookTable } from "@/lib/database/bookSchema";
import { getUserTable } from "@/lib/database/userSchema";
export default async function Home() {
const users = await getBookTable()
  return (
    <main>
      {Array.isArray(users[0].isbn) ? "Array" : "Object"}
      {/* {users && users.map((user,index) =>
        <div key={index}>
<p>{user.title}</p>
<p>{user.author}</p>
<p>{user.first_sentence}</p>
<div>
  <ul>
    {user?.isbn && user.isbn.map((isbn,index) => <li key={index}>{isbn}</li>)}
  </ul>
</div>
        </div>

      )} */}
      </main>
  );
}
