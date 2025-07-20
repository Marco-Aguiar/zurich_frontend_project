import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  addToCollection,
  getRecommendations,
  getBookDetails,
} from "../services/BookService";
import { LightBulbIcon, SparklesIcon } from "@heroicons/react/24/outline";
import BookDetailModal from "../components/BookDetailModal";

const CATEGORY_OPTIONS = [
  "Art",
  "Children",
  "Drama",
  "Education",
  "Fiction",
  "History",
  "Medical",
  "Philosophy",
  "Religion",
  "Science",
  "Travel",
];

const RecommendationsPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  const handleRecommend = async () => {
    if (!title.trim() && !subject.trim()) {
      toast.warn("Please enter a title or a subject.");
      setRecommendations([]);
      setSearchTriggered(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }

    setSearchTriggered(true);
    setLoading(true);
    setRecommendations([]);

    try {
      const data = await getRecommendations(token, { title, subject });
      const formattedResults = data.map((book: any) => ({
        ...book,
        subject: book.categories?.[0] || "Unknown",
      }));
      setRecommendations(formattedResults);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
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
      const status = err?.response?.status;
      const errorMessage = err?.response?.data?.error;

      if (
        status === 400 &&
        errorMessage?.toLowerCase().includes("already") &&
        errorMessage?.toLowerCase().includes("saved")
      ) {
        toast.warn("You’ve already added this book to your collection.");
      } else {
        toast.error(errorMessage || "Failed to add book. Please try again.");
      }
    }
  };

  const handleCardClick = async (book: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }

    try {
      const details = await getBookDetails(token, book.id);
      setSelectedBook({ ...book, ...details });
    } catch (err) {
      toast.error("Failed to load book details.");
      setSelectedBook(book);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <SparklesIcon className="h-8 w-8 inline-block mr-2 text-purple-600" />
        Book Recommendations
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-4 justify-center mb-6">
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="title-recommendation" className="mb-1 text-sm font-medium text-gray-800">
            Title
          </label>
          <input
            id="title-recommendation"
            type="text"
            placeholder="Example: Trivium"
            className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleRecommend();
            }}
          />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="subject-recommendation" className="mb-1 text-sm font-medium text-gray-800">
            Subject
          </label>
          <div className="relative w-full">
            <select
              id="subject-recommendation"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border p-2 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Select a subject --</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              ▼
            </div>
          </div>
        </div>

        <button
          className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition w-full sm:w-auto"
          onClick={handleRecommend}
          disabled={loading}
        >
          {loading ? "Searching..." : "Get Recommendations"}
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter a <strong>title</strong> or select a <strong>subject</strong> to receive personalized book recommendations.
      </p>

      {loading && (
        <p className="text-center text-gray-500 py-8">Searching for recommendations...</p>
      )}

      {!loading && !searchTriggered && recommendations.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          <div className="mb-8 flex justify-center">
            <LightBulbIcon className="h-24 w-24 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Looking for your next great read?</h2>
          <p className="text-base text-gray-700 mb-6">
            Get personalized book recommendations based on your interests!
          </p>
          <div className="mt-8 max-w-lg mx-auto text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">How to get recommendations:</h3>
            <ul className="list-inside list-none space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-purple-100 text-purple-800 text-sm font-semibold px-2.5 py-0.5 rounded-full mr-3 mt-0.5">1</span>
                <p className="text-base text-gray-600">Enter a specific book title you enjoyed.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-purple-100 text-purple-800 text-sm font-semibold px-2.5 py-0.5 rounded-full mr-3 mt-0.5">2</span>
                <p className="text-base text-gray-600">Or, select a subject you're interested in.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-purple-100 text-purple-800 text-sm font-semibold px-2.5 py-0.5 rounded-full mr-3 mt-0.5">3</span>
                <p className="text-base text-gray-600">Click "Get Recommendations" to discover new books!</p>
              </li>
            </ul>
          </div>
        </div>
      )}

      {!loading && searchTriggered && recommendations.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold mt-4 mb-2">No recommendations found.</p>
          <p className="text-base">Try adjusting your title or subject!</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((book) => (
            <div
              key={book.id}
              onClick={() => handleCardClick(book)}
              className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transition hover:shadow-lg"
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
                {Array.isArray(book.authors)
                  ? book.authors.join(", ")
                  : typeof book.authors === "string"
                  ? book.authors
                  : "Unknown Author"}
              </p>
              <p className="text-sm text-gray-500 w-full">
                <strong>Subject:</strong> {book.subject}
              </p>

              {typeof book.averageRating === "number" && !isNaN(book.averageRating) && (
                <p className="text-sm text-yellow-600 font-semibold">
                  ⭐ {book.averageRating.toFixed(1)} / 5
                </p>
              )}

              {typeof book.ratingsCount === "number" && book.ratingsCount > 0 && (
                <p className="text-xs text-gray-500">({book.ratingsCount} ratings)</p>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCollection(book);
                }}
                className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition mt-2"
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

export default RecommendationsPage;
