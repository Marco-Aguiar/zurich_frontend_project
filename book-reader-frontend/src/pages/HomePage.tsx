import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookStatus } from "../types/Book";
import { getAllBooks, updateBookStatus } from "../services/BookService";
import { toast } from "react-toastify";
import BookGroup from "../components/BookGroup";
import { statusLabels } from "../utils/statusLabels";

const STATUS_ORDER: BookStatus[] = [
  "PLAN_TO_READ",
  "READING",
  "PAUSED",
  "READ",
  "DROPPED",
  "RECOMMENDED",
];

const ALL_POSSIBLE_STATUSES: BookStatus[] = [
  "PLAN_TO_READ",
  "READING",
  "PAUSED",
  "DROPPED",
  "READ",
  "RECOMMENDED",
];

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching books", error);
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
      case "READ":
        return "bg-green-200 text-green-800";
      case "PLAN_TO_READ":
        return "bg-blue-200 text-blue-800";
      case "READING":
        return "bg-yellow-200 text-yellow-800";
      case "PAUSED":
        return "bg-orange-200 text-orange-800";
      case "DROPPED":
        return "bg-red-200 text-red-800";
      case "RECOMMENDED":
        return "bg-pink-200 text-pink-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleStatusChange = async (bookId: string, newStatus: BookStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ You are not authenticated.");
      navigate("/login");
      return;
    }

    const originalBooks = [...books];
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId ? { ...book, status: newStatus } : book
      )
    );
    toast.info(`Updating status to ${newStatus.replace(/_/g, " ")}...`);

    try {
      await updateBookStatus(token, bookId, newStatus);
      toast.success(`✅ Book status updated to ${newStatus.replace(/_/g, " ")}!`);
      fetchBooks();
    } catch (error: any) {
      console.error("Error updating book status:", error);
      toast.error(`❌ Failed to update status: ${error.message || "Please try again."}`);
      setBooks(originalBooks);
    }
  };
  const groupedBooks = books.reduce((acc, book) => {
    const status: BookStatus = book.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(book);
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
          <p className="text-center text-gray-600">
            No active books in your collection yet. Start by searching and adding some to "Plan to Read"!
          </p>
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
                  getStatusColor={getStatusColor}
                  allStatuses={ALL_POSSIBLE_STATUSES}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
