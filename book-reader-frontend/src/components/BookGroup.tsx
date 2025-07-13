import React from "react";
import { Book, BookStatus } from "../types/Book";
import BookCard from "./BookCard";
import { statusLabels } from "../utils/statusLabels";

interface BookGroupProps {
  status: BookStatus;
  books: Book[];
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onRemoveBook: (bookId: string) => void;
  getStatusColor: (status: BookStatus) => string;
  allStatuses: BookStatus[];
  onCardClick: (book: Book) => void;
}

const BookGroup: React.FC<BookGroupProps> = ({
  status,
  books,
  onStatusChange,
  onRemoveBook,
  getStatusColor,
  allStatuses,
  onCardClick,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 capitalize text-gray-800 border-b pb-3">
        {statusLabels[status]} Books ({books.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            allStatuses={allStatuses}
            getStatusColor={getStatusColor}
            onStatusChange={(newStatus) => onStatusChange(book.id, newStatus)}
            onRemoveBook={() => onRemoveBook(book.id)}
            onClick={() => onCardClick(book)}
          />
        ))}
      </div>
    </section>
  );
};

export default BookGroup;
