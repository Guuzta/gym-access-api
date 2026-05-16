//// <reference types="jest" />

import request from "supertest";

import app from "../src/app";
import { env } from "../src/config/env";

import createAdmin from "./helpers/createAdmin";

describe("Auth", () => {
  describe("POST /auth/login", () => {
    it("should login a user", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
    });

    it("should return 400 if email is missing ", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        password: env.ADMIN_PASSWORD,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 if email is invalid ", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        email: "Invalidemail.com",
        password: env.ADMIN_PASSWORD,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 if password is missing ", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        email: env.ADMIN_EMAIL,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 if password is weak", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        email: env.ADMIN_EMAIL,
        password: "weak",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should not allow login when the required fields are missing", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should not allow login when the email doest not exist", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        email: "Invalidemail@test.com",
        password: env.ADMIN_PASSWORD,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should not allow login when the password is incorrect", async () => {
      await createAdmin();

      const res = await request(app).post("/auth/login").send({
        email: env.ADMIN_EMAIL,
        password: "Invalidpassword1234",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });
  });
});
