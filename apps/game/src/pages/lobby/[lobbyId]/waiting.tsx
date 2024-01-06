import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Waiting = () => {
  const router = useRouter();
  const { lobby, user } = useLobby();

  useEffect(() => {
    if (!lobby || !user) {
      void router.push('/lobby/join');
    }
  }, [lobby, user, router]);

  api.lobbyWs.onMovieProposed.useSubscription(
    { lobbyId: lobby?.id },
    {
      onData(data) {
        if (data) {
          void router.push(`/lobby/${lobby?.id}/vote`);
        }
      },
    },
  );

  api.lobbyWs.onMovieVoted.useSubscription(
    { lobbyId: lobby?.id },
    {
      onData(data) {
        if (data) {
          void router.push(`/lobby/${lobby?.id}/result`);
        }
      },
    },
  );

  return (
    <Page
      title="Movie Night"
      body=""
    >
      <div>Waiting...</div>
    </Page>
  );
};

export default Waiting;
