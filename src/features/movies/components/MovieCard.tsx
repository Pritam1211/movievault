import { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { colors } from '../../../theme/colors';
import { posterUrl } from '../../../lib/tmdb';
import type { Movie } from '../types';

type Props = {
  movie: Movie;
  onPress: (movie: Movie) => void;
};

export const MovieCard = memo(function MovieCard({ movie, onPress }: Props) {
  const uri = posterUrl(movie.poster_path, 'w342');

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(movie)}
      accessibilityRole="button"
      accessibilityLabel={movie.title}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.fallback}>
          <AppText
            variant="caption"
            numberOfLines={5}
            style={styles.fallbackText}
          >
            {movie.title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    aspectRatio: 2 / 3,
    backgroundColor: colors.raised,
    borderRadius: 5,
    flex: 1,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.7 },
  poster: { height: '100%', width: '100%' },
  fallback: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  fallbackText: { color: colors.dim, textAlign: 'center' },
});
