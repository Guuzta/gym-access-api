/// <reference types="jest" />

import request from "supertest";
import app from "../src/app";

describe("Auth", () => {
  it("should return 200 on login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "admin@gymaccess.com",
      password: "admin1234",
    });

    expect(res.status).toBe(200);
  });
});
