import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/config/env";

import * as passwordHash from "../../src/utils/password";

async function createAdmin() {
  const hashedPassword = await passwordHash.hash(env.ADMIN_PASSWORD);

  await prisma.user.create({
    data: {
      name: "admin",
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

export default createAdmin;
