import React, { useState } from "react";
import { addToCollection, searchBooks } from "../services/BookService";
import { toast } from "react-toastify";

const SearchPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ You are not authenticated.");
      return;
    }

    if (!title && !author && !subject) {
      toast.warn("🔍 Please fill in at least one search field.");
      return;
    }

    setSearchInitiated(true);
    try {
      setLoading(true);
      const data = await searchBooks(token, { title, author, subject });
      setResults(data);
    } catch (err) {
      toast.error("❌ Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (book: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ You are not authenticated.");
      return;
    }

    try {
      await addToCollection(token, {
        googleBookId: book.id,
        title: book.title,
        authors: book.authors || ["Unknown Author"],
        subject: book.subject || "Unknown",
        thumbnailUrl: book.thumbnailUrl || "",
        status: "PLAN_TO_READ",
      });
      toast.success("✅ Book added to your collection!");
    } catch (err) {
      toast.error("❌ Failed to add book.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search for Books</h1>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          className="border p-2 flex-1"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject"
          className="border p-2 flex-1"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              Loading...
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        🔍 Search your favorite book using title, author or subject.
      </p>

      <div className="space-y-4">
        {loading && (
          <div className="text-center text-gray-500 py-8">
            Searching for books...
          </div>
        )}

        {!loading && searchInitiated && results.length === 0 && (title || author || subject) && (
          <div className="text-center text-gray-500 py-8">
            No results found. Try a different search!
          </div>
        )}

        {!loading && !searchInitiated && results.length === 0 && !(title || author || subject) && (
            <div className="text-center text-gray-500 py-8">
                Type in the fields above and click "Search" to find books.
            </div>
        )}

        <div className="space-y-4">
          {results.map((book) => (
            <div
              key={book.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-600">
                  {book.authors?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Subject:</strong> {book.subject || "Unknown"}
                </p>
              </div>
              <button
                onClick={() => handleAddToCollection(book)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Add to Collection
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;