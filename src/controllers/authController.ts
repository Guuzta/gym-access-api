import { NextFunction, Request, Response } from "express";

import * as authService from "../services/authService";

import { setRefreshTokenCookie } from "../utils/setRefreshTokenCookie";

import { LoginUserBody } from "../schemas/loginSchema";

import { Tokens } from "../types/jwt";

const login = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response<Tokens>,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = await authService.login(req.body);

    setRefreshTokenCookie(res, token.refreshToken);

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

export { login };
