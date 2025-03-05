import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { useGameStore } from '@/hooks/gameStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const GRID_PADDING = 10;
const GRID_WIDTH = width - 40; // Reduzindo a largura total do grid
const TILE_SIZE = (GRID_WIDTH - GRID_PADDING * 2) / GRID_SIZE;
const TILE_MARGIN = 2;

const MinesGrid: React.FC = () => {
  const { grid, gameActive, revealTile, gameWon, minesCount, revealedCount, calculateMultiplier } = useGameStore();

  const renderTile = (tile: any) => {
    const tileStyle = [
      styles.tile,
      tile.revealed && styles.revealedTile,
      tile.isAnimating && styles.animatingTile,
    ];

    const showAllMines = !gameActive && gameWon !== null;

    const iconName = showAllMines && tile.isMine
      ? 'skull'
      : tile.revealed
        ? tile.isMine
          ? 'skull'
          : 'diamond'
        : 'help-circle-outline';

    const iconColor = showAllMines && tile.isMine
      ? '#000000'
      : tile.revealed
        ? tile.isMine
          ? '#000000'
          : '#2ecc40'
        : '#7fdbff';

    return (
      <TouchableOpacity
        key={tile.id}
        style={tileStyle}
        onPress={() => gameActive && revealTile(tile.id)}
        disabled={!gameActive || tile.revealed}
      >
        <Animated.View>
          <Ionicons name={iconName} size={TILE_SIZE * 0.6} color={iconColor} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const safeTiles = GRID_SIZE * GRID_SIZE - minesCount;
  const currentMultiplier = calculateMultiplier(revealedCount);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Minas: {minesCount}</Text>
        <Text style={styles.infoText}>Revelados: {revealedCount}/{safeTiles}</Text>
        <Text style={styles.infoText}>Multiplicador: {currentMultiplier.toFixed(2)}x</Text>
      </View>
      <View style={styles.grid}>{grid.map(renderTile)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: GRID_WIDTH,
    height: GRID_WIDTH,
    padding: GRID_PADDING,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  tile: {
    width: TILE_SIZE - TILE_MARGIN * 2,
    height: TILE_SIZE - TILE_MARGIN * 2,
    margin: TILE_MARGIN,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealedTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  animatingTile: {
    transform: [{ scale: 1.1 }],
  },
});

export default MinesGrid;