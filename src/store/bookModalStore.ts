import { create } from "zustand";
import { Book } from "../types/Book";

interface BookModalStore {
  selectedBook: Book | null;
  openBook: (book: Book) => void;
  closeBook: () => void;
}

export const useBookModalStore = create<BookModalStore>((set) => ({
  selectedBook: null,
  openBook: (book) => set({ selectedBook: book }),
  closeBook: () => set({ selectedBook: null }),
}));
