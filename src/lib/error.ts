export function userMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);

  if (/network|fetch|timeout|failed to fetch/i.test(raw)) {
    return 'No connection. Check your network and try again.';
  }
  if (/duplicate key/i.test(raw)) {
    return "That's already in your watchlist.";
  }
  if (/row-level security|permission denied|JWT/i.test(raw)) {
    return 'You need to be signed in to do that.';
  }
  if (/TMDB/i.test(raw)) {
    return "Couldn't reach TMDB. Try again in a moment.";
  }

  return 'Something went wrong. Try again.';
}