import { prisma } from "../lib/prisma";

import * as passwordHash from "../utils/password";
import * as token from "../utils/token";
import AppError from "../utils/AppError";

import { LoginUserBody } from "../schemas/loginSchema";

import { Tokens } from "../types/jwt";

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

export { login };
