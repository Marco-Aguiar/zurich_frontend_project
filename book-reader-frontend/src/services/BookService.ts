import axios from "axios";
import { Book, BookStatus } from "../types/Book";

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
    averageRating?: number | null;
    status: string;
  }
) => {
  const response = await axios.post(`${BASE_URL}/book-entries`, bookData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeBook = async (token: string, bookId: string): Promise<void> => {
  const response = await axios.delete(`${BASE_URL}/book-entries/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.status !== 204 && response.status !== 200) {
      throw new Error("Failed to delete book: Unexpected status code.");
  }
};

export const getBookDetails = async (token: string, googleBookId: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/external/books/${googleBookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Google Book details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch book details from Google Books API.");
  }
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
  bookId: string,
  newStatus: BookStatus
): Promise<Book> => {
  const response = await axios.patch(`${BASE_URL}/book-entries/${bookId}/status`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      status: newStatus
    }
  });

  return response.data;
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