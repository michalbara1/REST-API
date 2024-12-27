import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Directory to save the coverage report
  coverageProvider: 'v8', // Use V8 engine for coverage collection
  coverageReporters: ['text', 'lcov', 'json'], // Coverage report formats
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  testMatch: ['**/src/**/*.test.ts'], // Match test files in the src directory
  coveragePathIgnorePatterns: [
    '/node_modules/', // Ignore node_modules directory from coverage
  ],
};

export default config;
