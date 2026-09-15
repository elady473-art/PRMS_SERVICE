/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "lib/prms-api.ts",
    "lib/api.ts",
    "features/prms/hooks/**/*.ts",
    "features/auth/**/*.ts",
    "features/auth/**/*.tsx",
  ],
};

module.exports = config;
