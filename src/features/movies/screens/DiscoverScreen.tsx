import React, { useCallback } from 'react';
import { AppText } from '../../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LIST_LABELS, ListType, useMoviesList } from '../api';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { Movie } from '../types';
import MovieGrid from '../components/MovieGrid';
import { useNavigation } from '@react-navigation/native';

const TYPES = Object.keys(LIST_LABELS) as ListType[];

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const [type, setType] = React.useState<ListType>('popular');
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useMoviesList(type);
  const movies = data?.pages.flatMap(page => page.results) ?? [];

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const openMovie = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetails', { id: movie.id, title: movie.title });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppText variant="title">Discover</AppText>
      <View style={styles.tabList}>
        {TYPES.map(k => (
          <Pressable
            key={k}
            onPress={() => setType(k)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppText
              variant="body"
              style={[styles.tab, type === k && styles.activetab]}
            >
              {LIST_LABELS[k]}
            </AppText>
          </Pressable>
        ))}
      </View>
      <MovieGrid
        movies={movies}
        loading={isLoading}
        error={error}
        onPressMovie={openMovie}
        onEndReached={loadMore}
        loadingMore={isFetchingNextPage}
        emptyMessage="No films in this list."
        isRefreshing={isRefetching}
        onRefresh={() => {
          refetch();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  tabList: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 14,
  },
  tab: {
    color: colors.dim,
    marginVertical: 8,
    paddingBottom: 8,
    fontWeight: '400',
  },
  activetab: {
    color: colors.chalk,
    fontWeight: '600',
    borderBottomWidth: 3,
    borderColor: colors.bulb,
  },
});
