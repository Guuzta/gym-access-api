import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

import { JwtPayload } from "../types/jwt";

export function generateAccessToken(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, env.TOKEN_SECRET, {
    expiresIn: env.TOKEN_EXPIRATION as SignOptions["expiresIn"],
  });

  return accessToken;
}
