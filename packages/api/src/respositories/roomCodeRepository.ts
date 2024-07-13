import { prisma } from '@movie/db';

export const findFirstActiveRoomCode = async () => {
  return await prisma.roomCode.findFirst({
    where: {
      isActive: false,
    },
  });
};

export const updateManyRoomCodeByVersionAndId = async (id: string, version: number) => {
  return await prisma.roomCode.updateMany({
    data: {
      isActive: true,
      version: {
        increment: 1,
      },
    },
    where: {
      id,
      version,
    },
  });
};
