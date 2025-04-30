import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GameContext } from '../context/GameContext';

const StatsScreen = () => {
  const {
    totalStardust,
    clickCount,
    clickPower,
    autoClickRate,
    upgrades,
    planets,
    activePlanet,
    formatNumber,
    resetGame
  } = useContext(GameContext);

  const confirmReset = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset all progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetGame }
      ]
    );
  };

  const calculateTotalUpgrades = () => {
    return Object.values(upgrades).reduce((total, upgrade) => total + upgrade.level, 0);
  };

  const calculateUnlockedPlanets = () => {
    return Object.values(planets).filter(planet => planet.unlocked).length;
  };

  const calculateTotalTiers = () => {
    return Object.values(planets).reduce((total, planet) => total + (planet.tier - 1), 0);
  };

  const renderStatItem = (label, value) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Statistics</Text>
        
        <View style={styles.statsContainer}>
          {renderStatItem('Total Stardust Collected', formatNumber(totalStardust))}
          {renderStatItem('Total Clicks', formatNumber(clickCount))}
          {renderStatItem('Click Power', formatNumber(clickPower))}
          {renderStatItem('Auto Click Rate', `${formatNumber(autoClickRate)}/sec`)}
          {renderStatItem('Active Planet', `${activePlanet.charAt(0).toUpperCase() + activePlanet.slice(1)} (Tier ${planets[activePlanet].tier})`)}
          {renderStatItem('Total Upgrades Purchased', calculateTotalUpgrades())}
          {renderStatItem('Planets Unlocked', `${calculateUnlockedPlanets()} / 10`)}
          {renderStatItem('Total Tier Upgrades', calculateTotalTiers())}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upgrades</Text>
        
        <View style={styles.statsContainer}>
          {renderStatItem('Click Power Level', upgrades.clickPower.level)}
          {renderStatItem('Auto Clicker Level', upgrades.autoClicker.level)}
          {renderStatItem('Stardust Multiplier Level', upgrades.stardustMultiplier.level)}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planets</Text>
        
        <View style={styles.statsContainer}>
          {Object.entries(planets).map(([name, planet]) => (
            <View key={name} style={styles.planetStat}>
              <Text style={styles.planetStatName}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Text>
              <Text style={[
                styles.planetStatStatus,
                planet.unlocked ? styles.unlockedText : styles.lockedText
              ]}>
                {planet.unlocked ? `Tier ${planet.tier}` : 'Locked'}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.resetContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={confirmReset}
        >
          <Text style={styles.resetText}>Reset Game</Text>
        </TouchableOpacity>
        <Text style={styles.resetWarning}>
          Warning: This will reset all progress and cannot be undone.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#ccc',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  planetStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  planetStatName: {
    fontSize: 14,
    color: '#ccc',
  },
  planetStatStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unlockedText: {
    color: '#6200ee',
  },
  lockedText: {
    color: '#777',
  },
  resetContainer: {
    padding: 15,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetWarning: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default StatsScreen;
