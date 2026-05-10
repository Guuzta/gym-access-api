import { Router } from "express";

import * as adminController from "../controllers/adminController";

import validateInput from "../middlewares/validateInput";

import { createClientSchema } from "../schemas/createClientSchema";
import { getClientParamsSchema } from "../schemas/getClientParamsSchema";
import { updateClientSchema } from "../schemas/updateClientSchema";

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

router.patch(
  "/clients/:id",
  validateInput(getClientParamsSchema, "params"),
  validateInput(updateClientSchema, "body"),
  adminController.updateClient
)

router.patch(
  "/clients/:id/deactivate",
  validateInput(getClientParamsSchema, "params"),
  adminController.deactivateClient
)

export default router;
