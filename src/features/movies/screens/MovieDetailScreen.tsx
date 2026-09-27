import React from 'react';
import { AppText } from '../../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../navigation/types';
import { useMovieDetail } from '../api';
import { backdropUrl } from '../../../lib/tmdb';
import { useNavigation } from '@react-navigation/native';
import { useToggleWatchlist, useWatchlistEntry } from '../../watchlist/api';

type Props = NativeStackScreenProps<AppStackParamList, 'MovieDetails'>;

function MovieDetailScreen({ route }: Props) {
  const navigation = useNavigation();
  const { title, id } = route.params;

  const { data, isLoading, error } = useMovieDetail(id);
  const entry = useWatchlistEntry(id);
  const toggle = useToggleWatchlist();
  const saved = Boolean(entry);

  const back = (
    <Pressable
      onPress={navigation.goBack}
      hitSlop={12}
      style={styles.back}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <AppText variant="strong" style={styles.backText}>
        ←
      </AppText>
    </Pressable>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.bulb} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <AppText variant="title">Error: {error.message}</AppText>
      </SafeAreaView>
    );
  }
  const movie = data;

  const year = movie?.release_date ? movie.release_date.slice(0, 4) : null;

  if (!movie) {
    return (
      <SafeAreaView style={styles.centered}>
        <AppText variant="title">No movie found</AppText>
      </SafeAreaView>
    );
  }

  const backdrop = backdropUrl(movie.backdrop_path, 'w780');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {back}
        <View style={styles.backdropCard}>
          {backdrop && (
            <Image source={{ uri: backdrop }} style={styles.backdrop} />
          )}
        </View>
        <AppText variant="title">{title}</AppText>
        {movie.tagline ? (
          <AppText variant="label" style={styles.tagline}>
            {movie.tagline}
          </AppText>
        ) : null}

        <View style={styles.pillRow}>
          {year && (
            <AppText variant="label" style={styles.pill}>
              {year}
            </AppText>
          )}
          {movie.genres.map(genre => (
            <AppText key={genre.id} variant="label" style={styles.pill}>
              {genre.name}
            </AppText>
          ))}
          {movie.runtime && (
            <AppText variant="label" style={styles.pill}>
              {movie.runtime} min
            </AppText>
          )}
          {movie.vote_average > 0 && (
            <AppText variant="label" style={styles.pill}>
              {movie.vote_average.toFixed(1)}
            </AppText>
          )}
        </View>
        <AppText variant="body" style={styles.overview}>
          {movie.overview || 'No overview available.'}
        </AppText>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            saved && styles.buttonSaved,
            pressed && styles.buttonPressed,
            toggle.isPending && styles.buttonBusy,
          ]}
          disabled={toggle.isPending}
          onPress={() =>
            toggle.mutate({
              movie: {
                tmdb_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
              },
              saved,
            })
          }
        >
          <AppText
            variant="strong"
            style={saved ? styles.buttonSavedText : styles.buttonText}
          >
            {saved ? 'In Watchlist' : 'Add to Watchlist'}
          </AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MovieDetailScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: colors.ink, flex: 1 },
  content: { paddingBottom: 40, paddingHorizontal: 28, paddingTop: 8 },
  centered: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  message: { color: colors.dim, textAlign: 'center' },
  back: { alignSelf: 'flex-start', marginBottom: 12, paddingVertical: 4 },
  backText: { color: colors.chalk, fontSize: 24 },
  backdropCard: {
    aspectRatio: 16 / 10,
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  backdrop: { height: '100%', width: '100%' },
  tagline: { color: colors.dim, marginTop: 6 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  pill: {
    borderColor: colors.line,
    borderRadius: 99,
    borderWidth: 1,
    color: colors.dim,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  overview: { color: colors.dim, marginTop: 16 },
  button: {
    alignItems: 'center',
    backgroundColor: colors.bulb,
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 28,
    paddingVertical: 16,
  },
  buttonSaved: {
    backgroundColor: 'transparent',
    borderColor: colors.line,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonBusy: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.ink,
  },
  buttonSavedText: {
    color: colors.chalk,
  },
});
