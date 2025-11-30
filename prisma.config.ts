import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema/schema.prisma",
  migrations: {
    path: "prisma/schema/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
