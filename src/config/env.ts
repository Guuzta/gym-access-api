import dotenv from "dotenv";

const envFile = process.env.NODE_ENV;

if (!envFile) {
  throw new Error(
    "NODE_ENV is not defined. Please set it in your script (e.g. development, test or production).",
  );
}

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
};
