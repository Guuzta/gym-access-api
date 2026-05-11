import { prisma } from "../lib/prisma";
import { env } from "../config/env";

import * as password from "../utils/password";

async function createAdmin() {
  const adminExists = await prisma.user.findFirst({
    where: { email: env.ADMIN_EMAIL },
  });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await password.hash(env.ADMIN_PASSWORD);

  await prisma.user.create({
    data: {
      name: "admin",
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully");
}

createAdmin()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
