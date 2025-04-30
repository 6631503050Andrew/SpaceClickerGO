"use client"

import { useContext } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { GameContext } from "../context/GameContext"

const UpgradesScreen = () => {
  const {
    stardust,
    upgrades,
    planets,
    activePlanet,
    purchaseUpgrade,
    unlockPlanet,
    upgradePlanetTier,
    setActivePlanet,
    formatNumber,
  } = useContext(GameContext)

  const planetImages = {
    mercury: require("../assets/planets/mercury.png"),
    venus: require("../assets/planets/venus.png"),
    earth: require("../assets/planets/earth.png"),
    mars: require("../assets/planets/mars.png"),
    jupiter: require("../assets/planets/jupiter.png"),
    saturn: require("../assets/planets/saturn.png"),
    uranus: require("../assets/planets/uranus.png"),
    neptune: require("../assets/planets/neptune.png"),
    pluto: require("../assets/planets/pluto.png"),
    sun: require("../assets/planets/sun.png"),
  }

  const renderUpgradeButton = (title, description, type, cost, level) => (
    <TouchableOpacity
      style={[styles.upgradeButton, stardust < cost ? styles.disabledButton : null]}
      onPress={() => purchaseUpgrade(type)}
      disabled={stardust < cost}
    >
      <View style={styles.upgradeInfo}>
        <Text style={styles.upgradeTitle}>{title}</Text>
        <Text style={styles.upgradeDescription}>{description}</Text>
        <Text style={styles.upgradeLevel}>Level: {level}</Text>
      </View>
      <View style={styles.costContainer}>
        <Text style={styles.costText}>{formatNumber(cost)}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderPlanetButton = (planetName, planet) => {
    const tierUpgradeCost = Math.floor(planet.cost * Math.pow(planet.multiplier, planet.tier))

    if (!planet.unlocked) {
      return (
        <TouchableOpacity
          key={planetName}
          style={[styles.planetButton, stardust < planet.cost ? styles.disabledButton : null]}
          onPress={() => unlockPlanet(planetName)}
          disabled={stardust < planet.cost}
        >
          <Image source={planetImages[planetName]} style={styles.planetImage} resizeMode="contain" />
          <View style={styles.planetInfo}>
            <Text style={styles.planetName}>{planetName.charAt(0).toUpperCase() + planetName.slice(1)}</Text>
            <Text style={styles.planetCost}>Unlock: {formatNumber(planet.cost)}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <View key={planetName} style={styles.planetUpgradeContainer}>
        <TouchableOpacity
          style={[styles.planetButton, activePlanet === planetName ? styles.activePlanet : null]}
          onPress={() => setActivePlanet(planetName)}
        >
          <Image source={planetImages[planetName]} style={styles.planetImage} resizeMode="contain" />
          <View style={styles.planetInfo}>
            <Text style={styles.planetName}>{planetName.charAt(0).toUpperCase() + planetName.slice(1)}</Text>
            <Text style={styles.planetTier}>Tier {planet.tier}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tierUpgradeButton, stardust < tierUpgradeCost ? styles.disabledButton : null]}
          onPress={() => upgradePlanetTier(planetName)}
          disabled={stardust < tierUpgradeCost}
        >
          <Text style={styles.tierUpgradeText}>Upgrade Tier</Text>
          <Text style={styles.tierUpgradeCost}>{formatNumber(tierUpgradeCost)}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stardust: {formatNumber(stardust)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upgrades</Text>
        {renderUpgradeButton(
          "Click Power",
          "Increase stardust per click",
          "clickPower",
          upgrades.clickPower.cost,
          upgrades.clickPower.level,
        )}
        {renderUpgradeButton(
          "Auto Clicker",
          "Collect stardust automatically",
          "autoClicker",
          upgrades.autoClicker.cost,
          upgrades.autoClicker.level,
        )}
        {renderUpgradeButton(
          "Stardust Multiplier",
          "Multiply stardust from all sources",
          "stardustMultiplier",
          upgrades.stardustMultiplier.cost,
          upgrades.stardustMultiplier.level,
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planets</Text>
        <Text style={styles.sectionDescription}>
          Unlock planets to increase your stardust production. Higher tier planets give more stardust per click.
        </Text>

        <View style={styles.planetsGrid}>
          {Object.entries(planets).map(([planetName, planet]) => renderPlanetButton(planetName, planet))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 15,
  },
  upgradeButton: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  upgradeDescription: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 2,
  },
  upgradeLevel: {
    fontSize: 12,
    color: "#6200ee",
    marginTop: 5,
  },
  costContainer: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  costText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  planetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  planetUpgradeContainer: {
    width: "48%",
    marginBottom: 15,
  },
  planetButton: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  activePlanet: {
    borderColor: "#6200ee",
    borderWidth: 2,
  },
  planetImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  planetInfo: {
    alignItems: "center",
  },
  planetName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  planetTier: {
    fontSize: 12,
    color: "#6200ee",
  },
  planetCost: {
    fontSize: 12,
    color: "#ccc",
  },
  tierUpgradeButton: {
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 8,
    alignItems: "center",
  },
  tierUpgradeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  tierUpgradeCost: {
    fontSize: 10,
    color: "#ccc",
  },
})

export default UpgradesScreen
