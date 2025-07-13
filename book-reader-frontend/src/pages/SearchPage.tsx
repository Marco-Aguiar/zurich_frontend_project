import React, { useState } from "react";
import { addToCollection, searchBooks } from "../services/BookService";
import { toast } from "react-toastify";

const SearchPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }

    if (!title && !author) {
      toast.warn("Please fill in at least one search field.");
      return;
    }

    setSearchInitiated(true);
    try {
      setLoading(true);
      const data = await searchBooks(token, { title, author });

      const formattedResults = data.map((book: any) => ({
        ...book,
        subject: book.categories?.[0] || "Unknown",
      }));

      setResults(formattedResults);
    } catch {
      toast.error("Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (book: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
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
        err.response.data?.error &&
        err.response.data.error.toLowerCase().includes("already") &&
        err.response.data.error.toLowerCase().includes("saved")
      ) {
        toast.warning("You’ve already added this book to your collection.");
      } else {
        toast.error("Failed to add book. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Search for Books</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-col w-full max-w-md">

          <label className="mb-1 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            placeholder="Example: Lord of the rings"
            className="border p-2 flex-1 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">

          <label className="mb-1 text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            placeholder="Example: J.K. Rowling"
            className="border p-2 flex-1 rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6 text-center">
        Use title, author or subject to find books from Google Books.
      </p>

      {loading && (
        <p className="text-center text-gray-500">Searching for books...</p>
      )}

      {!loading && searchInitiated && results.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No results found. Try a different search!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
          >
            {book.thumbnailUrl ? (
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                // CLASSE ATUALIZADA AQUI
                className="w-full h-56 object-contain rounded-lg shadow mb-3"
              />
            ) : (
              <div
                // CLASSE ATUALIZADA AQUI
                className="w-full h-56 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500"
              >
                No Image
              </div>
            )}

            <h3 className="text-md font-semibold mb-1 truncate w-full">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 truncate w-full">
              {book.authors?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-sm text-gray-500 w-full">
              <strong>Subject:</strong> {book.subject || "Unknown"}
            </p>

            {typeof book.averageRating === "number" &&
              !isNaN(book.averageRating) && (
                <p className="text-sm text-yellow-600 font-semibold">
                  ⭐ {book.averageRating.toFixed(1)} / 5
                </p>
              )}

            {typeof book.ratingsCount === "number" &&
              book.ratingsCount > 0 && (
                <p className="text-sm text-gray-500">
                  ({book.ratingsCount} ratings)
                </p>
              )}

            <button
              onClick={() => handleAddToCollection(book)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Add to Collection
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;