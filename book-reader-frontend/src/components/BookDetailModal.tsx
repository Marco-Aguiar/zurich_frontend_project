// components/BookDetailModal.tsx
import React from "react";
import { Book } from "../types/Book";

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {book.thumbnailUrl && (
            <img
              src={book.thumbnailUrl}
              alt={book.title}
              className="w-40 h-auto rounded-lg shadow"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-sm text-gray-600">
              <strong>Authors:</strong>{" "}
              {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "Unknown"}
            </p>
            {book.publisher && (
              <p className="text-sm text-gray-600">
                <strong>Publisher:</strong> {book.publisher}
              </p>
            )}
            {book.publishedDate && (
              <p className="text-sm text-gray-600">
                <strong>Published:</strong> {book.publishedDate}
              </p>
            )}
            {book.categories && (
              <p className="text-sm text-gray-600">
                <strong>Categories:</strong> {book.categories.join(", ")}
              </p>
            )}
            {book.averageRating && (
              <p className="text-sm text-yellow-600 mt-2">
                ⭐ {book.averageRating.toFixed(1)} ({book.ratingsCount} ratings)
              </p>
            )}
            {book.description && (
              <div className="mt-4 max-h-40 overflow-y-auto text-sm text-gray-700">
                <strong>Summary:</strong>
                <p className="mt-1 whitespace-pre-line">{book.description}</p>
              </div>
            )}
            {book.infoLink && (
              <a
                href={book.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline mt-3 inline-block"
              >
                View on Google Books
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
