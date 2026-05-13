import { Response, CookieOptions } from "express";

export function setRefreshTokenCookie(res: Response, token: string) {
  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/auth/refresh",
  };

  res.cookie("refreshToken", token, options);
}
