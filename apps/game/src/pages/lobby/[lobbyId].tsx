import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Page } from '~/components/Page';
import { Participants } from '~/components/lobby/Participants';
import { useLobby } from '~/hooks/useLobby';
import { RoomCode } from '~/components/lobby/RoomCode';
import { Button } from '@movie/ui';

const LobbyById = () => {
  const router = useRouter();
  const { room, user, body, setBody } = useLobby();

  if (!room || !user) {
    void router.push('/lobby/join');
  }

  useEffect(() => {
    setBody(
      user.isHost
        ? 'Press start when everyone has joined!'
        : 'You’re in the lobby! The host will press start when everyone is in.',
    );
  }, [user, setBody]);

  const handleStartGameOnClick = () => {
    void router.push('/search');
  };

  return (
    <Page
      title="Movie Night"
      body={body}
    >
      {user.isHost && <RoomCode code={room.code} />}
      <Participants
        participants={room.participants}
        amount={room.amount}
      />
      {user.isHost && <Button onClick={handleStartGameOnClick}>Start game</Button>}
    </Page>
  );
};

export default LobbyById;
