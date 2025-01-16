import {create} from "zustand";
import { List } from "@/lib/database/listSchema";
import { Music } from "@/lib/database/musicSchema";

export const useMusicStore = create((set) => ({
  playlist: [] as List[], 
  music: [] as Music[], 
  current: 0,
  addPlaylist: (playlist: List[]) => set({ playlist }), 
  addMusic: (music: Music[]) => set({ music }), 
  setCurrent: (current: number) => set({ current }),
}))

