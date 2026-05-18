/// <reference types="jest" />

import request from "supertest";

import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Access", () => {
  describe("POST /access", () => {
    it("should verify accessCode successfully", async () => {
      const { accessCode } = await prisma.client.create({
        data: {
          firstName: "joão",
          lastName: "silva",
          cpf: "94279968039",
          accessCode: "378414",
        },
      });

      const res = await request(app).post("/access").send({
        accessCode,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when accessCode has less than 6 digits", async () => {
      const res = await request(app).post("/access").send({
        accessCode: "3784",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when accessCode has more than 6 digits", async () => {
      const res = await request(app).post("/access").send({
        accessCode: "37841428",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 403 when accessCode is not linked to any client", async () => {
      const res = await request(app).post("/access").send({
        accessCode: "378414",
      });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when client is inactive", async () => {
      const { accessCode } = await prisma.client.create({
        data: {
          firstName: "joão",
          lastName: "silva",
          cpf: "94279968039",
          accessCode: "378414",
          isActive: false,
        },
      });

      const res = await request(app).post("/access").send({
        accessCode,
      });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
