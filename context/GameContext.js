import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

export const GameContext = createContext();

const INITIAL_STATE = {
  stardust: 0,
  totalStardust: 0,
  clickPower: 1,
  autoClickRate: 0,
  clickCount: 0,
  upgrades: {
    clickPower: { level: 0, cost: 10, multiplier: 1.5 },
    autoClicker: { level: 0, cost: 50, multiplier: 1.8 },
    stardustMultiplier: { level: 0, cost: 100, multiplier: 2 }
  },
  planets: {
    mercury: { unlocked: true, tier: 1, cost: 500, multiplier: 1.2 },
    venus: { unlocked: false, tier: 1, cost: 2000, multiplier: 1.3 },
    earth: { unlocked: false, tier: 1, cost: 5000, multiplier: 1.4 },
    mars: { unlocked: false, tier: 1, cost: 10000, multiplier: 1.5 },
    jupiter: { unlocked: false, tier: 1, cost: 50000, multiplier: 1.6 },
    saturn: { unlocked: false, tier: 1, cost: 100000, multiplier: 1.7 },
    uranus: { unlocked: false, tier: 1, cost: 500000, multiplier: 1.8 },
    neptune: { unlocked: false, tier: 1, cost: 1000000, multiplier: 1.9 },
    pluto: { unlocked: false, tier: 1, cost: 5000000, multiplier: 2.0 },
    sun: { unlocked: false, tier: 1, cost: 10000000, multiplier: 3.0 }
  },
  activePlanet: 'mercury',
  lastSaved: Date.now()
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load game state from storage
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await SecureStore.getItemAsync('gameState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setGameState(parsedState);
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      } finally {
        setLoaded(true);
      }
    };

    loadGameState();
  }, []);

  // Save game state to storage
  useEffect(() => {
    if (!loaded) return;

    const saveInterval = setInterval(async () => {
      try {
        const stateToSave = {
          ...gameState,
          lastSaved: Date.now()
        };
        await SecureStore.setItemAsync('gameState', JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Failed to save game state:', error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [gameState, loaded]);

  // Auto clicker effect
  useEffect(() => {
    if (gameState.autoClickRate <= 0) return;

    const autoClickInterval = setInterval(() => {
      addStardust(gameState.autoClickRate);
    }, 1000);

    return () => clearInterval(autoClickInterval);
  }, [gameState.autoClickRate]);

  // Calculate offline progress when loading
  useEffect(() => {
    if (!loaded) return;

    const calculateOfflineProgress = () => {
      const now = Date.now();
      const timeDiff = (now - gameState.lastSaved) / 1000; // in seconds
      
      if (timeDiff > 60 && gameState.autoClickRate > 0) {
        // Cap offline progress at 8 hours
        const cappedTimeDiff = Math.min(timeDiff, 8 * 60 * 60);
        const offlineStardust = Math.floor(gameState.autoClickRate * cappedTimeDiff);
        
        if (offlineStardust > 0) {
          setGameState(prev => ({
            ...prev,
            stardust: prev.stardust + offlineStardust,
            totalStardust: prev.totalStardust + offlineStardust,
            lastSaved: now
          }));
        }
      }
    };

    calculateOfflineProgress();
  }, [loaded]);

  // Click planet function
  const clickPlanet = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const planetMultiplier = gameState.planets[gameState.activePlanet].tier;
    const stardustGained = gameState.clickPower * planetMultiplier;
    
    setGameState(prev => ({
      ...prev,
      stardust: prev.stardust + stardustGained,
      totalStardust: prev.totalStardust + stardustGained,
      clickCount: prev.clickCount + 1
    }));
  }, [gameState.clickPower, gameState.activePlanet, gameState.planets]);

  // Add stardust (for auto clickers)
  const addStardust = useCallback((amount) => {
    const planetMultiplier = gameState.planets[gameState.activePlanet].tier;
    const stardustGained = amount * planetMultiplier;
    
    setGameState(prev => ({
      ...prev,
      stardust: prev.stardust + stardustGained,
      totalStardust: prev.totalStardust + stardustGained
    }));
  }, [gameState.activePlanet, gameState.planets]);

  // Purchase upgrade
  const purchaseUpgrade = useCallback((upgradeType) => {
    setGameState(prev => {
      const upgrade = prev.upgrades[upgradeType];
      
      if (prev.stardust < upgrade.cost) return prev;
      
      const newLevel = upgrade.level + 1;
      const newCost = Math.floor(upgrade.cost * upgrade.multiplier);
      
      let newState = {
        ...prev,
        stardust: prev.stardust - upgrade.cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeType]: {
            ...upgrade,
            level: newLevel,
            cost: newCost
          }
        }
      };
      
      // Apply upgrade effects
      if (upgradeType === 'clickPower') {
        newState.clickPower = Math.floor(prev.clickPower + newLevel);
      } else if (upgradeType === 'autoClicker') {
        newState.autoClickRate = prev.autoClickRate + 1;
      } else if (upgradeType === 'stardustMultiplier') {
        // This multiplier is applied in the clickPlanet and addStardust functions
      }
      
      return newState;
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Unlock planet
  const unlockPlanet = useCallback((planetName) => {
    setGameState(prev => {
      const planet = prev.planets[planetName];
      
      if (planet.unlocked || prev.stardust < planet.cost) return prev;
      
      return {
        ...prev,
        stardust: prev.stardust - planet.cost,
        planets: {
          ...prev.planets,
          [planetName]: {
            ...planet,
            unlocked: true
          }
        }
      };
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Upgrade planet tier
  const upgradePlanetTier = useCallback((planetName) => {
    setGameState(prev => {
      const planet = prev.planets[planetName];
      
      if (!planet.unlocked) return prev;
      
      const tierUpgradeCost = Math.floor(planet.cost * Math.pow(planet.multiplier, planet.tier));
      
      if (prev.stardust < tierUpgradeCost) return prev;
      
      return {
        ...prev,
        stardust: prev.stardust - tierUpgradeCost,
        planets: {
          ...prev.planets,
          [planetName]: {
            ...planet,
            tier: planet.tier + 1
          }
        }
      };
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Change active planet
  const setActivePlanet = useCallback((planetName) => {
    if (gameState.planets[planetName].unlocked) {
      setGameState(prev => ({
        ...prev,
        activePlanet: planetName
      }));
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [gameState.planets]);

  // Reset game
  const resetGame = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('gameState');
      setGameState(INITIAL_STATE);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
  }, []);

  // Format large numbers
  const formatNumber = useCallback((num) => {
    if (num < 1000) return num.toString();
    
    const units = ['K', 'M', 'B', 'T', 'Q'];
    const unit = Math.floor((num.toFixed(0).length - 1) / 3);
    
    if (unit >= units.length) {
      return num.toExponential(2);
    }
    
    const divisor = Math.pow(1000, unit);
    const shortened = (num / divisor).toFixed(1);
    
    return `${shortened}${units[unit - 1]}`;
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        clickPlanet,
        purchaseUpgrade,
        unlockPlanet,
        upgradePlanetTier,
        setActivePlanet,
        resetGame,
        formatNumber
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
