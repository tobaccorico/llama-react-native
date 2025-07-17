
import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {defillamaAPI, Chain} from '../services/defillamaApi';

interface ChainCardProps {
  chain: Chain;
  onPress: () => void;
}

const ChainCard: React.FC<ChainCardProps> = ({chain, onPress}) => (
  <TouchableOpacity style={styles.chainCard} onPress={onPress}>
    <View style={styles.chainInfo}>
      <Text style={styles.chainName}>{chain.name}</Text>
      <Text style={styles.chainProtocols}>
        {chain.protocols || 0} protocols
      </Text>
    </View>
    <View style={styles.chainStats}>
      <Text style={styles.tvl}>${((chain.tvl || 0) / 1e9).toFixed(2)}B</Text>
      <View style={styles.changeContainer}>
        <Icon
          name={
            chain.tvlPrevDay && chain.tvl > chain.tvlPrevDay
              ? 'trending-up'
              : 'trending-down'
          }
          size={16}
          color={
            chain.tvlPrevDay && chain.tvl > chain.tvlPrevDay
              ? '#00D395'
              : '#FF3838'
          }
        />
        <Text
          style={[
            styles.change,
            chain.tvlPrevDay && chain.tvl > chain.tvlPrevDay
              ? styles.positive
              : styles.negative,
          ]}>
          {chain.tvlPrevDay
            ? (
                (Math.abs(chain.tvl - chain.tvlPrevDay) / chain.tvlPrevDay) *
                100
              ).toFixed(2)
            : '0.00'}
          %
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export function ChainsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'tvl' | 'name' | 'protocols'>('tvl');

  const {data: chains, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ['chains'],
    queryFn: defillamaAPI.getChains,
  });

  // Filter and sort chains
  const processedChains = useMemo(() => {
    if (!chains) return [];

    let filtered = chains.filter(chain =>
      chain.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort chains
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'tvl':
          return (b.tvl || 0) - (a.tvl || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'protocols':
          return (b.protocols || 0) - (a.protocols || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [chains, searchQuery, sortBy]);

  const handleChainPress = (chain: Chain) => {
    // Navigate to chain detail screen (to be implemented)
    console.log('Selected chain:', chain.name);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2172E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chains..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'tvl' && styles.sortButtonActive]}
          onPress={() => setSortBy('tvl')}>
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'tvl' && styles.sortButtonTextActive,
            ]}>
            TVL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
          onPress={() => setSortBy('name')}>
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'name' && styles.sortButtonTextActive,
            ]}>
            Name
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'protocols' && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy('protocols')}>
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'protocols' && styles.sortButtonTextActive,
            ]}>
            Protocols
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={processedChains}
        keyExtractor={item => item.gecko_id || item.name}
        renderItem={({item}) => (
          <ChainCard chain={item} onPress={() => handleChainPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        // Maintain scroll position
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFF',
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortLabel: {
    color: '#888',
    marginRight: 12,
    fontSize: 14,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#1B1B1B',
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  sortButtonActive: {
    backgroundColor: '#2172E5',
    borderColor: '#2172E5',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#888',
  },
  sortButtonTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chainCard: {
    backgroundColor: '#1B1B1B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  chainInfo: {
    flex: 1,
  },
  chainName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  chainProtocols: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  chainStats: {
    alignItems: 'flex-end',
  },
  tvl: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  change: {
    fontSize: 14,
    marginLeft: 4,
  },
  positive: {
    color: '#00D395',
  },
  negative: {
    color: '#FF3838',
  },
});
