import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

import { JwtPayload } from "../types/jwt";

function generateAccessToken(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, env.TOKEN_SECRET, {
    expiresIn: env.TOKEN_EXPIRATION as SignOptions["expiresIn"],
  });

  return accessToken;
}

function generateRefreshToken(payload: JwtPayload) {
  const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRATION as SignOptions["expiresIn"],
  });

  return refreshToken;
}

export { generateAccessToken, generateRefreshToken };
