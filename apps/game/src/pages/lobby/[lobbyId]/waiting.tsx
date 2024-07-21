import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UniversalPlacement } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Waiting = () => {
  const router = useRouter();
  const { lobby, user, previousRoute } = useLobby();
  const waitingImageNumber = Math.floor(Math.random() * 3) + 1;
  const waitingImage = {
    src: `http://localhost:3000/waiting-${waitingImageNumber}.jpeg`,
    alt: '',
  };
  const waitingDescription = previousRoute
    ? previousRoute.includes('search')
      ? 'for suggestions...'
      : previousRoute.includes('vote')
        ? 'for votes...'
        : 'for time to pass...'
    : 'for time to pass...';

  useEffect(() => {
    if (!lobby || !user) {
      void router.push('/lobby/join');
    }
  }, [lobby, user, router]);

  if (lobby) {
    api.lobbyWs.onMovieProposed.useSubscription(
      { lobbyId: lobby.id },
      {
        onData(data) {
          if (data) {
            void router.push(`/lobby/${lobby.id}/vote`);
          }
        },
      },
    );

    api.lobbyWs.onMovieVoted.useSubscription(
      { lobbyId: lobby.id },
      {
        onData(data) {
          if (data.done && !data.hasTies) {
            void router.push(`/lobby/${lobby.id}/result`);
          } else {
            void router.push(`/lobby/${lobby.id}/vote`);
          }
        },
      },
    );
  }

  return (
    <Page title="Movie Night">
      <UniversalPlacement
        heading="waiting"
        description={waitingDescription}
        image={waitingImage}
      />
    </Page>
  );
};

export default Waiting;
