import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBook } from "../../services/BookService";

export const useRemoveBook = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => removeBook(token, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
