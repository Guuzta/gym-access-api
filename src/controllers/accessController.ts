import { NextFunction, Request, Response } from "express";

import * as accessService from "../services/accessService.js";

import { AccessBody } from "../schemas/accessSchema.js";

import { AccessResponse } from "../types/access.js";

const validateAccessCode = async (
  req: Request<{}, {}, AccessBody>,
  res: Response<AccessResponse>,
  next: NextFunction,
) => {
  try {
    const message = await accessService.validateAccessCode(req.body.accessCode);

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export { validateAccessCode };
