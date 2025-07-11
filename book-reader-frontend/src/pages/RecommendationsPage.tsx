import React, { useState } from "react";

const RecommendationsPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleRecommend = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/api/external/books/recommendations?title=${title}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setRecommendations(data);
    } else {
      alert("Failed to get recommendations.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Recommendations</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter a title"
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={handleRecommend}
        >
          Get Recommendations
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((book) => (
          <div key={book.id} className="border rounded p-4">
            <p className="font-semibold">{book.title}</p>
            <p className="text-sm text-gray-600">
              {book.authors?.join(", ") || "Unknown Author"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
