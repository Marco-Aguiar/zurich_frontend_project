import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "../../services/BookService";

export const useRecommendations = (
  token: string,
  filters: { title?: string; subject?: string },
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["recommendations", filters],
    queryFn: () => getRecommendations(token, filters),
    enabled,
  });
};
