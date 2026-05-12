import { NextFunction, Request, Response } from "express";

import * as authService from "../services/authService";

import { LoginUserBody } from "../schemas/loginSchema";

import { Token } from "../types/jwt";

const login = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response<Token>,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = await authService.login(req.body);

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

export { login };
