import { Router } from "express";

import * as accessController from "../controllers/accessController.js";

import validateInput from "../middlewares/validateInput.js";

import { accessSchema } from "../schemas/accessSchema.js";

const router = Router();

router.post("/", validateInput(accessSchema, "body"), accessController.validateAccessCode);

export default router;
