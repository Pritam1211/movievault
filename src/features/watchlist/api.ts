import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { userMessage } from '../../lib/error';
import { useToast } from '../../components/Toast';

export type WatchStatus = 'want' | 'watched';

export type WatchlistEntry = {
  id: string;
  user_id: string;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  status: WatchStatus;
  rating: number | null;
  note: string | null;
  created_at: string;
};

export type SaveInput = {
  tmdb_id: number;
  title: string;
  poster_path: string | null;
};

const watchlist = () => supabase.schema('movies').from('watchlist');

export function useWatchlist() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['watchlist', session?.user.id],
    queryFn: async () => {
      // No .eq('user_id', ...) — RLS already restricts rows to this user.
      const { data, error } = await watchlist()
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WatchlistEntry[];
    },
    enabled: Boolean(session),
  });
}

/** One film's entry, or null. Derived from the cached list — no extra request. */
export function useWatchlistEntry(tmdbId: number) {
  const { data } = useWatchlist();
  return data?.find(entry => entry.tmdb_id === tmdbId) ?? null;
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const toast = useToast();

  const queryKey = ['watchlist', session?.user.id];

  return useMutation({
    mutationFn: async ({ movie, saved }: { movie: SaveInput; saved: boolean }) => {
      if (saved) {
        const { error } = await watchlist().delete().eq('tmdb_id', movie.tmdb_id);
        if (error) throw error;
        return;
      }

      const { error } = await watchlist().insert({ ...movie, status: 'want' });
      if (error) throw error;
    },

    onMutate: async ({ movie, saved }) => {
      // 1. Stop any in-flight refetch — it would land after our optimistic
      //    write and overwrite it with pre-change server data.
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot, so onError has something to restore.
      const previous = queryClient.getQueryData<WatchlistEntry[]>(queryKey) ?? [];

      // 3. Write what we expect the result to be.
      const next = saved
        ? previous.filter(entry => entry.tmdb_id !== movie.tmdb_id)
        : [
            {
              id: `optimistic-${movie.tmdb_id}`,
              user_id: session?.user.id ?? '',
              tmdb_id: movie.tmdb_id,
              title: movie.title,
              poster_path: movie.poster_path,
              status: 'want' as const,
              rating: null,
              note: null,
              created_at: new Date().toISOString(),
            },
            ...previous,
          ];

      queryClient.setQueryData(queryKey, next);

      // 4. Hand the snapshot to onError.
      return { previous };
    },

    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.show(userMessage(err));
    },

    // Runs on success AND failure — the server always gets the last word.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: WatchStatus }) => {
      const { error } = await watchlist()
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', session?.user.id] });
    },
    onError: (err) => {
      toast.show(userMessage(err));
    }
  });
}