import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const SignInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
