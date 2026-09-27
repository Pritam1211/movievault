import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../../components/AppText';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { useSearchMovies } from '../api';
import { SearchResultRow } from '../components/SearchResultRow';
import type { Movie } from '../types';
import { useDebounce } from '../../../hooks/useDebounce';

function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const searching = debouncedQuery.trim().length > 0;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchMovies(debouncedQuery);

  const movies = data?.pages.flatMap(page => page.results) ?? [];

  const openMovie = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetails', { id: movie.id, title: movie.title });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <SearchResultRow movie={item} onPress={openMovie} />
    ),
    [openMovie],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const empty = () => {
    if (isLoading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator color={colors.bulb} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.state}>
          <AppText variant="body" style={styles.stateText}>
            Couldn't reach TMDB. Check your connection and try again.
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.state}>
        <AppText variant="body" style={styles.stateText}>
          {searching
            ? `No films match “${debouncedQuery.trim()}”.`
            : 'Search by title.'}
        </AppText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppText variant="title">Search</AppText>

      <View style={styles.searchField}>
        <TextInput
          style={[typography.body, styles.input]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by title"
          placeholderTextColor={colors.dim}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />

        {query.length > 0 && (
          <Pressable
            style={styles.clear}
            onPress={() => setQuery('')}
            hitSlop={8}
          >
            <AppText variant="label" style={styles.clearText}>
              Clear
            </AppText>
          </Pressable>
        )}
      </View>

      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          movies.length === 0 ? styles.emptyContent : undefined
        }
        ListEmptyComponent={empty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.bulb} />
            </View>
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  searchField: {
    justifyContent: 'center',
    marginVertical: 14,
  },
  input: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.chalk,
    paddingHorizontal: 16,
    paddingRight: 68,
    paddingVertical: 12,
  },
  clear: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    top: 0,
  },
  clearText: { color: colors.dim },
  state: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  stateText: { color: colors.dim, textAlign: 'center' },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
  footer: { paddingVertical: 20 },
});
