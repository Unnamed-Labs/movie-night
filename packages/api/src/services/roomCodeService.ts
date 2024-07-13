import {
  findFirstActiveRoomCode,
  updateManyRoomCodeByVersionAndId,
} from '../respositories/roomCodeRepository';

export const checkoutRoomCode = async () => {
  let availableCode = await findFirstActiveRoomCode();

  if (!availableCode) {
    throw Error();
  }

  let roomCode = await updateManyRoomCodeByVersionAndId(availableCode.id, availableCode.version);

  while (roomCode.count === 0) {
    availableCode = await findFirstActiveRoomCode();

    if (!availableCode) {
      throw Error();
    }

    roomCode = await updateManyRoomCodeByVersionAndId(availableCode.id, availableCode.version);
  }

  return availableCode.code;
};
