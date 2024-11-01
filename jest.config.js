/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',           // Add this to enable TypeScript support
  testEnvironment: 'node',      // This is already set correctly
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ['**/tests/**/*.test.ts'], // Add this to specify the test file location and pattern
};

