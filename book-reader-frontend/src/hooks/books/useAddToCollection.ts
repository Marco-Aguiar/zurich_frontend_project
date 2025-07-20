import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCollection } from "../../services/BookService";

export const useAddToCollection = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: Parameters<typeof addToCollection>[1]) =>
      addToCollection(token, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
