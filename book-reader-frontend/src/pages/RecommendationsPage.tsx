import React, { useState } from "react";
import { toast } from "react-toastify";
import { addToCollection } from "../services/BookService";

const CATEGORY_OPTIONS = [
  "Art",
  "Biography & Autobiography",
  "Business & Economics",
  "Children",
  "Drama",
  "Education",
  "Fiction",
  "History",
  "Medical",
  "Philosophy",
  "Political Science",
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

  const handleRecommend = async () => {
    if (!title.trim() && !subject.trim()) {
      toast.warn("Please enter a title or a subject.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }

    try {
      setLoading(true);
      setSearchTriggered(true);
      setRecommendations([]);

      const queryParams = new URLSearchParams();
      if (title.trim()) queryParams.append("title", title.trim());
      if (subject.trim()) queryParams.append("subject", subject.trim());

      const response = await fetch(
        `http://localhost:8080/api/external/books/recommendations?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedResults = data.map((book: any) => ({
          ...book,
          subject: book.categories?.[0] || "Unknown",
        }));
        setRecommendations(formattedResults);
      } else {
        toast.error("Failed to get recommendations.");
      }
    } catch (err) {
      console.error(err);
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
        status: "PLAN_TO_READ",
      });
      toast.success("Book added to your collection!");
    } catch (err) {
      toast.error("Failed to add book.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center">📚 Book Recommendations</h1>

      <p className="text-center text-gray-600 mb-6">
        Enter a <strong>title</strong> or select a <strong>subject</strong> to receive personalized book recommendations.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-4 justify-center mb-6">
        <div className="flex flex-col w-full max-w-md">
          <label className="mb-1 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            placeholder="e.g. The Hobbit"
            className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <label className="mb-1 text-sm font-medium text-gray-700">Subject</label>
          <div className="relative">
            <select
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
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition h-fit"
          onClick={handleRecommend}
          disabled={loading}
        >
          {loading ? "Searching..." : "Recommendations"}
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-4">Searching for recommendations...</p>
      )}

      {!loading && searchTriggered && recommendations.length === 0 && (
        <p className="text-center text-gray-500 py-4">No recommendations found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
          >
            {book.thumbnailUrl ? (
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                className="w-full aspect-[2/3] object-cover rounded mb-4 shadow"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h3 className="text-md font-semibold mb-1 truncate w-full">{book.title}</h3>
            <p className="text-sm text-gray-600 truncate w-full">
              {book.authors?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-sm text-gray-500 w-full mb-2">
              <strong>Subject:</strong> {book.subject}
            </p>

            <button
              onClick={() => handleAddToCollection(book)}
              className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition mt-2"
            >
              Add to Collection
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
