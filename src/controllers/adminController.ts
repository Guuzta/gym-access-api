import { NextFunction, Request, Response } from "express";

import * as adminService from "../services/adminService";

import { CreateClientBody } from "../schemas/createClientSchema";
import { GetClientParams } from "../schemas/getClientParamsSchema";
import { UpdateClientBody } from "../schemas/updateClientSchema";

import {
  CreatedClientResponse,
  GetClientQuery,
  GetAllClientsResponse,
  GetClientByIdResponse,
  UpdatedClientReponse,
} from "../types/client";

const createNewClient = async (
  req: Request<{}, {}, CreateClientBody>,
  res: Response<CreatedClientResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { firstName, lastName, cpf } = req.body;

    const client = await adminService.createNewClient(firstName, lastName, cpf);

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

const getAllClients = async (
  req: Request<{}, {}, {}, GetClientQuery>,
  res: Response<GetAllClientsResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters = {
      firstName: req.query.firstName,
      cpf: req.query.cpf,
      isActive: req.query.isActive,
      page: req.query.page,
      limit: req.query.limit,
    };

    const clients = await adminService.getAllClients(filters);

    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (
  req: Request<GetClientParams>,
  res: Response<GetClientByIdResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await adminService.getClientById(id);

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (
  req: Request<GetClientParams, {}, UpdateClientBody>,
  res: Response<UpdatedClientReponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedClient = await adminService.updateClient(req.body, id);

    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};

const deactivateClient = async (
  req: Request<GetClientParams>,
  res: Response<{ message: string }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await adminService.deactivateClient(id);

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const activateClient = async (
  req: Request<GetClientParams>,
  res: Response<{ message: string }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await adminService.activateClient(id);

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export {
  createNewClient,
  getAllClients,
  getClientById,
  updateClient,
  deactivateClient,
  activateClient
};
