"use client"
import { getMusic, deleteMusic, updateMusicMetadata } from "@/actions/musicActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music } from "@/lib/database/musicSchema";
import { useEffect, useState, useRef, useCallback } from "react";
import { Pencil, Trash2, Image, ListFilter, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllMusicPlaylists, addToPlaylist, removeFromPlaylist } from "@/actions/playlistActions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { revalidateMusic } from "@/actions/musicActions";

const ITEMS_PER_PAGE = 16;

export default function Page() {
  const [musicData, setMusicData] = useState<Music[]>([]);
  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    album: "",
    releaseDate: "",
    coverArt: "",
  });
  const { toast } = useToast();
  const observer = useRef<IntersectionObserver>(null);

  const fetchPlaylists = useCallback(async () => {
    const result = await getAllMusicPlaylists();
    if (result.success && result.lists) {
      setAllPlaylists(result.lists);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch playlists.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const fetchMusic = useCallback(async (currentOffset: number, isInitialLoad: boolean = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const result = await getMusic(currentOffset, ITEMS_PER_PAGE);
    if (result.success && result.music) {
      setMusicData((prev) => {
        const newMusic = result.music.filter(
          (newM) => !prev.some((existingM) => existingM.id === newM.id)
        );
        const updatedList = [...prev, ...newMusic];
        setHasMore(updatedList.length < result.totalCount);
        return updatedList;
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch music data.",
        variant: "destructive",
      });
      setHasMore(false);
    }
    if (isInitialLoad) {
      setLoading(false);
    } else {
      setLoadingMore(false);
    }
  }, [toast]);

  useEffect(() => {
    // This useEffect is for the initial load only
    fetchMusic(0, true);
  }, [fetchMusic]);

  useEffect(() => {
    // This useEffect handles subsequent loads via IntersectionObserver
    if (loading || loadingMore || !hasMore) return;

    const lastElement = document.querySelector("#last-music-row");
    if (!lastElement) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setOffset((prevOffset) => prevOffset + ITEMS_PER_PAGE);
      }
    });

    observer.current.observe(lastElement);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore]); // Removed offset from dependencies as it is handled by setOffset callback

  useEffect(() => {
    // This useEffect triggers fetchMusic when offset changes (for infinite scroll)
    if (offset > 0) {
      fetchMusic(offset);
    }
  }, [offset, fetchMusic]);


  const handleDelete = async (id: number) => {
    const result = await deleteMusic(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Music deleted successfully.",
      });
      setMusicData((prev) => prev.filter((music) => music.id !== id));
      // No need to reset offset and refetch all data, as we are directly updating the state
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete music.",
        variant: "destructive",
      });
    }
  };

  const handleAssignPlaylist = async (musicId: number, playlistId: number, isChecked: boolean) => {
    let result;
    if (isChecked) {
      result = await addToPlaylist(playlistId, [musicId]);
    } else {
      result = await removeFromPlaylist(playlistId, [musicId]);
    }

    if (result?.success) {
      toast({
        title: "Success",
        description: `Music ${isChecked ? "added to" : "removed from"} playlist.`,
      });
      // Update the local allPlaylists state to reflect the change
      setAllPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, items: result.items }
            : playlist
        )
      );
    } else {
      toast({
        title: "Error",
        description: result?.message || `Failed to ${isChecked ? "add to" : "remove from"} playlist.`,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (music: Music) => {
    setSelectedMusic(music);
    setEditForm({
      title: music.title,
      artist: music.artist,
      album: music.album || "",
      releaseDate: music.releaseDate || "",
      coverArt: music.coverArt || "",
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateMetadata = async () => {
    if (!selectedMusic) return;

    const metadata = {
      artistName: editForm.artist,
      artworkUrl100: editForm.coverArt,
      collectionName: editForm.album,
      releaseDate: editForm.releaseDate,
      trackName: editForm.title,
      trackTimeMillis: 0, // This field is not editable in the UI, so we can set it to 0 or fetch it if needed.
    };

    const result = await updateMusicMetadata(selectedMusic.id, metadata);
    if (result.success) {
      toast({
        title: "Success",
        description: "Music metadata updated successfully.",
      });
      setMusicData((prev) =>
        prev.map((music) =>
          music.id === selectedMusic.id
            ? { ...music, ...editForm, artist: editForm.artist, album: editForm.album, coverArt: editForm.coverArt, releaseDate: editForm.releaseDate, title: editForm.title }
            : music
        )
      );
      setSelectedMusic(null);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update music metadata.",
        variant: "destructive",
      });
    }
  };

  const handleRevalidateMusic = async () => {
    toast({
      title: "Revalidating...",
      description: "Refreshing music data.",
    });
    await revalidateMusic();
    fetchMusic(0, true); // Re-fetch initial data after revalidation
    setOffset(0); // Reset offset
    setMusicData([]); // Clear existing data to force a fresh load
    setHasMore(true); // Reset hasMore
    toast({
      title: "Success",
      description: "Music data revalidated.",
    });
  };

  return (
    <div className="text-white md:w-[95%] ms-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Music</h1>
        <Button onClick={handleRevalidateMusic} variant="outline" className="flex text-black cursor-pointer items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Revalidate
        </Button>
      </div>

      {loading ? (
        <p>Loading music...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Playlists</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {musicData.map((music, index) => (
                <TableRow key={music.id} id={index === musicData.length - 1 ? "last-music-row" : undefined}>
                  <TableCell>
                    {music.coverArt ? (
                      <img src={music.coverArt} alt={music.title} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                        <Image className="text-gray-400" size={24} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{music.title}</TableCell>
                  <TableCell>{music.artist}</TableCell>
                  <TableCell>{music.album || "N/A"}</TableCell>
                  <TableCell>{music.releaseDate || "N/A"}</TableCell>
                  <TableCell>{music.duration || "N/A"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ListFilter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-slate-800 text-white">
                        <DropdownMenuLabel>Assign to Playlist</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {allPlaylists.length > 0 ? (
                          allPlaylists.map((playlist) => (
                            <DropdownMenuCheckboxItem
                              key={playlist.id}
                              checked={playlist.items?.includes(music.id)}
                              onCheckedChange={(isChecked) => handleAssignPlaylist(music.id, playlist.id, isChecked)}
                            >
                              {playlist.listName}
                            </DropdownMenuCheckboxItem>
                          ))
                        ) : (
                          <DropdownMenuLabel>No playlists found.</DropdownMenuLabel>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={selectedMusic?.id === music.id} onOpenChange={(open) => !open && setSelectedMusic(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(music)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {selectedMusic && (
                          <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white">
                            <DialogHeader>
                              <DialogTitle>Edit Music</DialogTitle>
                              <DialogDescription>
                                Make changes to the music metadata here. Click save when you are done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                  Title
                                </Label>
                                <Input id="title" value={editForm.title} onChange={handleEditChange} className="col-span-3 bg-slate-700 border-none text-white" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="artist" className="text-right">
                                  Artist
                                </Label>
                                <Input id="artist" value={editForm.artist} onChange={handleEditChange} className="col-span-3 bg-slate-700 border-none text-white" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="album" className="text-right">
                                  Album
                                </Label>
                                <Input id="album" value={editForm.album} onChange={handleEditChange} className="col-span-3 bg-slate-700 border-none text-white" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="releaseDate" className="text-right">
                                  Release Date
                                </Label>
                                <Input id="releaseDate" value={editForm.releaseDate} onChange={handleEditChange} className="col-span-3 bg-slate-700 border-none text-white" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="coverArt" className="text-right">
                                  Cover Art URL
                                </Label>
                                <Input id="coverArt" value={editForm.coverArt} onChange={handleEditChange} className="col-span-3 bg-slate-700 border-none text-white" />
                              </div>
                            </div>
                            <DialogClose asChild>
                              <Button type="button" onClick={handleUpdateMetadata}>
                                Save changes
                              </Button>
                            </DialogClose>
                          </DialogContent>
                        )}
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the music
                              and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(music.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {loadingMore && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading more music...
                  </TableCell>
                </TableRow>
              )}
              {!hasMore && musicData.length > 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No more music to load.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
