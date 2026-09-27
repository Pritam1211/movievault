import { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { colors } from '../../../theme/colors';
import { posterUrl } from '../../../lib/tmdb';
import { WatchlistEntry } from '../api';

type Props = {
  entry: WatchlistEntry;
  onPress: (entry: WatchlistEntry) => void;
  onToggleStatus: (entry: WatchlistEntry) => void;
};

export default memo(function WatchlistRow({
  entry,
  onPress,
  onToggleStatus,
}: Props) {
  const uri = posterUrl(entry.poster_path, 'w154');
  const year = entry.release_date ? entry.release_date.slice(0, 4) : null;
  const watched = entry.status === 'watched';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => onPress(entry)}
      accessibilityRole="button"
      accessibilityLabel={entry.title}
    >
      <View style={styles.thumb}>
        {uri && <Image source={{ uri }} style={styles.image} resizeMode="cover" />}
      </View>

      <View style={styles.text}>
        <AppText variant="strong" numberOfLines={1}>{entry.title}</AppText>
        {year && <AppText variant="label" style={styles.year}>{year}</AppText>}
      </View>

      <Pressable
        onPress={() => onToggleStatus(entry)}
        hitSlop={10}
        style={[styles.pill, watched && styles.pillWatched]}
        accessibilityRole="button"
        accessibilityLabel={watched ? 'Mark as want to watch' : 'Mark as watched'}
      >
        <AppText variant="caption" style={watched ? styles.pillWatchedText : styles.pillText}>
          {watched ? 'Watched' : 'Want'}
        </AppText>
      </Pressable>
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
  pill: {
    borderColor: colors.bulb,
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pillText: { color: colors.bulb },
  pillWatched: { borderColor: colors.line },
  pillWatchedText: { color: colors.dim },
});