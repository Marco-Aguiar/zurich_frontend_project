import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/AuthService";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  });
};
