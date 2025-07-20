import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "../../services/BookService";

export const useBooks = (token: string) => {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => getAllBooks(token),
    enabled: !!token, 
  });
};
