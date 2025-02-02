import {create} from "zustand";
import { List } from "@/lib/database/listSchema";
import { Music } from "@/lib/database/musicSchema";

export const useMusicStore = create((set,get: any) => ({
  playlist: [] as List[], 
  music: [] as Music[], 
  current: 0,
  fullMusicList: [] as List[],
  addPlaylist: (playlist: List[]) => set({ playlist }), 
  addMusic: (music: Music[]) => set({ music }), 
  setCurrent: (current: number) => set({ current }),
  setFullMusicList: (fullMusicList: List[]) => set({ fullMusicList }),
  filterMusicList: (title: string) => {
    const filteredMusic = get().fullMusicList.filter((music) =>
      music.title.toLowerCase().includes(title.toLowerCase())
    );
    set({ music: filteredMusic });
  },
  clearFilter: () => set({ music: get().fullMusicList }),
}))

