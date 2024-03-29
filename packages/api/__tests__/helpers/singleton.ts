import { prisma, type PrismaClient } from '@movie/db';
import { mockDeep, mockReset, type DeepMockProxy } from 'jest-mock-extended';

jest.doMock('@movie/db', () => ({
  // __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
