import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCollection, searchBooks, getBookDetails } from "../services/BookService";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import BookDetailModal from "../components/BookDetailModal";
import { Book } from "../types/Book";

const SearchPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const navigate = useNavigate();

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      navigate("/");
      return;
    }

    if (!title && !author) {
      toast.warn("Please fill in at least one search field.");
      setResults([]);
      setSearchInitiated(false);
      return;
    }

    setSearchInitiated(true);
    setLoading(true);

    try {
      const data = await searchBooks(token, { title, author });

      const formattedResults = data.map((book: any) => ({
        ...book,
        subject: book.categories?.[0] || "Unknown",
      }));

      setResults(formattedResults);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        toast.error("Your session has expired. Please log in again.");
        navigate("/");
      } else {
        toast.error("❌ Search failed. Please try again.");
      }

      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (book: Book) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      navigate("/");
      return;
    }

    try {
      await addToCollection(token, {
        googleBookId: book.id,
        title: book.title,
        authors: book.authors || ["Unknown Author"],
        subject: book.subject || "Unknown",
        thumbnailUrl: book.thumbnailUrl || "",
        averageRating: book.averageRating || null,
        status: "PLAN_TO_READ",
      });
      toast.success("📚 Book added to your collection!");
    } catch (err: any) {
      if (
        err?.response?.status === 400 &&
        err.response.data?.error?.toLowerCase().includes("already") &&
        err.response.data?.error?.toLowerCase().includes("saved")
      ) {
        toast.warning("You’ve already added this book to your collection.");
      } else {
        toast.error("Failed to add book. Please try again.");
      }
    }
  };

  const handleCardClick = async (book: Book) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      navigate("/");
      return;
    }

    try {
      const details = await getBookDetails(token, book.id);
      const detailedBook = { ...book, ...details };
      setSelectedBook(detailedBook);
    } catch (error: any) {
      toast.error("Failed to load book details.");
      setSelectedBook(book);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <MagnifyingGlassIcon className="h-8 w-8 inline-block mr-2 text-blue-600" />
        Search for Books
      </h1>

      <div className="flex flex-wrap gap-2 mb-6 justify-center items-end">
  <div className="flex flex-col w-full max-w-xs">
    <label htmlFor="title-search" className="mb-1 text-sm font-medium text-gray-800">Title</label>
    <input
      id="title-search"
      type="text"
      placeholder="Example: Lord of the Rings"
      className="border p-2 rounded w-full"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
    />
  </div>
  <div className="flex flex-col w-full max-w-xs">
    <label htmlFor="author-search" className="mb-1 text-sm font-medium text-gray-800">Author</label>
    <input
      id="author-search"
      type="text"
      placeholder="Example: J.K. Rowling"
      className="border p-2 rounded w-full"
      value={author}
      onChange={(e) => setAuthor(e.target.value)}
      onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
    />
  </div>
  <div className="flex flex-col">
    <label className="invisible mb-1 text-sm">Search</label>
    <button
      className={`h-[42px] px-5 text-base rounded-md text-white transition w-full sm:w-auto ${
        loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
      onClick={handleSearch}
      disabled={loading}
    >
      {loading ? "Searching..." : "Search"}
    </button>
  </div>
</div>


      {!loading && !searchInitiated && results.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          <div className="mb-8 flex justify-center">
            <AcademicCapIcon className="h-24 w-24 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Ready to explore new books?</h2>
          <p className="text-base text-gray-700 mb-6">
            Enter a book title or author in the fields above and hit "Search" to discover millions of titles.
          </p>
        </div>
      )}

      {!loading && searchInitiated && results.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          <p className="text-xl font-semibold mt-4 mb-2">No results found.</p>
          <p className="text-base">Try a different search query or check for typos!</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((book) => (
            <div
              key={book.id}
              onClick={() => handleCardClick(book)}
              className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {book.thumbnailUrl ? (
                <img
                  src={book.thumbnailUrl}
                  alt={book.title}
                  className="w-full h-56 object-contain rounded-lg shadow mb-3"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h3 className="text-md font-semibold mb-1 truncate w-full">{book.title}</h3>
              <p className="text-sm text-gray-600 truncate w-full">
                {book.authors?.join(", ") || "Unknown Author"}
              </p>
              <p className="text-sm text-gray-500 w-full">
                <strong>Subject:</strong> {book.subject || "Unknown"}
              </p>
              {typeof book.averageRating === "number" && !isNaN(book.averageRating) && (
                <p className="text-sm text-yellow-600 font-semibold">
                  ⭐ {book.averageRating.toFixed(1)} / 5
                </p>
              )}
              {typeof book.ratingsCount === "number" && book.ratingsCount > 0 && (
                <p className="text-sm text-gray-500">
                  ({book.ratingsCount} ratings)
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCollection(book);
                }}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add to Collection
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default SearchPage;
