import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

import { JwtPayload } from "../types/jwt.js";

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

function verifyToken(refreshToken: string): JwtPayload | null {
  try {
    const payload = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { generateAccessToken, generateRefreshToken, verifyToken };
