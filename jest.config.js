module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {tsconfig: "tsconfig.jest.json"}],
  },

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/app/**/*.test.@(ts|tsx)"],

  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [   /** OPTIONAL**/
    "src/app/components/**/*.{ts,tsx}",
    "src/app/hooks/**/*.{ts,tsx}",
    "src/app/lib/**/*.{ts,tsx}",
    "!**/__tests__/**",  // pomiń 
  ],
};
