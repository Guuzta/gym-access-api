import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export default function validateInput(
  schema: z.ZodObject<any>,
  source: "body" | "params" | "query",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const flat = z.flattenError(result.error);

      const errors = Object.entries(flat.fieldErrors).map(
        ([field, messages]) => ({
          field,
          message: messages?.[0],
        }),
      );

      return res.status(400).json({
        errors,
      });
    }

    req[source] = result.data;
    next();
  };
}
