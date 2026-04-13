"use client"
import { getOpenLibraryCoverLink } from "@/lib"
import { Calendar, BookOpen, Star, Tag, Plus, Info, Layers } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { IoMdRemoveCircle } from "react-icons/io";
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { addBookToDB, bookSearchResult, Details } from "@/actions/bookActions"
import { motion, AnimatePresence } from "framer-motion"

export function BookCard({ book, details, index }: { book: bookSearchResult, details: Details, index: number }) {
    const [subjects, setSubjects] = useState(details.subjects || []);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const [editedBook, setEditedBook] = useState({
        title: book.title,
        author_name: book.author_name || [],
        author_key: book.author_key || [],
        cover_edition_key: book?.cover_edition_key || details.covers?.[0] || "",
        openlibrary_work_key: book.key,
        first_publish_year: book.first_publish_year || 0,
        description: !!details.description ? (typeof details.description === 'string' ? details.description : details.description.value) : "No description available.",
        number_of_pages: book.number_of_pages_median || 0,
        rating: String(book.ratings_average || 0),
        tags: subjects,
        covers: details.covers || [],
    });

    const handleSave = async () => {
        setLoading(true);
        const result = await addBookToDB({
            ...editedBook,
            isRead: false,
            isFav: false
        });
        setLoading(false);
        if (result.success) {
            toast({
                title: "Added to DB",
                className: "bg-green-600 text-white",
                duration: 1000
            });
        } else {
            toast({
                title: "Failed to Add",
                description: result.message,
                className: "bg-red-600 text-white",
                duration: 2000
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedBook(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveCover = (index: number) => {
        setEditedBook(prev => ({
            ...prev,
            covers: prev.covers.filter((_, i) => i !== index)
        }));
    };
    return (
        <Card className="w-full max-w-7xl mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-wrap">
                {/* Left Column - Book Cover */}
                <div className="shrink-0 w-1/4 min-w-[320px] mx-auto p-2">
                    <div className="relative aspect-3/4 w-full border bg-gray-100">
                        <img
                            src={getOpenLibraryCoverLink(editedBook.cover_edition_key)}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-contain"
                        />
                        <Badge className="absolute top-2 right-2 bg-gray-800 text-white py-1.5">
                            {details.covers ? details.covers.length : 0} Covers
                        </Badge>
                    </div>
                </div>
                <CardContent>
                    {/* Right Column - Information */}
                    <div className="flex-1 flex flex-col p-8 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-extrabold tracking-tight text-white leading-none">
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-white to-zinc-500">
                                    {book.title}
                                </span>
                            </h3>
                            {book.author_name && book.author_name.length > 0 && (
                                <p className="text-zinc-500 font-medium tracking-wide">
                                    by <span className="text-violet-400 group-hover:text-violet-300 transition-colors uppercase text-xs tracking-widest">{book.author_name.join(", ")}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {book.first_publish_year && (
                                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="text-xs font-bold text-zinc-300 tracking-tighter">{book.first_publish_year}</span>
                                </div>
                            )}
                            {book.number_of_pages_median && (
                                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
                                    <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="text-xs font-bold text-zinc-300 tracking-tighter">{book.number_of_pages_median} Pages</span>
                                </div>
                            )}
                            {book.ratings_average && (
                                <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
                                    <Star className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                                    <span className="text-xs font-black text-violet-300 tracking-tighter">{book.ratings_average.toFixed(1)}</span>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <p className="text-zinc-400/90 leading-relaxed text-sm line-clamp-3 md:line-clamp-4 font-medium italic">
                                {(details.description) as string || "No description available."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 mt-auto border-t border-zinc-900">
                            <div className="flex items-center gap-2">
                                {subjects && subjects.length > 0 && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800">
                                                <Tag className="w-4 h-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">{subjects.length} Subjects</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md bg-black border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,1)]">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black text-white italic tracking-tighter">Subjects</DialogTitle>
                                                <DialogDescription className="text-zinc-500 font-medium">
                                                    Manage the indexed subjects for this edition.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-wrap gap-2 pt-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                                <AnimatePresence mode="popLayout">
                                                    {subjects.map((subject: string, index: number) => (
                                                        <motion.button
                                                            key={`${book.key}-${subject}-${index}`}
                                                            layout
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-400 group/tag transition-all border border-zinc-800 hover:border-red-500/20"
                                                            onClick={() => {
                                                                setSubjects(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            <span className="text-xs font-bold uppercase tracking-tight">{subject}</span>
                                                            <IoMdRemoveCircle className="w-4 h-4 text-zinc-600 group-hover/tag:text-red-400 transition-colors" />
                                                        </motion.button>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="relative overflow-hidden bg-white hover:bg-indigo-50 text-black font-black uppercase tracking-widest text-xs px-8 h-11 rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/20 hover:-translate-y-0.5"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <Layers className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        <Plus className="w-4 h-4 stroke-[3px]" />
                                    )}
                                    {loading ? "Syncing..." : "Add to library"}
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity" />
                            </Button>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-0">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-min ms-auto bg-black/80 hover:bg-green-600 text-white" disabled={loading}>
                                ADD
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Book Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex items-center justify-around gap-2">
                                    <div>
                                        <img src={getOpenLibraryCoverLink(editedBook.cover_edition_key)} alt="Cover" className="w-24 h-36 object-contain border" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Input name="cover_edition_key" value={editedBook.cover_edition_key} onChange={handleInputChange} placeholder="Cover Edition Key" />
                                        <Input name="title" value={editedBook.title} onChange={handleInputChange} placeholder="Title" />
                                        <Input name="author_name" value={editedBook.author_name.join(', ')} onChange={(e) => setEditedBook(prev => ({ ...prev, author_name: e.target.value.split(', ') }))} placeholder="Authors" />
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <Input name="first_publish_year" type="number" value={editedBook.first_publish_year} onChange={handleInputChange} placeholder="First Publish Year" />
                                        <Input name="number_of_pages" type="number" value={editedBook.number_of_pages} onChange={handleInputChange} placeholder="Number of Pages" />
                                        <Input name="rating" value={editedBook.rating} onChange={handleInputChange} placeholder="Rating" />
                                    </div>
                                </div>
                                <textarea name="description" value={editedBook.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded" />
                                <div>
                                    <h4 className="font-semibold mb-2">Covers: {editedBook.covers.length}</h4>
                                    <div className="max-h-80 overflow-y-auto space-y-2  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                                        {editedBook.covers.map((cover, index) => (
                                            <div key={index} className="flex items-center gap-2 p-1 border rounded">
                                                <img src={getOpenLibraryCoverLink(cover, "M")} alt={`Cover ${index + 1}`} className="w-16 h-24 object-contain border" />
                                                <div className="flex-1">
                                                    <Input
                                                        value={cover}
                                                        onChange={(e) => {
                                                            const newCovers = [...editedBook.covers];
                                                            newCovers[index] = e.target.value;
                                                            setEditedBook(prev => ({ ...prev, covers: newCovers }));
                                                        }}
                                                        className="mb-2"
                                                    />
                                                    <Button variant="destructive" size="sm" onClick={() => handleRemoveCover(index)}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </div>
        </Card >
    )
}
