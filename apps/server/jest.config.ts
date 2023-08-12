import { type Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules'
  ],
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/__tests__/helpers/*'],
};

export default config;
