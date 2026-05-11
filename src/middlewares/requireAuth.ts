import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError";
import { env } from "../config/env";

import { JwtPayload } from "../types/jwt";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("Token not provided", 401);
  }

  const [, token] = authorization.split(" ");

  try {
    const payload = jwt.verify(token, env.TOKEN_SECRET) as JwtPayload;

    req.user = payload;

    next();
  } catch {
    throw new AppError("Invalid token or expired", 403);
  }
};

export default requireAuth;
