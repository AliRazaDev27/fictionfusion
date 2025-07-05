"use client"
import { getOpenLibraryCoverLink } from "@/lib"
import { Calendar, Globe, BookOpen, Tag, Cross } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { IoMdRemoveCircle } from "react-icons/io";
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { addBookToDB, bookSearchResult, Details } from "@/actions/bookActions"

export function BookCard({ book, details }: { book: bookSearchResult, details: Details }) {
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
                <div className="flex-shrink-0 w-1/4 min-w-[320px] mx-auto p-2">
                    <div className="relative aspect-[3/4] w-full border bg-gray-100">
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

                {/* Right Column - Book Information */}
                <div className="flex-1 flex flex-col">
                    <CardHeader className="pb-3">
                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{book.title}</h3>
                        {book.author_name && book.author_name.length > 0 && (
                            <p className="text-sm text-muted-foreground">by {book.author_name.join(", ")}</p>
                        )}
                    </CardHeader>

                    <CardContent className="flex-1 pt-0 pb-3 space-y-3">

                        <p className="text-sm text-gray-600 leading-relaxed">
                            {
                                details.description
                                    ? typeof details.description === 'string'
                                        ? details.description
                                        : details.description.value
                                    : "No description available."
                            }
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                                {book.first_publish_year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{book.first_publish_year}</span>
                                    </div>
                                )}

                                {book.number_of_pages_median && (
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        <span>{book.number_of_pages_median}p</span>
                                    </div>
                                )}

                                {book.ratings_average && (
                                    <div className="flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        <span>{book.ratings_average.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            {
                                subjects && subjects.length > 0 && (
                                    <Dialog>
                                        <DialogTrigger>
                                            <div className="flex items-center gap-1 p-2 hover:border hover:bg-gray-200 rounded-lg cursor-pointer">
                                                <Tag className="w-3 h-3" />
                                                <span>{subjects.length}</span>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-500 border border-black shadow-xl shadow-gray-800 overflow-y-auto h-full md:h-[90%]">
                                            <DialogHeader>
                                                <DialogTitle className="font-semibold">Subjects</DialogTitle>
                                                <DialogDescription className="sr-only">
                                                    Click on a subject to remove it from the list.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-2">
                                                {/* maybe add animations for removal here */}
                                                {
                                                    subjects.map((subject: any, index: number) => (
                                                        <button key={`tags-${book.title}-${index}`} className="flex items-center gap-2 border border-black w-full px-3 py-3 rounded-3xl bg-blue-300 hover:bg-red-300 group"
                                                            onClick={() => {
                                                                // remove this tag from the list
                                                                console.log("Removing subject:", subject);
                                                                setSubjects((prevSubjects) => {
                                                                    const newSubjects = [...prevSubjects];
                                                                    newSubjects.splice(index, 1);
                                                                    return newSubjects;
                                                                });
                                                            }}
                                                        >
                                                            <IoMdRemoveCircle className="w-6 h-6 text-neutral-100 group-hover:text-red-500" />
                                                            <span className="group-hover:font-semibold">{subject}</span>
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )

                            }
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
            </div>
        </Card>
    )
}
