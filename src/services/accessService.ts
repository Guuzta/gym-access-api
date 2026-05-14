import { prisma } from "../lib/prisma";

import AppError from "../utils/AppError";

import { AccessResponse } from "../types/access";

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
