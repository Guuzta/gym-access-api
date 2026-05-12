import { Router } from "express";

import * as authController from "../controllers/authController";

import validateInput from "../middlewares/validateInput";

import { loginUserSchema } from "../schemas/loginSchema";

const router = Router();

router.post(
  "/login",
  validateInput(loginUserSchema, "body"),
  authController.login,
);

export default router;
