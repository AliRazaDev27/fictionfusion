import { SQL } from "drizzle-orm"
import type { Book, NewBook } from "@/lib/database/bookSchema"
import type { Show, NewShow } from "@/lib/database/showSchema"
import type { User, NewUser } from "@/lib/database/userSchema"
export type { Book, NewBook }
export type { Show, NewShow }
export type { User, NewUser }


export type SortBook = {
    year_newest:SQL<unknown>
    year_oldest:SQL<unknown>
    rating_max:SQL<unknown>
    rating_min:SQL<unknown>
    pages_max:SQL<unknown>
    pages_min:SQL<unknown>
    [key:string]:SQL<unknown>
}
