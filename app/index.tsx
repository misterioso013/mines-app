import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '../hooks/gameStore';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const BALANCE_KEY = '@mines:initial_balance';

export default function App() {
  const [inputBalance, setInputBalance] = useState('');
  const { setBalance, resetGame } = useGameStore();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialBalance();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadInitialBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
      if (storedBalance) {
        const balance = parseFloat(storedBalance);
        if (!isNaN(balance) && balance > 0) {
          resetGame();
          setBalance(balance);
          router.replace('/game');
        } else {
          await AsyncStorage.removeItem(BALANCE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading initial balance:', error);
      await AsyncStorage.removeItem(BALANCE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const balanceValue = parseFloat(inputBalance);
    
    if (isNaN(balanceValue) || balanceValue <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido maior que zero.');
      return;
    }

    try {
      await AsyncStorage.setItem(BALANCE_KEY, balanceValue.toString());
      resetGame();
      setBalance(balanceValue);
      router.replace('/game');
    } catch (error) {
      console.error('Error saving initial balance:', error);
      Alert.alert('Erro', 'Não foi possível salvar o valor inicial. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#1a1a2e' }]}>
        <Text style={[styles.title, { color: '#fff' }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo ao Mines</Text>
          
          <Text style={styles.subtitle}>
            Defina seu saldo inicial para começar a jogar
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Saldo Inicial (R$)</Text>
            <TextInput
              style={styles.input}
              value={inputBalance}
              onChangeText={setInputBalance}
              placeholder="1000"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Começar a Jogar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            Este é um jogo de demonstração.
            Nenhum dinheiro real está envolvido.
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#FFFFFF',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disclaimerContainer: {
    marginTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  disclaimer: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});