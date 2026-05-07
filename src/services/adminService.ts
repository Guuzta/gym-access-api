import { prisma } from "../lib/prisma";

import AppError from "../utils/AppError";
import generateUniqueAccessCode from "../utils/generateUniqueAccessCode";

import { CreatedClientResponse } from "../types/client";

const createNewClient = async (
  firstName: string,
  lastName: string,
  cpf: string,
): Promise<CreatedClientResponse> => {
  const clientExists = await prisma.client.findFirst({ where: { cpf } });

  if (clientExists) {
    throw new AppError("CPF already in use", 400);
  }

  const accessCode = await generateUniqueAccessCode();

  const client = await prisma.client.create({
    data: {
      firstName,
      lastName,
      cpf,
      accessCode,
    },
  });

  return {
    id: client.id,
    firstName,
    lastName,
    accessCode,
  };
};

export { createNewClient };
