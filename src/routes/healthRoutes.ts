import { Router } from "express";

import { index } from "../controllers/healthController.js";

const router = Router();

router.get("/health", index);

export default router;
