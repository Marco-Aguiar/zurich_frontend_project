import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookStatus } from "../../services/BookService";
import { BookStatus } from "../../types/Book";

export const useUpdateBookStatus = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, newStatus }: { bookId: string; newStatus: BookStatus }) =>
      updateBookStatus(token, bookId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
