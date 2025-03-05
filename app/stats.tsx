import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '@/hooks/gameStore';

export default function Stats() {
  const { loadStats } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    bestCampaign: 0,
    balance: 0,
    initialBalance: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      await loadStats();
      const currentStats = useGameStore.getState();
      setStats({
        wins: currentStats.wins,
        losses: currentStats.losses,
        bestCampaign: currentStats.bestCampaign,
        balance: currentStats.balance,
        initialBalance: currentStats.initialBalance,
      });
      setIsLoading(false);
      console.log('Estatísticas carregadas em Stats:', currentStats);
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando estatísticas...</Text>
      </View>
    );
  }

  const { wins, losses, bestCampaign, balance, initialBalance } = stats;
  const totalGames = (wins || 0) + (losses || 0);
  const winRate = totalGames > 0 ? ((wins || 0) / totalGames * 100).toFixed(2) : '0.00';
  const profit = balance - initialBalance;
  const profitStatus = profit >= 0 ? 'Lucro' : 'Prejuízo';

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estatísticas do Jogo</Text>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Total de Jogos:</Text>
        <Text style={styles.statValue}>{totalGames}</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Vitórias:</Text>
        <Text style={styles.statValue}>{wins || 0}</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Derrotas:</Text>
        <Text style={styles.statValue}>{losses || 0}</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Taxa de Vitória:</Text>
        <Text style={styles.statValue}>{winRate}%</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Melhor Campanha:</Text>
        <Text style={styles.statValue}>{formatCurrency(bestCampaign)}</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Banca Inicial:</Text>
        <Text style={styles.statValue}>{formatCurrency(initialBalance)}</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Saldo Atual:</Text>
        <Text style={styles.statValue}>{formatCurrency(balance)}</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Status:</Text>
        <Text style={[styles.statValue, profit >= 0 ? styles.profitText : styles.lossText]}>
          {profitStatus} ({formatCurrency(Math.abs(profit))})
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#cccccc',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profitText: {
    color: '#2ecc71',
  },
  lossText: {
    color: '#e74c3c',
  },
}); 