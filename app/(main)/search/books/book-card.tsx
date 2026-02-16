"use client"
import { getOpenLibraryCoverLink } from "@/lib"
import { Calendar, BookOpen, Star, Tag, Plus, Info, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { IoMdRemoveCircle } from "react-icons/io";
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { addBookToDB, bookSearchResult, Details } from "@/actions/bookActions"
import { motion, AnimatePresence } from "framer-motion"

export function BookCard({ book, details, index }: { book: bookSearchResult, details: Details, index: number }) {
    const [subjects, setSubjects] = useState(details.subjects || []);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()

    const handleAdd = async () => {
        let description = "No description available.";
        if (!!details.description) {
            description = typeof details.description === 'string' ? details.description : details.description.value;
        }
        setLoading(true);
        const result = await addBookToDB({
            title: book.title,
            author_name: book.author_name || [],
            author_key: book.author_key || [],
            cover_edition_key: book?.cover_edition_key || details.covers?.[0] || "",
            openlibrary_work_key: book.key,
            first_publish_year: book.first_publish_year || 0,
            description,
            number_of_pages: book.number_of_pages_median || 0,
            rating: String(book.ratings_average || 0),
            tags: subjects,
            covers: details.covers || [],
            isRead: false,
            isFav: false
        })
        setLoading(false);
        if (result.success) {
            toast({
                title: "Successfully Added",
                description: `${book.title} is now in your library.`,
                className: "bg-zinc-900 border-zinc-800 text-zinc-100",
                duration: 2000
            })
        }
        else {
            toast({
                title: "Failed to Add",
                description: result.message,
                variant: "destructive",
                duration: 3000
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -4 }}
            className="group relative"
        >
            {/* Ambient Background Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 transition duration-500" />

            <Card className="relative w-full max-w-5xl mx-auto overflow-hidden bg-zinc-800 border-zinc-900 shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                    {/* Left Column - Book Cover */}
                    <div className="relative md:w-1/3 lg:w-1/4 p-6 flex items-center justify-center bg-zinc-950/50 border-r border-zinc-900">
                        <div className="relative aspect-[2/3] w-full max-w-[180px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-indigo-500/10">
                            <img
                                src={getOpenLibraryCoverLink(book.cover_edition_key)}
                                alt={`Cover of ${book.title}`}
                                className="w-full h-full object-cover rounded-sm ring-1 ring-white/10"
                            />
                            {details.covers && details.covers.length > 1 && (
                                <div className="absolute -top-3 -right-3 px-2 py-1 bg-violet-600 rounded-lg shadow-xl shadow-violet-900/40 transform rotate-12">
                                    <span className="text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-tighter">
                                        <Layers className="w-2.5 h-2.5" />
                                        {details.covers.length} Ed.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Information */}
                    <div className="flex-1 flex flex-col p-8 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-extrabold tracking-tight text-white leading-none">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
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
                                onClick={handleAdd}
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
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
