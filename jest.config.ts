import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  clearMocks: true,
  restoreMocks: true,

  maxWorkers: 1,
};

export default config;
