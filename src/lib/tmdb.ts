import { TMDB_READ_TOKEN } from '../config/env';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

export async function tmdb<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_READ_TOKEN}`,
      accept: 'application/json',
    },
  });

  // fetch does NOT throw on 4xx/5xx — it resolves. Without this check,
  // an error page would flow through as if it were data.
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

type PosterSize = 'w154' | 'w342' | 'w500';
type BackdropSize = 'w780' | 'w1280';

export function posterUrl(path: string | null, size: PosterSize = 'w342') {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: BackdropSize = 'w780') {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}
