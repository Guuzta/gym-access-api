import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

import AppError from "../utils/AppError";
import generateUniqueAccessCode from "../utils/generateUniqueAccessCode";

import {
  CreatedClientResponse,
  GetClientQuery,
  GetAllClientsResponse,
} from "../types/client";

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

const getAllClients = async (
  filters: GetClientQuery,
): Promise<GetAllClientsResponse> => {
  const { firstName, cpf, isActive } = filters;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;

  const skip = (page - 1) * limit;

  const where: Prisma.ClientWhereInput = {
    ...(cpf && { cpf: cpf }),

    ...(firstName && {
      firstName: {
        contains: firstName,
        mode: "insensitive",
      },
    }),

    ...(isActive !== undefined && {
      isActive: isActive === "true",
    }),
  };

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
    }),

    prisma.client.count({ where }),
  ]);

  return {
    data: clients,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export { createNewClient, getAllClients };
