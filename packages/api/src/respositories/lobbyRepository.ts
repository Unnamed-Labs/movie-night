import { prisma } from '@movie/db';

export const createLobby = async (id: string, code: string) => {
  await prisma.lobby.create({
    data: {
      id,
      code,
      isActive: true,
    },
  });
};

type UpdateLobbyByIdData = {
  isActive?: boolean;
  movieId?: string;
};

export const updateLobbyById = async (id: string, data: UpdateLobbyByIdData = {}) => {
  await prisma.lobby.update({
    data: { ...data },
    where: {
      id,
    },
  });
};

export const findActiveLobbyByCode = async (code: string) => {
  return await prisma.lobby.findFirst({
    select: {
      id: true,
    },
    where: {
      code,
      isActive: true,
    },
  });
};

export const findLobbyResultById = async (id: string) => {
  return await prisma.lobby.findFirst({
    select: {
      movie: {
        select: {
          title: true,
          imageSrc: true,
          imageAlt: true,
        },
      },
      winners: {
        select: {
          name: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  });
};
