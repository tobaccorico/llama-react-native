import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {defillamaAPI} from '../services/defillamaApi';

export function OverviewScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const {data: chainsData, isLoading, refetch} = useQuery({
    queryKey: ['chains'],
    queryFn: defillamaAPI.getChains,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2172E5" />
      </View>
    );
  }

  // Calculate total TVL
  const totalTVL =
    chainsData?.reduce((sum, chain) => sum + (chain.tvl || 0), 0) || 0;

  // Get top chains by TVL
  const topChains = chainsData?.slice(0, 5) || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Value Locked</Text>
        <Text style={styles.tvlValue}>${(totalTVL / 1e9).toFixed(2)}B</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Chains by TVL</Text>
        {topChains.map((chain, index) => (
          <View key={chain.gecko_id} style={styles.chainItem}>
            <Text style={styles.chainRank}>{index + 1}</Text>
            <Text style={styles.chainName}>{chain.name}</Text>
            <Text style={styles.chainTVL}>
              ${((chain.tvl || 0) / 1e9).toFixed(2)}B
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  card: {
    backgroundColor: '#1B1B1B',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  tvlValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2172E5',
  },
  chainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2B2B2B',
  },
  chainRank: {
    fontSize: 18,
    color: '#666',
    width: 30,
  },
  chainName: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  chainTVL: {
    fontSize: 16,
    color: '#2172E5',
    fontWeight: '600',
  },
});
