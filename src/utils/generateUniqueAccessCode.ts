import { prisma } from "../lib/prisma";

import AppError from "./AppError";

export default async function generateUniqueAccessCode(): Promise<string> {
  const MAX_ATTEMPTS = 10;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const exists = await prisma.client.findUnique({
      where: { accessCode },
    });

    if (!exists) {
      return accessCode;
    }
  }

  throw new AppError("Could not generate unique access code", 503);
}
