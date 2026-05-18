/// <reference types="jest" />

import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app";
import { env } from "../src/config/env";
import { prisma } from "../src/lib/prisma";

import getAdminToken from "./helpers/getAdminToken";
import createClient from "../tests/helpers/createClient";

describe("Admin", () => {
  describe("POST /admin/clients", () => {
    it("should create a client", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        accessCode: expect.any(String),
      });
    });

    it("should return 400 when firstName has less than 4 characters", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "Joã",
          lastName: "Silva",
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when lastName has less than 4 characters", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Si",
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when CPF is invalid", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "00000000000",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when CPF is already in use", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "94279968039",
        });

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "Maria",
          lastName: "Tereza",
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when the required fields are missing", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if accessToken is missing", async () => {
      const res = await request(app).post("/admin/clients").send({
        firstName: "João",
        lastName: "Silva",
        cpf: "94279968039",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if accessToken is expired", async () => {
      const expiredToken = jwt.sign({ sub: "user-id" }, env.TOKEN_SECRET, {
        expiresIn: "-1h",
      });

      const res = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${expiredToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /admin/clients", () => {
    beforeEach(async () => {
      await prisma.client.createMany({
        data: [
          await createClient("gustavo", "silva", "98157250099", false),
          await createClient("joão", "silva", "95915964052", true),
          await createClient("joão", "ferreira", "55498739079", true),
          await createClient("maria", "rosa", "53308062089", false),
        ],
      });
    });

    it("should return a list of clients", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty("data");
      expect(res.statusCode).toBe(200);

      const clientBody = res.body.data[0];

      expect(clientBody).toMatchObject({
        id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        accessCode: expect.any(String),
        cpf: expect.any(String),
        isActive: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should filtered clients by firstName", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients")
        .query({ firstName: "joão" })
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty("data");
      expect(res.statusCode).toBe(200);

      res.body.data.forEach((customer: any) => {
        expect(customer.firstName).toBe("joão");
      });
    });

    it("should filtered clients by isActive=true", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients")
        .query({ isActive: true })
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty("data");
      expect(res.statusCode).toBe(200);

      res.body.data.forEach((customer: any) => {
        expect(customer.isActive).toBe(true);
      });
    });

    it("should filtered clients by isActive=false", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients")
        .query({ isActive: false })
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty("data");
      expect(res.statusCode).toBe(200);

      res.body.data.forEach((customer: any) => {
        expect(customer.isActive).toBe(false);
      });
    });

    it("should filtered clients by cpf", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients")
        .query({ cpf: "98157250099" })
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty("data");
      expect(res.statusCode).toBe(200);

      res.body.data.forEach((customer: any) => {
        expect(customer.cpf).toBe("98157250099");
      });
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .get("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if accessToken is missing", async () => {
      const res = await request(app).get("/admin/clients");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if accessToken is expired", async () => {
      const expiredToken = jwt.sign({ sub: "user-id" }, env.TOKEN_SECRET, {
        expiresIn: "-1h",
      });

      const res = await request(app)
        .get("/admin/clients")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /admin/clients/:id", () => {
    it("should return a client by id", async () => {
      const { accessToken } = await getAdminToken(app);

      const clientResponse = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "94279968039",
        });

      const clientId = clientResponse.body.id;

      const res = await request(app)
        .get(`/admin/clients/${clientId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        accessCode: expect.any(String),
        isActive: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should return 400 when route param id is not a valid UUID", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients/invalidId")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 404 if client does not exist", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .get("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      const clientResponse = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "João",
          lastName: "Silva",
          cpf: "94279968039",
        });

      const clientId = clientResponse.body.id;

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .get(`/admin/clients/${clientId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if accessToken is missing", async () => {
      const res = await request(app).get(
        "/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617",
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if accessToken is expired", async () => {
      const expiredToken = jwt.sign({ sub: "user-id" }, env.TOKEN_SECRET, {
        expiresIn: "-1h",
      });

      const res = await request(app)
        .get("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("PATCH /admin/clients/:id", () => {
    it("should update a client", async () => {
      const { accessToken } = await getAdminToken(app);

      const clientResponse = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "joão",
          lastName: "silva",
          cpf: "94279968039",
        });

      const clientId = clientResponse.body.id;

      const res = await request(app)
        .patch(`/admin/clients/${clientId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "marcio",
        });

      const updatedClient = res.body;

      expect(res.statusCode).toBe(200);
      expect(updatedClient.firstName).toBe("marcio");

      expect(updatedClient.lastName).toBe("silva");
      expect(updatedClient.cpf).toBe("94279968039");
    });

    it("should return 400 when route param id is not a valid UUID", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/invalidId")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when firstName has less than 4 characters", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "mar",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when lastName has less than 4 characters", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          lastName: "ri",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when CPF is invalid", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          cpf: "00000000000",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when the required fields are missing", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 404 if client does not exist", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "marcio",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 409 if client is inactive", async () => {
      const { accessToken } = await getAdminToken(app);

      const { id: clientId } = await prisma.client.create({
        data: await createClient("joão", "silva", "94279968039", false),
      });

      const res = await request(app)
        .patch(`/admin/clients/${clientId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "marcio",
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when CPF is already in use", async () => {
      const { accessToken } = await getAdminToken(app);

      const responseClient = await request(app)
        .post("/admin/clients")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "joão",
          lastName: "silva",
          cpf: "94279968039",
        });

      const clientId = responseClient.body.id;

      const res = await request(app)
        .patch(`/admin/clients/${clientId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          cpf: "94279968039",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          firstName: "marcio",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if accessToken is missing", async () => {
      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .send({
          firstName: "marcio",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if accessToken is expired", async () => {
      const expiredToken = jwt.sign({ sub: "user-id" }, env.TOKEN_SECRET, {
        expiresIn: "-1h",
      });

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617")
        .set("Authorization", `Bearer ${expiredToken}`)
        .send({
          firstName: "marcio",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("PATCH /admin/clients/:id/deactivate", () => {
    it("should deactivate a client", async () => {
      const { accessToken } = await getAdminToken(app);

      const { id: clientId } = await prisma.client.create({
        data: await createClient("joão", "silva", "94279968039", true),
      });

      const res = await request(app)
        .patch(`/admin/clients/${clientId}/deactivate`)
        .set("Authorization", `Bearer ${accessToken}`);

      const updatedClient = await prisma.client.findUnique({
        where: { id: clientId },
      });

      expect(res.statusCode).toBe(200);
      expect(updatedClient!.isActive).toBe(false);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when route param id is not a valid UUID", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/invalidId/deactivate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 404 if client does not exist", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/deactivate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if client is already inactive", async () => {
      const { accessToken } = await getAdminToken(app);

      const { id: clientId } = await prisma.client.create({
        data: await createClient("joão", "silva", "94279968039", false),
      });

      const res = await request(app)
        .patch(`/admin/clients/${clientId}/deactivate`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/deactivate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if accessToken is missing", async () => {
      const res = await request(app).patch(
        "/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/deactivate",
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if accessToken is expired", async () => {
      const expiredToken = jwt.sign({ sub: "user-id" }, env.TOKEN_SECRET, {
        expiresIn: "-1h",
      });

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/deactivate")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("PATCH /admin/clients/:id/activate", () => {
    it("should activate a client", async () => {
      const { accessToken } = await getAdminToken(app);

      const { id: clientId } = await prisma.client.create({
        data: await createClient("joão", "silva", "94279968039", false),
      });

      const res = await request(app)
        .patch(`/admin/clients/${clientId}/activate`)
        .set("Authorization", `Bearer ${accessToken}`);

      const updatedClient = await prisma.client.findUnique({
        where: { id: clientId },
      });

      expect(res.statusCode).toBe(200);
      expect(updatedClient!.isActive).toBe(true);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when route param id is not a valid UUID", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/invalidId/activate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 404 if client does not exist", async () => {
      const { accessToken } = await getAdminToken(app);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/activate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if client is already activate", async () => {
      const { accessToken } = await getAdminToken(app);

      const { id: clientId } = await prisma.client.create({
        data: await createClient("joão", "silva", "94279968039", true),
      });

      const res = await request(app)
        .patch(`/admin/clients/${clientId}/activate`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 when the session has already been invalidated", async () => {
      const { accessToken } = await getAdminToken(app);

      await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/activate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if accessToken is missing", async () => {
      const res = await request(app).patch(
        "/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/activate",
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if accessToken is expired", async () => {
      const expiredToken = jwt.sign({ sub: "user-id" }, env.TOKEN_SECRET, {
        expiresIn: "-1h",
      });

      const res = await request(app)
        .patch("/admin/clients/ef5d81e9-f54e-453d-93e6-4116d1f70617/activate")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
