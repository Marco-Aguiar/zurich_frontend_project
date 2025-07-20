import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../services/UserService";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      registerUser(username, email, password),
  });
};
