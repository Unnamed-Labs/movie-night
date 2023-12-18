import { Button, Input } from '@movie/ui';
import { useState } from 'react';
import { Participants } from './Participants';
import { useRoomStore } from '~/stores/room';
import { api } from '~/utils/api';

export const Join = () => {
  /**
   * Default state: show join lobby form
   * Error states:
   *   - lobby couldn't be found
   *   - lobby couldn't be joined
   *   - lobby was full
   *   - error
   * Loading state: loader
   * Success state: lobby participant list
   */
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const { setId, setCode, setBody, setIsLoading, setError, addParticipant } = useRoomStore(
    (state) => ({
      setId: state.setId,
      setCode: state.setCode,
      setBody: state.setBody,
      setIsLoading: state.setIsLoading,
      setError: state.setError,
      addParticipant: state.addParticipant,
    }),
  );

  const {
    data: participant,
    isSuccess,
    isLoading,
    isError,
    mutate: joinRoomByCode,
  } = api.participant.joinRoomByCode.useMutation();

  if (isSuccess) {
    setId(participant.room.id);
    setCode(participant.room.code);
    addParticipant(participant);
  }

  if (isLoading) {
    setIsLoading(isLoading);
  }

  if (isError) {
    setError('Unable to join the lobby...');
  }

  const handleRoomNumberChange = (val: string) => {
    setRoomCode(val);
  };

  const handleJoinLobbyClick = () => {
    setHasJoinedLobby(true);
    setBody('You’re in the lobby! The host will press start when everyone is in.');

    joinRoomByCode({
      name: 'test name',
      isHost: false,
      code: roomCode,
    });
  };

  return (
    <>
      {!hasJoinedLobby ? (
        <>
          <Input
            placeholder="Enter room #"
            onChange={handleRoomNumberChange}
          />
          <Button
            variant="primary"
            onClick={handleJoinLobbyClick}
          >
            Join
          </Button>
        </>
      ) : (
        <Participants />
      )}
    </>
  );
};
