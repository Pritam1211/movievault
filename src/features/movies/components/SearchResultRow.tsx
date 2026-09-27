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

export const SearchResultRow = memo(function SearchResultRow({ movie, onPress }: Props) {
  const uri = posterUrl(movie.poster_path, 'w154');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => onPress(movie)}
      accessibilityRole="button"
      accessibilityLabel={movie.title}
    >
      <View style={styles.thumb}>
        {uri && <Image source={{ uri }} style={styles.image} resizeMode="cover" />}
      </View>

      <View style={styles.text}>
        <AppText variant="strong" numberOfLines={1}>{movie.title}</AppText>
        {year && (
          <AppText variant="label" style={styles.year}>{year}</AppText>
        )}
      </View>

      {movie.vote_average > 0 && (
        <AppText variant="label" style={styles.rating}>
          {movie.vote_average.toFixed(1)}
        </AppText>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomColor: colors.line,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  pressed: { opacity: 0.6 },
  thumb: {
    backgroundColor: colors.raised,
    borderRadius: 4,
    height: 66,
    overflow: 'hidden',
    width: 44,
  },
  image: { height: '100%', width: '100%' },
  text: { flex: 1 },
  year: { marginTop: 2 },
  rating: {
    borderColor: colors.line,
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});