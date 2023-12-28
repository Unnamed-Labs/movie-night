// import type { Movie } from '@movie/api';
// import { MovieCard } from '@movie/ui';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter, createInnerTRPCContext } from '@movie/api';
import { MovieCard } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

export const getServerSideProps = async () => {
  const serverHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson,
  });
  await serverHelpers.movie.getResult.prefetch();
  return {
    props: {
      trpcState: serverHelpers.dehydrate(),
    },
  };
};

const Results = () => {
  const { room } = useLobby();
  const { data: result } = api.movie.getResult.useQuery({ roomId: room.id });
  const body = `Congrats to ${result.name}. Enjoy!`;
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

export default Results;
