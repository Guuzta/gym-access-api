import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";

import { JwtPayload } from "../types/jwt.js";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("Token not provided", 401);
  }

  const [, token] = authorization.split(" ");

  try {
    const payload = jwt.verify(token, env.TOKEN_SECRET) as JwtPayload;

    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
    });

    if (!session) {
      return next(new AppError("Invalid session", 401));
    }

    req.user = payload;

    next();
  } catch (err) {
    throw new AppError("Invalid token or expired", 403);
  }
};

export default requireAuth;
