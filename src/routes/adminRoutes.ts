import { Router } from "express";

import * as adminController from "../controllers/adminController";

import validateInput from "../middlewares/validateInput";

import { createClientSchema } from "../schemas/createClientSchema";
import { getClientParamsSchema } from "../schemas/getClientParamsSchema";

const router = Router();

router.post(
  "/clients",
  validateInput(createClientSchema, "body"),
  adminController.createNewClient,
);

router.get(
  "/clients", 
  adminController.getAllClients
);

router.get(
  "/clients/:id",
  validateInput(getClientParamsSchema, "params"),
  adminController.getClientById,
);

export default router;
