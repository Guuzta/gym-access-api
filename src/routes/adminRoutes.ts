import { Router } from "express";

import * as adminController from "../controllers/adminController.js";

import validateInput from "../middlewares/validateInput.js";
import requireAuth from "../middlewares/requireAuth.js";

import { createClientSchema } from "../schemas/createClientSchema.js";
import { getClientParamsSchema } from "../schemas/getClientParamsSchema.js";
import { updateClientSchema } from "../schemas/updateClientSchema.js";

const router = Router();

router.post(
  "/clients",
  requireAuth,
  validateInput(createClientSchema, "body"),
  adminController.createNewClient,
);

router.get(
  "/clients", 
  requireAuth,
  adminController.getAllClients
);

router.get(
  "/clients/:id",
  requireAuth,
  validateInput(getClientParamsSchema, "params"),
  adminController.getClientById,
);

router.patch(
  "/clients/:id",
  requireAuth,
  validateInput(getClientParamsSchema, "params"),
  validateInput(updateClientSchema, "body"),
  adminController.updateClient
)

router.patch(
  "/clients/:id/deactivate",
  requireAuth,
  validateInput(getClientParamsSchema, "params"),
  adminController.deactivateClient
)

router.patch(
  "/clients/:id/activate",
  requireAuth,
  validateInput(getClientParamsSchema, "params"),
  adminController.activateClient
)

export default router;
