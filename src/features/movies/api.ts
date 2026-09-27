import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { tmdb } from '../../lib/tmdb';
import type { MovieDetail, MovieListResponse } from './types';

export type ListType = 'popular' | 'topRated' | 'upcoming';

const ENDPOINTS: Record<ListType, string> = {
  popular: 'popular',
  topRated: 'top_rated',
  upcoming: 'upcoming',
};

export const LIST_LABELS: Record<ListType, string> = {
  popular: 'Popular',
  topRated: 'Top rated',
  upcoming: 'Upcoming',
};

export function useMoviesList(type: ListType = 'popular', initialPage = 1) {
  return useInfiniteQuery({
    queryKey: ['movies', type],
    initialPageParam: initialPage,
    queryFn: ({ pageParam = initialPage }) =>
      tmdb<MovieListResponse>(`/movie/${ENDPOINTS[type]}?page=${pageParam}`),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}


export function useSearchMovies(query: string) {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ['search', trimmed],
    queryFn: ({ pageParam }) =>
      tmdb<MovieListResponse>(
        `/search/movie?query=${encodeURIComponent(trimmed)}&page=${pageParam}`,
      ),
    initialPageParam: 1,
    getNextPageParam: last =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    enabled: trimmed.length > 0,
  });
}

export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => tmdb<MovieDetail>(`/movie/${id}`),
  });
}