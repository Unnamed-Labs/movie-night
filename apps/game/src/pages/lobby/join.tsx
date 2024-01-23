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
      body="enter your name and join a room!"
      loading={loading}
      error={error}
    >
      <Input
        label="name"
        required
        helpText="enter your display name"
        onChange={handleDisplayNameChange}
      />
      <Input
        label="room #"
        required
        helpText="four digit room code provided by host"
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
