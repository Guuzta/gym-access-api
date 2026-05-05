import dotenv from "dotenv";

const envFile = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${envFile}`,
});

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable ${key}.`);
  }

  return value;
}

export const env = {
  PORT: Number(getEnv("PORT")),
  DATABASE_URL: getEnv("DATABASE_URL"),
};
