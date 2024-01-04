import { MovieCard } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Result = () => {
  const { lobby } = useLobby();

  if (!lobby) {
    return <div>Room not available...</div>;
  }

  const { data: result } = api.lobby.getResultById.useQuery({ lobbyId: lobby.id });
  const body = result ? `Congrats to ${result.name}. Enjoy!` : '';
  return (
    <Page
      title="Movie Night"
      body={body}
    >
      {result && (
        <MovieCard
          title={result.name}
          description={result.description}
          image={result.image}
          categories={result.genres}
          date={result.date}
          location={result.location}
          rating={result.rating}
          runtime={result.runtime}
          score={result.score * 100}
        />
      )}
    </Page>
  );
};

export default Result;
