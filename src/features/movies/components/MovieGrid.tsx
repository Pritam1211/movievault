import React, { useCallback } from 'react';
import { AppText } from '../../../components/AppText';
import { Movie } from '../types';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { MovieCard } from './MovieCard';

interface Props {
  movies: Movie[] | undefined;
  loading: boolean;
  error: Error | null;
  onPressMovie: (movie: Movie) => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  emptyMessage?: string;
  isRefreshing: boolean;
  onRefresh: () => void;

}

function MovieGrid({
  movies,
  loading,
  error,
  onPressMovie,
  onEndReached,
  loadingMore,
  emptyMessage,
  isRefreshing,
  onRefresh,
}: Props) {

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard movie={item} onPress={onPressMovie} />
    ),
    [onPressMovie],
  );

  const keyExtractor = useCallback((item: Movie) => String(item.id), []);

  if (loading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator color={colors.bulb} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centred}>
        <AppText variant="body" style={styles.message}>
          Couldn't reach TMDB. Check your connection and try again.
        </AppText>
      </View>
    );
  }



  return (
    <FlatList
      data={movies}
      keyExtractor={keyExtractor}
      numColumns={3}
      columnWrapperStyle={styles.row} // Spaces out rows cleanly
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <View style={styles.centred}>
          <AppText variant="body" style={styles.message}>
            {emptyMessage}
          </AppText>
        </View>
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.bulb} />
          </View>
        ) : <></>
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.bulb}
          colors={[colors.bulb]}
        />
      }
    />
  );
}

export default MovieGrid;

const styles = StyleSheet.create({
  content: { gap: 14, paddingBottom: 24 },
  row: { gap: 14 },
  centred: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  message: { color: colors.dim, textAlign: 'center' },
  footer: { paddingVertical: 20 },
});
