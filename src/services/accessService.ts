import { prisma } from "../lib/prisma.js";

import AppError from "../utils/AppError.js";

import { AccessResponse } from "../types/access.js";

const validateAccessCode = async (
  accessCode: string,
): Promise<AccessResponse> => {
  const client = await prisma.client.findUnique({ where: { accessCode } });

  if (!client) {
    throw new AppError("Access denied", 403);
  }

  if (!client.isActive) {
    throw new AppError("Access denied", 403);
  }

  return {
    message: "Access granted",
    user: {
      firstName: client.firstName,
    },
  };
};

export { validateAccessCode };
