import { Router } from "express";

import * as accessController from "../controllers/accessController";

import validateInput from "../middlewares/validateInput";

import { accessSchema } from "../schemas/accessSchema";

const router = Router();

router.post("/", validateInput(accessSchema, "body"), accessController.validateAccessCode);

export default router;
