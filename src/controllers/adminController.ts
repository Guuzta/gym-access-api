import { NextFunction, Request, Response } from "express";

import * as adminService from "../services/adminService";

import { CreateClientBody } from "../schemas/createClientSchema";

import { CreatedClientResponse } from "../types/client";

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

export { createNewClient };
