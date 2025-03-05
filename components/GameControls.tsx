import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGameStore } from '@/hooks/gameStore';
import { Ionicons } from '@expo/vector-icons';

const GameControls: React.FC = () => {
  const { 
    balance, 
    betAmount, 
    setBetAmount, 
    minesCount,
    setMinesCount,
    startGame, 
    gameActive, 
    cashOut, 
    potentialWin,
  } = useGameStore();

  const [localBetAmount, setLocalBetAmount] = useState(betAmount.toFixed(2));

  useEffect(() => {
    setLocalBetAmount(betAmount.toFixed(2));
  }, [betAmount]);

  const handleStartGame = () => {
    const amount = parseFloat(localBetAmount);
    if (!isNaN(amount) && amount > 0 && amount <= balance) {
      setBetAmount(amount);
      startGame();
    }
  };

  const handleCashOut = () => {
    cashOut();
  };

  const handleBetAmountChange = (text: string) => {
    const filteredText = text.replace(/[^0-9.]/g, '');
    const parts = filteredText.split('.');
    if (parts.length > 2) {
      parts.pop();
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
    const formattedText = parts.join('.');
    setLocalBetAmount(formattedText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Aposta:</Text>
        <TextInput
          style={styles.input}
          value={localBetAmount}
          onChangeText={handleBetAmountChange}
          keyboardType="decimal-pad"
          editable={!gameActive}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de Minas:</Text>
        <Picker
          selectedValue={minesCount}
          style={styles.picker}
          onValueChange={(itemValue: number) => setMinesCount(itemValue)}
          enabled={!gameActive}
        >
          {[...Array(23)].map((_, i) => (
            <Picker.Item key={i} label={`${i + 2}`} value={i + 2} />
          ))}
        </Picker>
      </View>
      {!gameActive ? (
        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <Ionicons name="play" size={24} color="white" />
          <Text style={styles.buttonText}>Iniciar Jogo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCashOut}>
          <Ionicons name="cash" size={24} color="white" />
          <Text style={styles.buttonText}>Cash Out (R$ {potentialWin.toFixed(2)})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    color: 'black',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default GameControls;