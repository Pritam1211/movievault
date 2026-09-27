export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

export type MovieListResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

// Detail returns named genre objects instead of ids
export type MovieDetail = Omit<Movie, 'genre_ids'> & {
  runtime: number | null;
  tagline: string;
  genres: { id: number; name: string }[];
};
