import { Express } from "express";
import request from "supertest";

import { env } from "../../src/config/env";
import { Tokens } from "../../src/types/jwt";

import createAdmin from "./createAdmin";

async function getAdminToken(app: Express): Promise<Tokens> {
  await createAdmin();

  const res = await request(app).post("/auth/login").send({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  });

  return {
    accessToken: res.body.accessToken,
    refreshToken: res.body.refreshToken,
  };
}

export default getAdminToken;
