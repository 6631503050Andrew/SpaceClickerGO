import React, { useContext, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { GameContext } from '../context/GameContext';

const { width, height } = Dimensions.get('window');

const ClickerScreen = () => {
  const {
    stardust,
    clickPower,
    autoClickRate,
    activePlanet,
    planets,
    clickPlanet,
    formatNumber
  } = useContext(GameContext);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Continuous rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true
      })
    ).start();
  }, [rotateAnim]);

  const handlePress = () => {
    clickPlanet();
    
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const planetImages = {
    mercury: require('../assets/planets/mercury.png'),
    venus: require('../assets/planets/venus.png'),
    earth: require('../assets/planets/earth.png'),
    mars: require('../assets/planets/mars.png'),
    jupiter: require('../assets/planets/jupiter.png'),
    saturn: require('../assets/planets/saturn.png'),
    uranus: require('../assets/planets/uranus.png'),
    neptune: require('../assets/planets/neptune.png'),
    pluto: require('../assets/planets/pluto.png'),
    sun: require('../assets/planets/sun.png')
  };

  const planetTier = planets[activePlanet].tier;
  const planetSize = 150 + (planetTier - 1) * 10; // Increase size with tier

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.stardustText}>
          {formatNumber(stardust)} Stardust
        </Text>
        <Text style={styles.rateText}>
          {formatNumber(clickPower * planetTier)} per click | {formatNumber(autoClickRate * planetTier)} per second
        </Text>
      </View>
      
      <View style={styles.planetContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={styles.planetButton}
        >
          <Animated.View
            style={[
              styles.planetWrapper,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <Image
              source={planetImages[activePlanet]}
              style={[
                styles.planetImage,
                { width: planetSize, height: planetSize }
              ]}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.planetName}>
          {activePlanet.charAt(0).toUpperCase() + activePlanet.slice(1)} (Tier {planetTier})
        </Text>
        <Text style={styles.infoText}>
          Tap the planet to collect stardust!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  stardustText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  rateText: {
    fontSize: 16,
    color: '#ccc',
  },
  planetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetButton: {
    padding: 20,
  },
  planetWrapper: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  planetImage: {
    width: 150,
    height: 150,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default ClickerScreen;
