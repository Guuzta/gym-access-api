import { Router } from "express";

import * as adminController from "../controllers/adminController";

import validateInput from "../middlewares/validateInput";

import { createClientSchema } from "../schemas/createClientSchema";

const router = Router();

router.post(
  "/clients",
  validateInput(createClientSchema),
  adminController.createNewClient,
);

export default router;
