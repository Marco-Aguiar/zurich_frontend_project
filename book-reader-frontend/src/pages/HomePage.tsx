import React from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookStatus } from "../types/Book";
import { toast } from "react-toastify";
import BookGroup from "../components/BookGroup";
import BookDetailModal from "../components/BookDetailModal";
import {
  statusLabels,
  STATUS_ORDER,
  ALL_POSSIBLE_STATUSES,
} from "../utils/statusLabels";
import { getBookDetails } from "../services/BookService";
import { useBooks } from "../hooks/books/useBooks";
import { useUserProfile } from "../hooks/user/useUserProfile";
import { useUpdateBookStatus } from "../hooks/books/useUpdateBookStatus";
import { useRemoveBook } from "../hooks/books/useRemoveBook";
import { useBookModalStore } from "../store/bookModalStore";

const HomePage: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useBooks(token!);

  const { data: userProfile } = useUserProfile(token!);
  const username = userProfile?.username || "Reader";

  const { selectedBook, openBook, closeBook } = useBookModalStore();
  const updateStatusMutation = useUpdateBookStatus(token!);
  const removeBookMutation = useRemoveBook(token!);

  const handleStatusChange = (bookId: string, newStatus: BookStatus) => {
    updateStatusMutation.mutate(
      { bookId, newStatus },
      {
        onSuccess: () => {
          toast.success(`Book status updated to ${statusLabels[newStatus]}!`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(`Failed to update status: ${err.message}`);
        },
      }
    );
  };

  const handleRemoveBook = (bookId: string) => {
    if (!window.confirm("Are you sure you want to remove this book from your collection?")) return;

    removeBookMutation.mutate(bookId, {
      onSuccess: () => {
        toast.success("Book removed from your collection!");
        refetch();
      },
      onError: (err: any) => {
        toast.error(`Failed to remove book: ${err.message}`);
      },
    });
  };

  const handleCardClick = async (book: Book) => {
    if (!book.googleBookId) {
      toast.error("Book ID not available to load details.");
      openBook(book);
      return;
    }

    try {
      const details = await getBookDetails(token!, book.googleBookId);
      openBook({ ...book, ...details });
    } catch (error: any) {
      toast.error(error.message || "Error loading book details.");
      openBook(book);
    }
  };

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

  const groupedBooks = books.reduce((acc, book) => {
    const status: BookStatus = ALL_POSSIBLE_STATUSES.includes(book.status)
      ? book.status
      : "READ";
    if (!acc[status]) acc[status] = [];
    acc[status].push(book);
    return acc;
  }, {} as Record<BookStatus, Book[]>);

  const hasDisplayableBooks = Object.values(groupedBooks).some(arr => arr.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold">
              Welcome back, <span className="text-blue-600">{username}</span> 👋
            </h2>
            <p className="text-sm text-gray-500">Ready to dive into another book?</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center mt-2">My Book Collection</h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading your books...</p>
        ) : !hasDisplayableBooks ? (
          <div className="text-center text-gray-600 pt-12 pb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your collection is empty!</h2>
            <p className="text-base text-gray-700 mb-8">
              Let's fill your virtual bookshelf with amazing reads.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              <svg className="-ml-1 mr-2.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Start Adding Your First Book!
            </button>

            <div className="mt-12 max-w-lg mx-auto text-left">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">How to get started:</h3>
              <ul className="list-inside list-none space-y-3">
                {["Click the button above", "Search by title or author", "Add books to your list"].map((text, i) => (
                  <li className="flex items-start" key={i}>
                    <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full mr-3 mt-0.5">{i + 1}</span>
                    <p className="text-base text-gray-600">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
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
                  onCardClick={handleCardClick}
                />
              );
            })}
          </div>
        )}

        {selectedBook && (
          <BookDetailModal book={selectedBook} onClose={closeBook} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
