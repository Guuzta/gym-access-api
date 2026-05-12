import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginUserBody = z.infer<typeof loginUserSchema>;
