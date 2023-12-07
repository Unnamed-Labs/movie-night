import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input } from '@movie/ui';
import { Page } from '~/components/Page';
import { RoomCode } from '~/components/lobby/RoomCode';
import { Participants } from '~/components/lobby/Participants';

const Lobby = () => {
  const router = useRouter();
  const [body, setBody] = useState('Would you like to host or join a lobby?');
  const [isHost, setIsHost] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');

  const handleHostClick = () => {
    setIsHost(true);
    setBody('Press start when everyone has joined!');

    // create a room
  };

  const handleJoinClick = () => {
    setIsJoin(true);
    setBody('Enter the room # to join.');
  };

  const handleRoomNumberChange = (val: string) => {
    setRoomNumber(val);
  };

  const handleJoinLobbyClick = () => {
    setIsJoin(false);
    setJoinedLobby(true);
    setBody('You’re in the lobby! The host will press start when everyone is in.');

    // search for lobby, join if it exists, error message if not
  };

  const handleStartClick = () => {
    void router.push('/search');
  };

  return (
    <Page
      title="Movie Night"
      body={body}
    >
      {isHost ? (
        <>
          <RoomCode />
          <Participants />
          <Button onClick={handleStartClick}>Start</Button>
        </>
      ) : isJoin ? (
        <>
          <Input
            placeholder="Enter room #"
            value={roomNumber}
            onChange={handleRoomNumberChange}
          />
          <Button
            variant="primary"
            onClick={handleJoinLobbyClick}
          >
            Join
          </Button>
        </>
      ) : joinedLobby ? (
        <Participants />
      ) : (
        <>
          <Button
            variant="primary"
            onClick={handleHostClick}
          >
            Host
          </Button>
          <Button
            variant="secondary"
            onClick={handleJoinClick}
          >
            Join
          </Button>
        </>
      )}
    </Page>
  );
};

export default Lobby;