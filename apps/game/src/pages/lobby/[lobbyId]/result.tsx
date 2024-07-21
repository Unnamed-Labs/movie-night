import { type GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter, createInnerTRPCContext } from '@movie/api';
import { UniversalPlacement } from '@movie/ui';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const serverHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson,
  });
  const lobbyId = context.params?.lobbyId?.toString() || '';
  await serverHelpers.lobby.getResultById.prefetch({ lobbyId });
  return {
    props: {
      trpcState: serverHelpers.dehydrate(),
    },
  };
};

const Result = () => {
  const router = useRouter();
  const lobbyId = router.query.lobbyId as string;
  const errorImageNumber = Math.floor(Math.random() * 3) + 1;
  const errorImage = {
    src: `http://localhost:3000/error-${errorImageNumber}.jpeg`,
    alt: '',
  };

  const { data: result } = api.lobby.getResultById.useQuery({ lobbyId });

  const winners = result?.winners.reduce((prev, cur, idx) => {
    const name = cur.name || cur.user?.name;
    if (idx === 0) {
      return name;
    }
    if (idx === result?.winners.length - 1) {
      return `${prev} and ${name}`;
    }
    return `${prev}, ${name}`;
  }, '');

  return (
    <Page title="Movie Night">
      {result && result.movie && result.winners && result.winners.length > 0 ? (
        <section className="flex max-w-[375px] flex-col items-center gap-8 py-8">
          <p className="font-raleway">
            congrats to <strong>{winners}</strong>!
          </p>
          <p className="font-raleway text-center">
            <strong>{result.movie.title}</strong> won by popular vote. enjoy your movie night!
          </p>
          <Image
            className="rounded-lg"
            src={result.movie.imageSrc}
            alt={result.movie.imageAlt}
            width={311}
            height={468}
          />
        </section>
      ) : (
        <UniversalPlacement
          heading="uh oh!"
          description="no results for this lobby can be provided at this time..."
          image={errorImage}
        />
      )}
    </Page>
  );
};

export default Result;
