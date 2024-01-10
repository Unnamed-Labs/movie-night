import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import debounce from 'lodash.debounce';
import { Button, Input, MovieCard } from '@movie/ui';
import { appRouter, createInnerTRPCContext, type Movie } from '@movie/api';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';
import { useLobby } from '~/hooks/useLobby';

export const getServerSideProps = async () => {
  const serverHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson,
  });
  await serverHelpers.movie.getPopular.prefetch();
  return {
    props: {
      trpcState: serverHelpers.dehydrate(),
    },
  };
};

const SearchPage = () => {
  const router = useRouter();
  const { lobby, loading, error, submitProposedMovieById, setPreviousRoute } = useLobby();
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const { data: popular } = api.movie.getPopular.useQuery();
  const { data: searchResults } = api.movie.search.useQuery(
    { query: movieTitle },
    { enabled: !!movieTitle, refetchOnWindowFocus: false },
  );
  const movies = searchResults && searchResults.length > 0 ? searchResults : popular;

  useEffect(() => {
    setPreviousRoute(router.asPath);
  }, [router, setPreviousRoute]);

  const handleSearchOnInput = (name: string) => {
    setMovieTitle(name);
  };

  const debouncedSearch = useMemo(() => {
    return debounce(handleSearchOnInput, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  });

  const handleCardClick = (movie: Movie) => {
    const selected = selectedMovies.slice();
    const idx = selectedMovies.indexOf(movie);

    if (idx < 0) {
      selected.push(movie);
      setSelectedMovies(selected);
    } else {
      selected.splice(idx, 1);
      setSelectedMovies(selected);
    }
  };

  const isDisabled = (movie: Movie) =>
    selectedMovies.length >= 1 && !selectedMovies.includes(movie);

  const handleDoneClick = async () => {
    const res = await submitProposedMovieById(selectedMovies[0]);

    if (res.waiting) {
      void router.push(`/lobby/${lobby.id}/waiting`);
    }

    if (res.vote) {
      void router.push(`/lobby/${lobby.id}/vote`);
    }
  };

  return (
    <Page
      title="Movie Night"
      body="Search movie titles. Find 2 before time runs out!"
      loading={loading}
      error={error}
    >
      <Input
        placeholder="Search"
        onChange={debouncedSearch}
      />
      {movies &&
        movies.map((movie, idx) => (
          <MovieCard
            key={idx}
            title={movie.title}
            description={movie.description}
            image={movie.image}
            genres={movie.genres}
            date={movie.date}
            location={movie.location}
            rating={movie.rating}
            runtime={movie.runtime}
            score={movie.score * 100}
            selectable
            disabled={isDisabled(movie)}
            onClick={() => handleCardClick(movie)}
          />
        ))}
      <Button onClick={handleDoneClick}>Done</Button>
    </Page>
  );
};

export default SearchPage;
