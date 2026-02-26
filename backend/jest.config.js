/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],

  // Modern ts-jest config syntax (replaces deprecated globals.ts-jest)
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },

  setupFiles: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  verbose: true,
};

module.exports = config;
