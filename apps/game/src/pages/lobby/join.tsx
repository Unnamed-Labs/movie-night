import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from '@movie/ui';
import { useLobby } from '~/hooks/useLobby';
import { Page } from '~/components/Page';

const Join = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const { body, isLoading, error, setBody, joinRoomByCode } = useLobby();

  useEffect(() => {
    setBody('Enter your name and create a room!');
  }, [setBody]);

  const handleDisplayNameChange = (val: string) => {
    setDisplayName(val);
  };

  const handleRoomNumberChange = (val: string) => {
    setRoomCode(val);
  };

  const handleJoinLobbyClick = async () => {
    const lobbyId = await joinRoomByCode(displayName, roomCode);
    void router.push(`/lobby/${lobbyId}`);
  };

  return (
    <Page
      title="Movie Night"
      body={body}
    >
      {isLoading ? (
        <div>Joining room...</div>
      ) : error ? (
        <div>Uh oh! An error occurred when joining the room...</div>
      ) : (
        <>
          <Input
            label="Name"
            required
            helpText="Enter your display name"
            onChange={handleDisplayNameChange}
          />
          <Input
            label="Room #"
            required
            helpText="Four digit room code provided by host"
            onChange={handleRoomNumberChange}
          />
          <Button
            disabled={!displayName || !roomCode}
            onClick={handleJoinLobbyClick}
          >
            Join room
          </Button>
        </>
      )}
    </Page>
  );
};

export default Join;
