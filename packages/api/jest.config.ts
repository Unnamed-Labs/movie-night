import { type Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules'
  ],
  preset: 'ts-jest',
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
};

export default config;
