import React, { useState } from "react";
import { toast } from "react-toastify";
import { LightBulbIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useRecommendations } from "../hooks/books/useRecommendations";
import { useAddToCollection } from "../hooks/books/useAddToCollection";
import { getBookDetails } from "../services/BookService";
import BookDetailModal from "../components/BookDetailModal";
import { useBookModalStore } from "../store/bookModalStore";

const CATEGORY_OPTIONS = [
  "Art", "Children", "Drama", "Education", "Fiction", "History",
  "Medical", "Philosophy", "Religion", "Science", "Travel",
];

const RecommendationsPage: React.FC = () => {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [queryParams, setQueryParams] = useState({ title: "", subject: "" });

  const {
    data: recommendations = [],
    isFetching,
    refetch,
  } = useRecommendations(token!, queryParams, searchTriggered);

  const { mutate: addBookToCollection } = useAddToCollection(token!);
  const { selectedBook, openBook, closeBook } = useBookModalStore();

  const handleRecommend = () => {
    if (!title.trim() && !subject.trim()) {
      toast.warn("Please enter a title or a subject.");
      return;
    }
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }
    setSearchTriggered(true);
    setQueryParams({ title, subject });
    refetch();
  };

  const handleAddToCollection = (book: any) => {
    addBookToCollection(
      {
        googleBookId: book.id,
        title: book.title,
        authors: book.authors || ["Unknown Author"],
        subject: Array.isArray(book.subject)
          ? book.subject
          : book.subject
          ? [book.subject]
          : book.categories?.length
          ? book.categories
          : ["Unknown"],
        thumbnailUrl: book.thumbnailUrl || "",
        averageRating: book.averageRating || null,
        status: "PLAN_TO_READ",
      },
      {
        onSuccess: () => {
          toast.success("📚 Book added to your collection!");
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const message = err?.response?.data?.error;
          if (
            status === 400 &&
            message?.toLowerCase().includes("already") &&
            message?.toLowerCase().includes("saved")
          ) {
            toast.warn("You’ve already added this book to your collection.");
          } else {
            toast.error(message || "Failed to add book. Please try again.");
          }
        },
      }
    );
  };

  const handleCardClick = async (book: any) => {
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }
    try {
      const details = await getBookDetails(token, book.id);
      openBook({ ...book, ...details });
    } catch {
      toast.error("Failed to load book details.");
      openBook(book);
    }
  };

  const formattedRecommendations = recommendations.map((book: any) => ({
    ...book,
    subject: book.subject || book.categories?.[0] || "Unknown",
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <SparklesIcon className="h-8 w-8 inline-block mr-2 text-purple-600" />
        Book Recommendations
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-4 justify-center mb-6">
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="title-recommendation" className="mb-1 text-sm font-medium text-gray-800">Title</label>
          <input
            id="title-recommendation"
            type="text"
            placeholder="Example: Trivium"
            className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
          />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="subject-recommendation" className="mb-1 text-sm font-medium text-gray-800">Genre</label>
          <select
            id="subject-recommendation"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-2 rounded-md shadow-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Select a genre --</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRecommend}
          disabled={isFetching}
          className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition w-full sm:w-auto"
        >
          {isFetching ? "Searching..." : "Get Recommendations"}
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter a <strong>title</strong> or select a <strong>subject</strong> to receive personalized book recommendations.
      </p>

      {isFetching && (
        <p className="text-center text-gray-500 py-8">Searching for recommendations...</p>
      )}

      {!isFetching && !searchTriggered && formattedRecommendations.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          <div className="mb-8 flex justify-center">
            <LightBulbIcon className="h-24 w-24 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Looking for your next great read?</h2>
          <p className="text-base text-gray-700 mb-6">
            Get personalized book recommendations based on your interests!
          </p>
        </div>
      )}

      {!isFetching && searchTriggered && formattedRecommendations.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold mt-4 mb-2">No recommendations found.</p>
          <p className="text-base">Try adjusting your title or subject!</p>
        </div>
      )}

      {!isFetching && formattedRecommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedRecommendations.map((book: any) => (
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
                <strong>Genre:</strong>{" "}
                {Array.isArray(book.subject) ? book.subject.join(", ") : book.subject}
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
        <BookDetailModal book={selectedBook} onClose={closeBook} />
      )}
    </div>
  );
};

export default RecommendationsPage;
