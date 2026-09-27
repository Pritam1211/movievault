import { userMessage } from '../error';

describe('userMessage', () => {
  it('turns a Postgres duplicate-key error into something a person can act on', () => {
    const raw = new Error(
      'duplicate key value violates unique constraint "watchlist_user_id_tmdb_id_key"',
    );
    expect(userMessage(raw)).toBe("That's already in your watchlist.");
  });

  it('maps RLS and JWT failures to a sign-in prompt', () => {
    expect(userMessage(new Error('new row violates row-level security policy'))).toBe(
      'You need to be signed in to do that.',
    );
    expect(userMessage(new Error('JWT expired'))).toBe(
      'You need to be signed in to do that.',
    );
  });

  it('recognises network failures', () => {
    expect(userMessage(new Error('Network request failed'))).toBe(
      'No connection. Check your network and try again.',
    );
  });

  it('recognises a TMDB status failure', () => {
    expect(userMessage(new Error('TMDB request failed (401)'))).toBe(
      "Couldn't reach TMDB. Try again in a moment.",
    );
  });

  it('checks network before anything else, so an offline TMDB call reads as offline', () => {
    // Both patterns match this string. Order in the function decides which wins,
    // and "you are offline" is the more useful thing to tell someone.
    expect(userMessage(new Error('TMDB 500 — fetch failed'))).toBe(
      'No connection. Check your network and try again.',
    );
  });

  it('falls back rather than leaking an unrecognised message', () => {
    expect(userMessage(new Error('PGRST301: schema cache stale'))).toBe(
      'Something went wrong. Try again.',
    );
  });

  it('survives non-Error values', () => {
    expect(userMessage('plain string')).toBe('Something went wrong. Try again.');
    expect(userMessage(null)).toBe('Something went wrong. Try again.');
    expect(userMessage(undefined)).toBe('Something went wrong. Try again.');
    expect(userMessage({ code: 42 })).toBe('Something went wrong. Try again.');
  });
});
