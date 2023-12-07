import { useState } from 'react';
import { useRouter } from 'next/router';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { Button, Input, MovieCard, Timer } from '@movie/ui';
import { appRouter, createInnerTRPCContext } from '@movie/api';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';

export const getServerSideProps = async () => {
  const serverHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson,
  });
  await serverHelpers.movie.prefetch();
  return {
    props: {
      trpcState: serverHelpers.dehydrate(),
    },
  };
};

const Search = () => {
  const router = useRouter();
  // Retrieve movies, infinite scroll?
  const { data: movies } = api.movie.useQuery();
  const [movieTitle, setMovieTitle] = useState('');
  const [filterMovies, setFilterMovies] = useState(movies);
  const [selectedMovies, setSelectedMovies] = useState([]);

  // Search movies on input, debounce?
  // Filter movies
  const handleSearchOnInput = (name: string) => {
    const newFilterMovies = movies.filter((movie) =>
      movie.name.toLowerCase().includes(name.toLowerCase()),
    );
    setMovieTitle(name);
    setFilterMovies(newFilterMovies);
  };

  // Select movies on card click
  // Disable unselected cards if 2 are already selected
  const handleCardClick = (movie) => {
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

  const isDisabled = (movie) => selectedMovies.length >= 2 && !selectedMovies.includes(movie);

  const handleDoneClick = () => {
    void router.push('/vote');
  };

  return (
    <Page
      title="Movie Night"
      body="Search movie titles. Find 2 before time runs out!"
    >
      <Timer initialTime={60} />
      <Input
        placeholder="Search"
        value={movieTitle}
        onChange={handleSearchOnInput}
      />
      {filterMovies &&
        filterMovies.map((movie, idx) => (
          <MovieCard
            key={idx}
            title={movie.name}
            description={movie.description}
            image={movie.image}
            categories={movie.genres}
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

export default Search;
