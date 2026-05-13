import { Router } from "express";

import * as authController from "../controllers/authController";

import validateInput from "../middlewares/validateInput";
import requireAuth from "../middlewares/requireAuth";

import { loginUserSchema } from "../schemas/loginSchema";

const router = Router();

router.post(
  "/login",
  validateInput(loginUserSchema, "body"),
  authController.login,
);

router.post(
  "/logout", 
  requireAuth, 
  authController.logout
);

router.post(
  "/refresh", 
  authController.refresh
);

export default router;
