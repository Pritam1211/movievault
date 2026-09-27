import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../../components/AppText';
import { colors } from '../../../theme/colors';
import {
  useUpdateStatus,
  useWatchlist,
  type WatchStatus,
  type WatchlistEntry,
} from '../api';
import WatchListRow from '../components/WatchListRow';

const TAB_LABELS: Record<WatchStatus, string> = {
  want: 'Want to watch',
  watched: 'Watched',
};

const TABS = Object.keys(TAB_LABELS) as WatchStatus[];

export default function WatchlistScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<WatchStatus>('want');

  const { data, isLoading, error, refetch, isRefetching } = useWatchlist();
  const updateStatus = useUpdateStatus();

  const entries = useMemo(
    () => (data ?? []).filter(entry => entry.status === tab),
    [data, tab],
  );

  const openMovie = useCallback(
    (entry: WatchlistEntry) => {
      navigation.navigate('MovieDetails', {
        id: entry.tmdb_id,
        title: entry.title,
      });
    },
    [navigation],
  );

  const toggleStatus = useCallback(
    (entry: WatchlistEntry) => {
      updateStatus.mutate({
        id: entry.id,
        status: entry.status === 'want' ? 'watched' : 'want',
      });
    },
    [updateStatus],
  );

  const renderItem = useCallback(
    ({ item }: { item: WatchlistEntry }) => (
      <WatchListRow
        entry={item}
        onPress={openMovie}
        onToggleStatus={toggleStatus}
      />
    ),
    [openMovie, toggleStatus],
  );

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
            Couldn't load your watchlist. Check your connection and try again.
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.state}>
        <AppText variant="body" style={styles.stateText}>
          {tab === 'want'
            ? 'Nothing saved yet. Find something in Discover.'
            : "Nothing marked watched yet. Tap a film's badge once you've seen it."}
        </AppText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="title">Watchlist</AppText>
        <Pressable
          onPress={() => navigation.navigate('Account')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Account"
        >
          <AppText variant="label" style={styles.accountLink}>
            Account
          </AppText>
        </Pressable>
      </View>

      <View style={styles.tabList}>
        {TABS.map(key => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppText
              variant="body"
              style={[styles.tab, tab === key && styles.activeTab]}
            >
              {TAB_LABELS[key]}
            </AppText>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          entries.length === 0 ? styles.emptyContent : styles.content
        }
        ListEmptyComponent={empty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.bulb}
            colors={[colors.bulb]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountLink: { color: colors.dim },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  tabList: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    marginBottom: 6,
  },
  tab: {
    color: colors.dim,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomColor: colors.bulb,
    borderBottomWidth: 3,
    color: colors.chalk,
    fontWeight: '600',
  },
  content: { paddingBottom: 24 },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
  state: { alignItems: 'center', paddingHorizontal: 24 },
  stateText: { color: colors.dim, textAlign: 'center' },
});
