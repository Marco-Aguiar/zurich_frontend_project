import React from "react";
import { Book, BookStatus } from "../types/Book";
import StatusDropdown from "./StatusDropdown";

interface BookCardProps {
  book: Book;
  onStatusChange: (newStatus: BookStatus) => void;
  onRemoveBook: () => void;
  onClick: () => void;
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
  onRemoveBook,
  onClick,
  getStatusColor,
  allStatuses,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center relative cursor-pointer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveBook();
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 text-xl font-bold leading-none"
        aria-label="Remover livro"
        title="Remover livro"
      >
        ×
      </button>

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

      <h3 className="text-md font-semibold truncate w-full">{book.title}</h3>
      <p className="text-gray-500 text-sm truncate w-full">{formatAuthors(book.authors)}</p>

      {typeof book.averageRating === "number" && !isNaN(book.averageRating) && (
        <p className="text-sm text-yellow-600 font-semibold mt-1">
          ⭐ {book.averageRating.toFixed(1)} / 5
        </p>
      )}

      {typeof book.ratingsCount === "number" && book.ratingsCount > 0 && (
        <p className="text-xs text-gray-500">({book.ratingsCount} ratings)</p>
      )}

      <div
        className="mt-3 w-full"
        onClick={(e) => e.stopPropagation()}
      >
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
