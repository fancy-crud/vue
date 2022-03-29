module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
};