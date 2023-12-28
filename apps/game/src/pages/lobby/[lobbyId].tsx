import { useRouter } from 'next/router';
import { Page } from '~/components/Page';
import { Participants } from '~/components/lobby/Participants';
import { useLobby } from '~/hooks/useLobby';
import { RoomCode } from '~/components/lobby/RoomCode';
import { Button } from '@movie/ui';
import { useEffect } from 'react';
import { api } from '~/utils/api';

const LobbyById = () => {
  const router = useRouter();
  const { room, user, loading, error, startGame } = useLobby({ enableParticipantUpdates: true });

  useEffect(() => {
    if (!room || !user) {
      void router.push('/lobby/join');
    }
  }, [room, user, router]);

  const body = user?.isHost
    ? 'Press start when everyone has joined!'
    : 'You’re in the lobby! The host will press start when everyone is in.';

  const handleStartGameOnClick = () => {
    void startGame();
  };

  api.lobbyWs.onStartGame.useSubscription(
    { roomId: room.id },
    {
      onData(data) {
        if (data) {
          void router.push('/search');
        }
      },
    },
  );

  return (
    <Page
      title="Movie Night"
      body={body}
      loading={loading}
      error={error}
    >
      {user?.isHost && <RoomCode code={room?.code} />}
      <Participants
        participants={room?.participants ?? []}
        amount={room?.amount ?? 8}
      />
      {user?.isHost && <Button onClick={handleStartGameOnClick}>Start game</Button>}
    </Page>
  );
};

export default LobbyById;
