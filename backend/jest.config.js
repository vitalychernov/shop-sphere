/** @type {import('jest').Config} */
const config = {
  // Use ts-jest to transpile TypeScript test files
  preset: 'ts-jest',

  // Node environment — no DOM needed for backend tests
  testEnvironment: 'node',

  // Where to find tests
  roots: ['<rootDir>/tests'],

  // Use tsconfig.test.json which includes both src/ and tests/
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },

  // Run this file before each test suite to set required env variables
  setupFiles: ['<rootDir>/tests/setup.ts'],

  // 30 seconds — mongodb-memory-server needs time to start
  testTimeout: 30000,

  // Run tests serially — avoids DB conflicts between test files
  runInBand: true,

  verbose: true,
};

module.exports = config;
