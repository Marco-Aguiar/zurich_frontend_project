import axios from "axios";
import { Book, BookStatus } from "../types/Book"; // Import BookStatus

const BASE_URL = "http://localhost:8080/api";

export const getAllBooks = async (token: string): Promise<Book[]> => {
  const response = await axios.get(`${BASE_URL}/book-entries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addToCollection = async (
  token: string,
  bookData: {
    googleBookId: string;
    title: string;
    subject: string;
    authors: string[];
    thumbnailUrl: string;
    status: string; // Consider using BookStatus here as well for type safety
  }
) => {
  // Keeping fetch for consistency with your existing code, but could switch to axios
  const response = await fetch(`${BASE_URL}/book-entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    // You might want to parse the error response from backend for more specific messages
    const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorBody.message || "Failed to add book");
  }

  return response.json();
};

export const searchBooks = async (
  token: string,
  filters: { title?: string; author?: string; subject?: string }
): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters.title) params.append("title", filters.title);
  if (filters.author) params.append("author", filters.author);
  if (filters.subject) params.append("subject", filters.subject);

  const response = await axios.get(`${BASE_URL}/external/books/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateBookStatus = async (
  token: string,
  bookId: string, // Assuming bookId is a string (UUID) or number (Long) from your backend
  newStatus: BookStatus // Use the BookStatus type for type safety
): Promise<Book> => { // Assuming the backend returns the updated Book object
  const response = await axios.patch(`${BASE_URL}/book-entries/${bookId}/status`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { // Send status as a request parameter, matching your Spring Boot controller
      status: newStatus
    }
  });

  return response.data; // Axios automatically parses JSON response
};

export const getBookPrice = async (
  token: string,
  isbn: string,
  country: string
): Promise<{
  saleability: string;
  listPrice?: { amount: number; currencyCode: string };
  retailPrice?: { amount: number; currencyCode: string };
  buyLink?: string;
}> => {
  const response = await axios.get(`${BASE_URL}/external/books/price`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { isbn, country },
  });

  return response.data;
};
