import { NextFunction, Request, Response } from "express";

import * as authService from "../services/authService";

import { setRefreshTokenCookie } from "../utils/setRefreshTokenCookie";

import { LoginUserBody } from "../schemas/loginSchema";

import { JwtPayload, Tokens } from "../types/jwt";

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

export { login, logout };
