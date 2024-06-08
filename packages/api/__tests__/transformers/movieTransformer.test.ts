import { describe, test, expect } from 'vitest';
import { transformMovies } from '../../src/transformers/movieTransformer';
import { type MovieSelect } from '../../src/types/MovieSelect';
import { type Movie } from '../../src/types/Movie';

const id = '123';
const title = 'my movie';
const date = '6/7/2024';
const runtime = '1hr 30min';
const imageSrc = 'example.jpg';
const imageAlt = 'alt';
const name = 'PG';
const rating = {
  name,
};
const pMovie: MovieSelect = {
  id,
  title,
  date,
  runtime,
  imageSrc,
  imageAlt,
  rating,
};
const pMovies = [pMovie];

describe('movieTransformer', () => {
  test('transform success', () => {
    const result: Movie[] = transformMovies(pMovies);
    expect(result.length).toEqual(pMovies.length);
    expect(result[0].id).toEqual(id);
    expect(result[0].title).toEqual(title);
    expect(result[0].date).toEqual(date);
    expect(result[0].runtime).toEqual(runtime);
    expect(result[0].image.src).toEqual(imageSrc);
    expect(result[0].image.alt).toEqual(imageAlt);
    expect(result[0].rating).toEqual(name);
    expect(result[0].proposedBy).toEqual([]);
    expect(result[0].votedBy).toEqual([]);
  });
  test('transform null', () => {
    const result = transformMovies(null);
    expect(result).toEqual([]);
  });
});
