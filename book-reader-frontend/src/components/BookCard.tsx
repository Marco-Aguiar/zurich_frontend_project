import React from "react";
import { Book, BookStatus } from "../types/Book";
import StatusDropdown from "./StatusDropdown";

interface BookCardProps {
  book: Book;
  onStatusChange: (newStatus: BookStatus) => void;
  getStatusColor: (status: BookStatus) => string;
  allStatuses: BookStatus[];
}

const formatAuthors = (authors: string[] | string | undefined): string => {
  if (Array.isArray(authors)) return authors.join(", ");
  if (typeof authors === "string") return authors;
  return "Unknown Author";
};

const BookCard: React.FC<BookCardProps> = ({
  book,
  onStatusChange,
  getStatusColor,
  allStatuses,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
      {book.thumbnailUrl ? (
        <img
          src={book.thumbnailUrl}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover rounded-lg shadow mb-3"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <h3 className="text-md font-semibold truncate w-full">{book.title}</h3>
      <p className="text-gray-500 text-sm truncate w-full">{formatAuthors(book.authors)}</p>

      {/* ⭐ Average Rating */}
      {typeof book.averageRating === "number" && !isNaN(book.averageRating) && (
        <p className="text-sm text-yellow-600 font-semibold mt-1">
          ⭐ {book.averageRating.toFixed(1)} / 5
        </p>
      )}

      {/* 📊 Ratings Count */}
      {typeof book.ratingsCount === "number" && book.ratingsCount > 0 && (
        <p className="text-xs text-gray-500">
          ({book.ratingsCount} ratings)
        </p>
      )}

      <div className="mt-3 w-full">
        <StatusDropdown
          currentStatus={book.status}
          allStatuses={allStatuses}
          onStatusChange={onStatusChange}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );
};

export default BookCard;
