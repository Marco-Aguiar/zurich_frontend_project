import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "../../services/BookService";

export const useSearchBooks = (
  token: string,
  filters: { title?: string; author?: string; subject?: string },
  enabled: boolean
) => {
  const hasValidFilters = !!filters.title || !!filters.author;

  return useQuery({
    queryKey: ["searchBooks", filters],
    queryFn: () => {
      if (!hasValidFilters) {
        return Promise.resolve([]); 
      }
      return searchBooks(token, filters);
    },
    enabled: enabled && hasValidFilters,
  });
};
