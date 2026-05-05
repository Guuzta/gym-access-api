import { Router } from "express";

import { index } from "../controllers/healthController";

const router = Router();

router.get("/health", index);

export default router;
