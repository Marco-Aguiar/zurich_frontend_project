// pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookStatus } from "../types/Book";
import { getAllBooks, updateBookStatus, removeBook } from "../services/BookService";
import { toast } from "react-toastify";
import BookGroup from "../components/BookGroup";
import { statusLabels } from "../utils/statusLabels";
import BookDetailModal from "../components/BookDetailModal";

const STATUS_ORDER: BookStatus[] = [
  "PLAN_TO_READ",
  "READING",
  "PAUSED",
  "READ",
  "DROPPED",
  "RECOMMENDED",
];

const ALL_POSSIBLE_STATUSES: BookStatus[] = Object.keys(statusLabels) as BookStatus[];

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = await getAllBooks(token);
      setBooks(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Your session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Failed to load books. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [navigate]);

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case "READ": return "bg-green-200 text-green-800";
      case "PLAN_TO_READ": return "bg-blue-200 text-blue-800";
      case "READING": return "bg-yellow-200 text-yellow-800";
      case "PAUSED": return "bg-orange-200 text-orange-800";
      case "DROPPED": return "bg-red-200 text-red-800";
      case "RECOMMENDED": return "bg-pink-200 text-pink-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const handleStatusChange = async (bookId: string, newStatus: BookStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      navigate("/login");
      return;
    }

    const originalBooks = [...books];
    setBooks(prevBooks =>
      prevBooks.map(book => book.id === bookId ? { ...book, status: newStatus } : book)
    );

    try {
      await updateBookStatus(token, bookId, newStatus);
      toast.success(`Book status updated to ${statusLabels[newStatus]}!`);
      fetchBooks();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Please try again.";
      toast.error(`Failed to update status: ${errorMessage}`);
      setBooks(originalBooks);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to remove this book from your collection?")) {
      return;
    }

    const originalBooks = [...books];
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));

    try {
      await removeBook(token, bookId);
      toast.success("Book removed from your collection!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Please try again.";
      toast.error(`Failed to remove book: ${errorMessage}`);
      setBooks(originalBooks);
    }
  };

  const groupedBooks = books.reduce((acc, book) => {
    const status: BookStatus = book.status;
    if (ALL_POSSIBLE_STATUSES.includes(status)) {
      if (!acc[status]) acc[status] = [];
      acc[status].push(book);
    } else {
      const unknownStatus: BookStatus = "READ";
      if (!acc[unknownStatus]) acc[unknownStatus] = [];
      acc[unknownStatus].push(book);
    }
    return acc;
  }, {} as Record<BookStatus, Book[]>);

  const hasDisplayableBooks = Object.values(groupedBooks).some(arr => arr.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-[80%] mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Book Collection</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading your books...</p>
        ) : !hasDisplayableBooks ? (
          <div className="text-center text-gray-600 py-8">
            <p className="text-xl font-semibold mb-2">Welcome to Book Reader!</p>
            <p className="text-lg mb-1">Discover your next favorite book.</p>
            <p className="text-md">Track your reading progress, manage wishlists, and add comments to your books.</p>
            <p className="text-md mt-4">
              Start by <strong className="text-blue-600">searching</strong> for books and adding them to your collection!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {STATUS_ORDER.map((status) => {
              const booksInStatus = groupedBooks[status];
              if (!booksInStatus || booksInStatus.length === 0) return null;

              return (
                <BookGroup
                  key={status}
                  status={status}
                  books={booksInStatus}
                  onStatusChange={handleStatusChange}
                  onRemoveBook={handleRemoveBook}
                  getStatusColor={getStatusColor}
                  allStatuses={ALL_POSSIBLE_STATUSES}
                  onCardClick={(book) => setSelectedBook(book)}
                />
              );
            })}
          </div>
        )}

        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
