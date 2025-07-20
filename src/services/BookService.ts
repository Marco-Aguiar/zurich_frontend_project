import axios from "axios";
import { Book, BookStatus } from "../types/Book";
import { API_BASE_URL } from "../config/apiConfig";

const baseURL = API_BASE_URL;

export const getAllBooks = async (token: string): Promise<Book[]> => {
  const response = await axios.get(`${baseURL}/book-entries`, {
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
    subject: string[];
    authors: string[];
    thumbnailUrl: string;
    averageRating?: number | null;
    status: string;
  }
) => {
  const response = await axios.post(`${baseURL}/book-entries`, bookData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeBook = async (token: string, bookId: string): Promise<void> => {
  const response = await axios.delete(`${baseURL}/book-entries/${bookId}`, {
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
    const response = await axios.get(`${baseURL}/external/books/${googleBookId}`, {
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

  const response = await axios.get(`${baseURL}/external/books/search?${params.toString()}`, {
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
  const response = await axios.patch(`${baseURL}/book-entries/${bookId}/status`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      status: newStatus,
    },
  });

  return response.data;
};

export const getRecommendations = async (
  token: string,
  filters: { title?: string; subject?: string }
): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters.title) params.append("title", filters.title);
  if (filters.subject) params.append("subject", filters.subject);

  const response = await axios.get(
    `${baseURL}/external/books/recommendations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
