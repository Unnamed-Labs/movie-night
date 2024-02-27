import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Error, Input } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';

const Lobby = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const { error, openRoom, joinByCode, setError } = useLobby();
  const images = [
    'http://localhost:3000/error-1.jpeg',
    'http://localhost:3000/error-2.jpeg',
    'http://localhost:3000/error-3.jpeg',
  ];

  const handleNameChange = (val: string) => setName(val);
  const handleRoomCodeChange = (val: string) => setRoomCode(val);

  const handleHostClick = async () => {
    const lobbyId = await openRoom(name);
    void router.push(`/lobby/${lobbyId}`);
  };

  const handleJoinClick = async () => {
    const lobbyId = await joinByCode(name, roomCode);
    void router.push(`/lobby/${lobbyId}`);
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
        <Error
          images={images}
          text={error}
          cta={{ label: 'try again', onClick: handleTryAgainClick }}
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
