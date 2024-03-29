import { Error } from '@movie/ui';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';

const Result = () => {
  const router = useRouter();
  const lobbyId = router.query.lobbyId as string;
  const images = [
    'http://localhost:3000/error-1.jpeg',
    'http://localhost:3000/error-2.jpeg',
    'http://localhost:3000/error-3.jpeg',
  ];

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
        <Error
          text="uh oh! no results for this lobby can be provided at this time..."
          images={images}
        />
      )}
    </Page>
  );
};

export default Result;
