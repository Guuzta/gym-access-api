/// <reference types="jest" />

import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app";
import { env } from "../src/config/env";

import createAdmin from "./helpers/createAdmin";
import getAdminToken from "./helpers/getAdminToken";

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

  describe("POST /auth/logout", () => {
    it("should logout a user", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).post("/auth/logout");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer invalidToken`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/refresh", () => {
    it("should generate a new accessToken using a refreshToken", async () => {
      await createAdmin();

      const agent = request.agent(app);

      await agent.post("/auth/login").send({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      });

      const res = await agent.post("/auth/refresh");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should return 401 if refreshToken is missing", async () => {
      const res = await request(app).post("/auth/refresh");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when refreshToken is invalid", async () => {
      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", ["refreshToken=invalid-token"]);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when refreshToken is expired", async () => {
      const expiredToken = jwt.sign(
        { sub: "user-id" },
        env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "-1h",
        },
      );

      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [`refreshToken=${expiredToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      await createAdmin();

      const agent = request.agent(app);

      const loginResponse = await agent.post("/auth/login").send({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      });

      await agent
        .post("/auth/logout")
        .set("Authorization", `Bearer ${loginResponse.body.accessToken}`);

      const res = await agent.post("/auth/refresh");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });
  });
});
