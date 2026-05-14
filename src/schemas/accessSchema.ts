import { z } from "zod";

export const accessSchema = z.object({
  accessCode: z
    .string()
    .min(6, "Access code must have 6 characters")
    .max(6, "Access code must have 6 characters"),
});

export type AccessBody = z.infer<typeof accessSchema>;
