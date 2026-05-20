import { z } from "zod";

function isValidCPF(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf)) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder: number;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  return remainder === parseInt(cpf[10]);
}

export const createClientSchema = z.object({
  firstName: z
    .string()
    .min(4, "First name must have at least 4 characteres")
    .trim()
    .transform((value) => value.toLowerCase()),
  lastName: z
    .string()
    .min(4, "Last name must have at least 4 characteres")
    .trim()
    .transform((value) => value.toLowerCase()),
  cpf: z.string().trim().refine(isValidCPF, {
    message: "Invalid CPF",
  }),
});

export type CreateClientBody = z.infer<typeof createClientSchema>;
