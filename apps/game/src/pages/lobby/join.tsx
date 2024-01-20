import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from '@movie/ui';
import { useLobby } from '~/hooks/useLobby';
import { Page } from '~/components/Page';

const Join = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const { loading, error, joinByCode } = useLobby();

  const handleDisplayNameChange = (val: string) => {
    setDisplayName(val);
  };

  const handleRoomNumberChange = (val: string) => {
    setRoomCode(val);
  };

  const handleJoinLobbyClick = async () => {
    const lobbyId = await joinByCode(displayName, roomCode);
    void router.push(`/lobby/${lobbyId}`);
  };

  return (
    <Page
      title="Movie Night"
      body="Enter your name and join a room!"
      loading={loading}
      error={error}
    >
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
        label="join room"
        disabled={!displayName || !roomCode}
        onClick={handleJoinLobbyClick}
      />
    </Page>
  );
};

export default Join;
