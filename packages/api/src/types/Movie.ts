export type Movie = {
  id: string;
  title: string;
  description: string;
  date: string;
  score: number;
  location: string;
  runtime: string;
  image: {
    src: string;
    alt: string;
  };
  rating: string;
  genres: string[];
};
