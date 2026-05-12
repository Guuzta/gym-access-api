import { prisma } from "../lib/prisma";

import * as passwordHash from "../utils/password";
import AppError from "../utils/AppError";
import { generateAccessToken } from "../utils/generateAccessToken";

import { LoginUserBody } from "../schemas/loginSchema";

import { Token } from "../types/jwt";

const login = async (data: LoginUserBody): Promise<Token> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await passwordHash.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateAccessToken({ sub: user.id, name: user.name, email });

  return {
    token,
  };
};

export { login };
