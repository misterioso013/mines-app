import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useGameStore } from '@/hooks/gameStore';
import MinesGrid from '@/components/MinesGrid';
import GameControls from '@/components/GameControls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAds } from '@/hooks/useAds';

const { width } = Dimensions.get('window');

export default function GameScreen() {
  const { balance, resetGame, gameWon, initializeSounds } = useGameStore();
  const { showInterstitialIfReady } = useAds();

  useEffect(() => {
    const initialize = async () => {
      await initializeSounds();
      useGameStore.setState({ showAd: showInterstitialIfReady });
      console.log('Anúncios inicializados no GameScreen');
    };
    
    initialize();
  }, []);

  const handleResetGame = async () => {
    Alert.alert(
      "Reiniciar Jogo",
      "Tem certeza que deseja reiniciar o jogo? Isso irá zerar seu saldo e estatísticas.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim, reiniciar",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@mines:initial_balance');
              resetGame();
              showInterstitialIfReady();
              router.replace('/');
            } catch (error) {
              console.error('Erro ao reiniciar o jogo:', error);
              Alert.alert('Erro', 'Não foi possível reiniciar o jogo. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Mines</Text>
            <View style={styles.balanceContainer}>
              <Ionicons name="wallet-outline" size={24} color="white" />
              <Text style={styles.balanceText}>{formatCurrency(balance)}</Text>
            </View>
          </View>
          <View style={styles.gameArea}>
            <MinesGrid />
            <GameControls />
          </View>
          {gameWon !== null && (
            <View style={[styles.resultContainer, gameWon ? styles.winContainer : styles.loseContainer]}>
              <Text style={styles.resultText}>
                {gameWon ? 'Você Ganhou!' : 'Você Perdeu!'}
              </Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/stats')}>
              <Ionicons name="stats-chart" size={24} color="white" />
              <Text style={styles.buttonText}>Estatísticas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleResetGame}>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.buttonText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  gameArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  resultContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  winContainer: {
    backgroundColor: 'rgba(46, 204, 64, 0.2)',
  },
  loseContainer: {
    backgroundColor: 'rgba(255, 65, 54, 0.2)',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: width * 0.4,
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 