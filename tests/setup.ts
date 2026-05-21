/// <reference types="jest" />

import { prisma } from "../src/lib/prisma";

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
