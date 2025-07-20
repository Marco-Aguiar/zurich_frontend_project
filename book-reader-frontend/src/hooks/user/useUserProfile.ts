import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/UserService";

export const useUserProfile = (token: string) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(token),
    enabled: !!token, 
  });
};
