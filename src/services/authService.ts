import { Request } from "express";

import { prisma } from "../lib/prisma.js";

import * as passwordHash from "../utils/password.js";
import * as token from "../utils/token.js";
import AppError from "../utils/AppError.js";

import { LoginUserBody } from "../schemas/loginSchema.js";

import { Tokens, JwtPayload } from "../types/jwt.js";

const login = async (data: LoginUserBody): Promise<Tokens> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await passwordHash.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
    },
  });

  const accessToken = token.generateAccessToken({
    sub: user.id,
    name: user.name,
    email,
    sessionId: session.id,
  });

  const refreshToken = token.generateRefreshToken({
    sub: user.id,
    name: user.name,
    email,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const logout = async (sessionId: string): Promise<{ message: string }> => {
  await prisma.session.delete({
    where: { id: sessionId },
  });

  return {
    message: "Logged out successfully",
  };
};

const refresh = async (req: Request): Promise<{ accessToken: string }> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const payload = token.verifyToken(refreshToken);

  if (!payload) {
    throw new AppError("Invalid refresh token or expired", 403);
  }

  const session = await prisma.session.findUnique({
    where: {
      id: payload.sessionId,
    },
  });

  if (!session) {
    throw new AppError("Invalid session", 401);
  }

  const { sub, name, email } = payload;

  const accessToken = token.generateAccessToken({
    sub,
    name,
    email,
    sessionId: session.id,
  });

  return { accessToken };
};

export { login, logout, refresh };
