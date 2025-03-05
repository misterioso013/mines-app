import { create } from 'zustand';
import { soundManager } from './soundManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  balance: number;
  initialBalance: number;
  betAmount: number;
  minesCount: number;
  grid: Array<{
    id: number;
    revealed: boolean;
    isMine: boolean;
    isAnimating: boolean;
  }>;
  gameActive: boolean;
  gameWon: boolean | null;
  revealedCount: number;
  potentialWin: number;
  isResetting: boolean;
  wins: number;
  losses: number;
  bestCampaign: number;
  
  // Ações
  setBalance: (amount: number) => void;
  setInitialBalance: (amount: number) => void;
  setBetAmount: (amount: number) => void;
  setMinesCount: (count: number) => void;
  startGame: () => void;
  revealTile: (id: number) => void;
  cashOut: () => void;
  resetGame: () => void;
  resetStats: () => void;
  incrementWins: () => void;
  incrementLosses: () => void;
  updateBestCampaign: (campaign: number) => void;
  initializeSounds: () => Promise<void>;
  calculateMultiplier: (revealedCount: number) => number;
  saveStats: () => Promise<void>;
  loadStats: () => Promise<void>;
  showAd?: () => void;
}

const GRID_SIZE = 25;

const useGameStore = create<GameState>((set, get) => ({
  balance: 0,
  initialBalance: 0,
  betAmount: 1,
  minesCount: 5,
  grid: [],
  gameActive: false,
  gameWon: null,
  revealedCount: 0,
  potentialWin: 0,
  isResetting: false,
  wins: 0,
  losses: 0,
  bestCampaign: 0,
  
  initializeSounds: async () => {
    await soundManager.loadSounds();
  },

  setBalance: (amount) => {
    set({ balance: parseFloat(amount.toFixed(2)), isResetting: false });
    get().saveStats();
  },

  setInitialBalance: (amount) => {
    const parsedAmount = parseFloat(amount.toFixed(2));
    set({ 
      initialBalance: parsedAmount, 
      balance: parsedAmount 
    });
    get().saveStats();
  },

  setBetAmount: (amount) => {
    if (!get().gameActive) {
      set({ betAmount: parseFloat(amount.toFixed(2)) });
    }
  },
  
  setMinesCount: (count) => {
    if (!get().gameActive && count >= 2 && count <= 24) {
      set({ minesCount: count });
    }
  },

  startGame: () => {
    const { betAmount, balance, minesCount } = get();
    
    if (betAmount <= balance && !get().gameActive) {
      const newGrid = Array(GRID_SIZE).fill(null).map((_, id) => ({
        id,
        revealed: false,
        isMine: false,
        isAnimating: false,
      }));
      
      let minesPlaced = 0;
      while (minesPlaced < minesCount) {
        const randomIndex = Math.floor(Math.random() * GRID_SIZE);
        if (!newGrid[randomIndex].isMine) {
          newGrid[randomIndex].isMine = true;
          minesPlaced++;
        }
      }
      
      set({
        grid: newGrid,
        gameActive: true,
        balance: parseFloat((balance - betAmount).toFixed(2)),
        revealedCount: 0,
        gameWon: null,
        potentialWin: parseFloat((betAmount * get().calculateMultiplier(1)).toFixed(2)),
        isResetting: false,
      });

      soundManager.playSound('swoosh');
      get().saveStats();
    }
  },
  
  revealTile: (id) => {
    const { grid, gameActive, minesCount, betAmount, revealedCount } = get();
    
    if (!gameActive) return;
    
    const newGrid = [...grid];
    const tile = newGrid[id];
    
    if (tile.revealed) return;
    
    tile.revealed = true;
    tile.isAnimating = true;
    
    if (tile.isMine) {
      set({
        grid: newGrid,
        gameActive: false,
        gameWon: false,
        potentialWin: 0,
        isResetting: false,
      });
      get().incrementLosses();
      soundManager.playSound('bomb');
      get().showAd?.();
    } else {
      const newRevealedCount = revealedCount + 1;
      const safeTiles = GRID_SIZE - minesCount;
      
      const newMultiplier = get().calculateMultiplier(newRevealedCount);
      const newPotentialWin = parseFloat((betAmount * newMultiplier).toFixed(2));
      
      set({
        grid: newGrid,
        revealedCount: newRevealedCount,
        potentialWin: newPotentialWin,
        isResetting: false,
      });
      
      soundManager.playSound('up');

      if (newRevealedCount === safeTiles) {
        set({
          gameActive: false,
          gameWon: true,
          balance: parseFloat((get().balance + newPotentialWin).toFixed(2)),
          isResetting: false,
        });
        get().incrementWins();
        get().updateBestCampaign(newPotentialWin);
        get().showAd?.();
      }
    }
    
    setTimeout(() => {
      set((state) => ({
        grid: state.grid.map(t => t.id === id ? { ...t, isAnimating: false } : t)
      }));
    }, 300);

    get().saveStats();
  },
  
  cashOut: () => {
    const { gameActive, potentialWin, revealedCount } = get();
    
    if (gameActive && potentialWin > 0 && revealedCount > 0) {
      set({
        gameActive: false,
        gameWon: true,
        balance: parseFloat((get().balance + potentialWin).toFixed(2)),
        potentialWin: 0,
        isResetting: false,
      });
      get().incrementWins();
      get().updateBestCampaign(potentialWin);
      soundManager.playSound('swoosh');
      get().saveStats();
      get().showAd?.();
    }
  },
  
  resetGame: () => {
    const { initialBalance } = get();
    set({
      balance: initialBalance,
      initialBalance: initialBalance,
      betAmount: 1,
      minesCount: 5,
      grid: [],
      gameActive: false,
      gameWon: null,
      revealedCount: 0,
      potentialWin: 0,
      isResetting: true,
      wins: 0,
      losses: 0,
      bestCampaign: 0,
    });
    get().saveStats();
  },

  resetStats: () => {
    const { initialBalance } = get();
    set({
      balance: initialBalance,
      initialBalance: initialBalance,
      wins: 0,
      losses: 0,
      bestCampaign: 0,
      betAmount: 1,
      minesCount: 5,
      grid: [],
      gameActive: false,
      gameWon: null,
      revealedCount: 0,
      potentialWin: 0,
      isResetting: false,
    });
    get().saveStats();
  },

  incrementWins: () => {
    set((state) => ({ wins: state.wins + 1 }));
    get().saveStats();
  },

  incrementLosses: () => {
    set((state) => ({ losses: state.losses + 1 }));
    get().saveStats();
  },

  updateBestCampaign: (campaign) => {
    set((state) => ({
      bestCampaign: parseFloat(Math.max(state.bestCampaign, campaign).toFixed(2))
    }));
    get().saveStats();
  },

  calculateMultiplier: (revealedCount) => {
    const { minesCount } = get();
    const safeTiles = GRID_SIZE - minesCount;
    const baseMultiplier = GRID_SIZE / safeTiles;
    return Math.pow(baseMultiplier, revealedCount);
  },

  saveStats: async () => {
    const { balance, initialBalance, wins, losses, bestCampaign } = get();
    const stats = { 
      balance, 
      initialBalance: initialBalance || balance,
      wins, 
      losses, 
      bestCampaign 
    };
    try {
      await AsyncStorage.setItem('gameStats', JSON.stringify(stats));
      console.log('Estatísticas salvas:', stats);
    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error);
    }
  },

  loadStats: async () => {
    try {
      const statsString = await AsyncStorage.getItem('gameStats');
      if (statsString) {
        const stats = JSON.parse(statsString);
        console.log('Estatísticas carregadas:', stats);
        set({
          balance: stats.balance || 0,
          initialBalance: stats.initialBalance || stats.balance,
          wins: stats.wins || 0,
          losses: stats.losses || 0,
          bestCampaign: stats.bestCampaign || 0,
        });
      } else {
        console.log('Nenhuma estatística encontrada no AsyncStorage');
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  },
}));

export { useGameStore };