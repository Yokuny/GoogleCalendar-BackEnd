export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  transform: {
    ".+\\\\.ts$": "ts-jest",
  },
  testMatch: ["<rootDir>/tests/*.(test|spec).ts", "<rootDir>/tests/service/*.(test|spec).ts"],
};
