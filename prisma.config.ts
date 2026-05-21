import { env } from "./src/config/env";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node dist/seed/admin.seed.js",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
