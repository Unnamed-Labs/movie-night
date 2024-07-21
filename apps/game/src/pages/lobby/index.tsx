import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, UniversalPlacement, Input } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';

const Lobby = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const { error, openRoom, joinByCode, setError } = useLobby();
  const errorImageNumber = Math.floor(Math.random() * 3) + 1;
  const errorImage = {
    src: `http://localhost:3000/waiting-${errorImageNumber}.jpeg`,
    alt: '',
  };

  const handleNameChange = (val: string) => setName(val);
  const handleRoomCodeChange = (val: string) => setRoomCode(val);

  const handleHostClick = async () => {
    const lobbyId = await openRoom(name);

    if (lobbyId) {
      void router.push(`/lobby/${lobbyId}`);
    }
  };

  const handleJoinClick = async () => {
    const lobbyId = await joinByCode(name, roomCode);

    if (lobbyId) {
      void router.push(`/lobby/${lobbyId}`);
    }
  };

  const handleTryAgainClick = () => {
    setError('');
  };

  return (
    <Page
      title="Movie Night"
      body="would you like to host or join a lobby?"
    >
      {error ? (
        <UniversalPlacement
          heading="uh oh!"
          description={error}
          image={errorImage}
          primary={{ label: 'retry', onClick: handleTryAgainClick }}
        />
      ) : (
        <>
          <Input
            label="name"
            helpText="enter a display name"
            required
            onChange={handleNameChange}
          />
          <Input
            label="room #"
            helpText="only enter if joining a room"
            onChange={handleRoomCodeChange}
          />
          <Button
            label="host"
            disabled={!name}
            onClick={handleHostClick}
          />
          <Button
            label="join"
            variant="secondary"
            disabled={!name || !roomCode}
            onClick={handleJoinClick}
          />
        </>
      )}
    </Page>
  );
};

export default Lobby;
