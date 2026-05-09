import { z } from "zod";

export const getClientParamsSchema = z.object({
  id: z.uuid("ID must be a valid UUID"),
});

export type GetClientParams = z.infer<typeof getClientParamsSchema>;
