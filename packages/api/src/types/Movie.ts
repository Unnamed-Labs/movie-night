export type Movie = {
  id: string;
  name: string;
  description: string;
  year: string;
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
