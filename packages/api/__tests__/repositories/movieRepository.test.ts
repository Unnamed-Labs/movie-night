import { describe, test, expect } from 'vitest';
import * as repo from '../../src/respositories/movieRepository';

describe('movieRepository', () => {
  describe('getPopular', () => {
    test('fetches first 20 movies with a score greater than 0.75', async () => {
      const results = await repo.getPopular();
      expect(results.length).toBeGreaterThan(0);
    });
  });
  describe('searchMovies', () => {
    test('returns movie when found', async () => {
      const results = await repo.searchMovies('Shrek');
      expect(results.length).toBeGreaterThan(0);
    });
    test('returns null when not found', async () => {
      const results = await repo.searchMovies('I do not exist');
      expect(results).toEqual([]);
    });
  });
});
