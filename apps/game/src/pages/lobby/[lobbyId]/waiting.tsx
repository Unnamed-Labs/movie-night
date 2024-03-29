import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ImageWithText } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Waiting = () => {
  const router = useRouter();
  const { lobby, user, previousRoute } = useLobby();
  const waitingImageNumber = Math.floor(Math.random() * 3) + 1;
  const waitingImageSrc = `http://localhost:3000/waiting-${waitingImageNumber}.jpeg`;
  const waitingText = previousRoute
    ? previousRoute.includes('search')
      ? 'waiting for suggestions...'
      : previousRoute.includes('vote')
        ? 'waiting for votes...'
        : 'waiting...'
    : 'waiting...';

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
      <ImageWithText
        src={waitingImageSrc}
        text={waitingText}
      />
    </Page>
  );
};

export default Waiting;
