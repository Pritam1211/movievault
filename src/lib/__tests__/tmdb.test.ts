// tmdb.ts reads TMDB_READ_TOKEN from src/config/env, which is gitignored.
// Mocking it keeps these tests runnable on a fresh clone.
jest.mock('../../config/env', () => ({ TMDB_READ_TOKEN: 'test-token' }));

import { posterUrl, backdropUrl } from '../tmdb';

describe('posterUrl', () => {
  it('composes host, size and path', () => {
    expect(posterUrl('/abc123.jpg')).toBe(
      'https://image.tmdb.org/t/p/w342/abc123.jpg',
    );
  });

  it('defaults to w342 rather than original', () => {
    // Grid cells are ~110pt. Requesting `original` would download several MB
    // per poster and decode it at full resolution to throw most of it away.
    expect(posterUrl('/abc123.jpg')).toContain('/w342/');
  });

  it('honours an explicit size', () => {
    expect(posterUrl('/abc123.jpg', 'w500')).toBe(
      'https://image.tmdb.org/t/p/w500/abc123.jpg',
    );
  });

  it('returns null for a missing poster', () => {
    // TMDB genuinely returns null poster_path for obscure and unreleased films.
    // Callers rely on null to render the title fallback instead of a broken image.
    expect(posterUrl(null)).toBeNull();
  });
});

describe('backdropUrl', () => {
  it('composes a backdrop at the default size', () => {
    expect(backdropUrl('/xyz.jpg')).toBe(
      'https://image.tmdb.org/t/p/w780/xyz.jpg',
    );
  });

  it('returns null for a missing backdrop', () => {
    expect(backdropUrl(null)).toBeNull();
  });
});
