import { createContext } from "react";
import { List } from "@/lib/database/listSchema";
const PlaylistContext = createContext(<List[]>([]))
export default PlaylistContext

