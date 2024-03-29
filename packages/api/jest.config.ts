import { type Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  preset: 'ts-jest/presets/js-with-ts',
  collectCoverageFrom: ['src/router/http/**/*.ts', 'src/router/ws/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/__tests__/helpers/*'],
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/helpers/singleton.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!superjson/.*)',
  ],
};

export default config;
