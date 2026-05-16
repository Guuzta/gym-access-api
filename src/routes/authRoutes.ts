import { Router } from "express";

import * as authController from "../controllers/authController.js";

import validateInput from "../middlewares/validateInput.js";
import requireAuth from "../middlewares/requireAuth.js";

import { loginUserSchema } from "../schemas/loginSchema.js";

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
