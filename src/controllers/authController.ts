import { NextFunction, Request, Response } from "express";

import * as authService from "../services/authService.js";

import { setRefreshTokenCookie } from "../utils/setRefreshTokenCookie.js";

import { LoginUserBody } from "../schemas/loginSchema.js";

import { JwtPayload, Tokens } from "../types/jwt.js";

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

const logout = async (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionId } = req.user as JwtPayload;

    const message = await authService.logout(sessionId);

    res.clearCookie("refreshToken");

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const refresh = async (
  req: Request,
  res: Response<{ accessToken: string }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = await authService.refresh(req);

    res.status(200).json(accessToken);
  } catch (error) {
    next(error);
  }
};

export { login, logout, refresh };
