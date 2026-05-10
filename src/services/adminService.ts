import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

import AppError from "../utils/AppError";
import generateUniqueAccessCode from "../utils/generateUniqueAccessCode";

import { UpdateClientBody } from "../schemas/updateClientSchema";

import {
  CreatedClientResponse,
  GetClientQuery,
  GetAllClientsResponse,
  GetClientByIdResponse,
  UpdatedClientReponse,
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

const getClientById = async (id: string): Promise<GetClientByIdResponse> => {
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  return client;
};

const updateClient = async (
  data: UpdateClientBody,
  id: string,
): Promise<UpdatedClientReponse> => {
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  if (!client.isActive) {
    throw new AppError("Cannot update an inactive client", 409);
  }

  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  );

  if (updateData.cpf) {
    const cpfExists = await prisma.client.findFirst({
      where: { cpf: updateData.cpf },
    });

    if (cpfExists) {
      throw new AppError("CPF already in use", 400);
    }
  }

  const updatedClient = await prisma.client.update({
    where: { id },
    data: updateData,
  });

  return updatedClient;
};

const deactivateClient = async (id: string): Promise<{ message: string }> => {
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  if (!client.isActive) {
    throw new AppError("Client is already inactive", 403);
  }

  await prisma.client.update({
    where: { id },
    data: { isActive: false },
  });

  return {
    message: "Client deactivated successfully",
  };
};

export {
  createNewClient,
  getAllClients,
  getClientById,
  updateClient,
  deactivateClient,
};
