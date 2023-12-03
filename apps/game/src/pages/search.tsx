import { useState } from 'react';
import { Button, Input, MovieCard, Timer } from '@movie/ui';
import { Page } from '~/components/Page';
import movies from '../data/movies.json';

const Search = () => {
  const [movieTitle, setMovieTitle] = useState('');
  return (
    <Page
      title="Movie Night"
      body="Search movie titles. Find 2 before time runs out!"
    >
      <Timer initialTime={60} />
      <Input
        placeholder="Search"
        value={movieTitle}
        onChange={setMovieTitle}
      />
      {movies.map((movie, idx) => (
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
        />
      ))}
      <Button>Done</Button>
    </Page>
  );
};

export default Search;
