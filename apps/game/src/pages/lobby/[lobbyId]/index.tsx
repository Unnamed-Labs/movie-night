import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@movie/ui';
import { Page } from '~/components/Page';
import { Participants } from '~/components/lobby/Participants';
import { useLobby } from '~/hooks/useLobby';
import { RoomCode } from '~/components/lobby/RoomCode';
import { api } from '~/utils/api';

const LobbyById = () => {
  const router = useRouter();
  const { lobby, user, loading, error, startGameById } = useLobby({
    enableParticipantUpdates: true,
  });
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!lobby || !user) {
      void router.push('/lobby/join');
    }
  }, [lobby, user, router]);

  const body = user?.isHost
    ? 'press start when everyone has joined!'
    : 'you’re in the lobby! the host will press start when everyone is in.';

  const handleStartGameOnClick = () => {
    if (lobby.participants.length > 2) {
      void startGameById();
    } else {
      setIsError(true);
    }
  };

  api.lobbyWs.onStartGame.useSubscription(
    { lobbyId: lobby?.id },
    {
      onData(data) {
        if (data) {
          void router.push(`/lobby/${lobby?.id}/search`);
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
      {user?.isHost && <RoomCode code={lobby?.code} />}
      <Participants
        participants={lobby?.participants ?? []}
        amount={lobby?.amount ?? 8}
      />
      {isError && (
        <p className="font-raleway text-sm text-red-300">
          Uh oh! There are not enough participants. You need 3 or more to begin...
        </p>
      )}
      {user?.isHost && (
        <Button
          label="start"
          onClick={handleStartGameOnClick}
        />
      )}
    </Page>
  );
};

export default LobbyById;
