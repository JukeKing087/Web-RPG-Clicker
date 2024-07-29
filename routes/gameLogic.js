// routes/gameLogic.js

const axios = require("axios");
const logger = require("../logger"); // Import the logger

async function getMonsterForArea(areaName) {
  try {
    const areaResponse = await axios.get(
      `http://localhost:3000/database/areas/name/${areaName}`
    );
    logger.log(
      "gameLogic.js",
      `Area Data Response Status: ${areaResponse.status}`,
      "info"
    );
    logger.log(
      "gameLogic.js",
      `Area Data Response Headers: ${JSON.stringify(areaResponse.headers)}`,
      "info"
    );
    logger.log(
      "gameLogic.js",
      `Area Data: ${JSON.stringify(areaResponse.data)}`,
      "info"
    );

    const areaData = areaResponse.data;
    const area = areaData.areas.find(
      (area) => area.name.toLowerCase() === areaName
    );
    const monsterData = area ? area.monsters : {};
    logger.log(
      "gameLogic.js",
      `Monster Data: ${JSON.stringify(monsterData)}`,
      "info"
    );

    const monsterIds = [];
    if (monsterData.normal) {
      Object.values(monsterData.normal).forEach((monster) => {
        if (monster.id) {
          monsterIds.push(monster.id);
        }
      });
    }

    logger.log(
      "gameLogic.js",
      `Monster IDs: ${JSON.stringify(monsterIds)}`,
      "info"
    );

    if (monsterIds.length === 0) {
      logger.log(
        "gameLogic.js",
        "No valid monsters available for this area",
        "error"
      );
      throw new Error("No valid monsters available for this area");
    }

    const categories = {
      MN: "Normal",
      MS: "Shiny",
      MB: "Boss",
    };

    const monsterPromises = monsterIds.map((id) => {
      const categoryPrefix = id.slice(0, 2);
      const category = categories[categoryPrefix];
      const monsterId = id.slice(2);

      if (!category) {
        logger.log(
          "gameLogic.js",
          `Invalid category prefix in ID ${id}`,
          "error"
        );
        return Promise.reject(new Error(`Invalid category prefix in ID ${id}`));
      }

      const url = `http://localhost:3000/database/monsters/${category}/${monsterId}`;
      return axios
        .get(url)
        .then((response) => {
          logger.log(
            "gameLogic.js",
            `Monster data for ID ${id} - Status: ${response.status}`,
            "info"
          );
          logger.log(
            "gameLogic.js",
            `Monster data for ID ${id}: ${JSON.stringify(response.data)}`,
            "info"
          );
          return response.data;
        })
        .catch((err) => {
          logger.log(
            "gameLogic.js",
            `Error fetching data for monster ID ${id}: ${err.message}`,
            "error"
          );
          throw err;
        });
    });

    const monsters = await Promise.all(monsterPromises);
    logger.log(
      "gameLogic.js",
      `Monsters Data: ${JSON.stringify(monsters)}`,
      "info"
    );

    const totalWeight = monsters.reduce(
      (sum, monster) => sum + (monster.spawnChance || 1),
      0
    );
    logger.log("gameLogic.js", `Total Weight: ${totalWeight}`, "info");

    if (totalWeight === 0) {
      logger.log(
        "gameLogic.js",
        "Total weight is zero, cannot select a monster",
        "error"
      );
      throw new Error("Error selecting monster: No valid weights");
    }

    const randomWeight = Math.random() * totalWeight;
    logger.log("gameLogic.js", `Random Weight: ${randomWeight}`, "info");

    let cumulativeWeight = 0;
    const selectedMonster = monsters.find((monster) => {
      cumulativeWeight += monster.spawnChance || 1;
      logger.log(
        "gameLogic.js",
        `Checking monster ${monster.name}: Cumulative Weight = ${cumulativeWeight}`,
        "info"
      );
      return randomWeight < cumulativeWeight;
    });

    logger.log(
      "gameLogic.js",
      `Selected Monster: ${JSON.stringify(selectedMonster)}`,
      "info"
    );

    if (!selectedMonster) {
      logger.log(
        "gameLogic.js",
        "No monster selected, which should not happen.",
        "error"
      );
      throw new Error("Error selecting monster");
    }

    return selectedMonster;
  } catch (err) {
    logger.log(
      "gameLogic.js",
      `Error occurred during monster fetching: ${err.message}`,
      "error"
    );
    logger.log("gameLogic.js", `Stack Trace: ${err.stack}`, "error");
    throw new Error("Server error fetching monster data");
  }
}

async function giveMonster(areaName) {
  try {
    // Fetch the monster for the given area
    const selectedMonster = await getMonsterForArea(areaName);

    if (!selectedMonster || !selectedMonster.stats) {
      throw new Error(`Invalid monster data received for area: ${areaName}`);
    }

    // Define level ranges based on the area
    const levelRanges = {
      Village: 0,
      "training-fields": 1,
      "slime-field": 5,
      "goblin-forest": 10,
      "orc-kingdom": 15,
    };

    // Get default level range for the area
    const baseLevel = levelRanges[areaName] || 1;

    // Special case for "Training-Fields"
    const maxLevel = areaName === "training-fields" ? 1 : baseLevel + 4;

    let effectiveLevel;
    let updatedStats;

    if (maxLevel === 1) {
      // No level adjustment if maxLevel is 1
      effectiveLevel = 1;
      updatedStats = {
        level: effectiveLevel,
        experience: Math.round(50), // Base experience value
        health: selectedMonster.stats.health || 0,
        maxHealth: selectedMonster.stats.health || 0,
        mana: selectedMonster.stats.mana || 0,
        maxMana: selectedMonster.stats.mana || 0,
        strength: selectedMonster.stats.strength || 0,
        agility: selectedMonster.stats.agility || 0,
        intelligence: selectedMonster.stats.intelligence || 0,
        endurance: selectedMonster.stats.endurance || 0,
        charisma: selectedMonster.stats.charisma || 0,
      };
    } else {
      // Determine monster level with a 1.25 fold chance
      const level =
        Math.floor(Math.random() * (maxLevel - baseLevel + 1)) + baseLevel;
      const higherLevelChance = Math.random();
      effectiveLevel = Math.min(
        higherLevelChance < 0.25 ? level + 1 : level,
        maxLevel
      );

      // Stats multiplier and level adjustment
      const statsMultiplier = 1.25;
      const levelAdjustment = effectiveLevel - baseLevel;

      // Calculate updated stats
      updatedStats = {
        level: effectiveLevel,
        experience: Math.round(50 * Math.pow(statsMultiplier, levelAdjustment)),
        health: Math.round(
          (selectedMonster.stats.health || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        maxHealth: Math.round(
          (selectedMonster.stats.maxHealth || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        mana: Math.round(
          (selectedMonster.stats.mana || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        maxMana: Math.round(
          (selectedMonster.stats.maxMana || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        strength: Math.round(
          (selectedMonster.stats.strength || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        agility: Math.round(
          (selectedMonster.stats.agility || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        intelligence: Math.round(
          (selectedMonster.stats.intelligence || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        endurance: Math.round(
          (selectedMonster.stats.endurance || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
        charisma: Math.round(
          (selectedMonster.stats.charisma || 0) *
            Math.pow(statsMultiplier, levelAdjustment)
        ),
      };
    }

    // Create the updated monster object with player-like structure
    const updatedMonster = {
      name: selectedMonster.name,
      level: updatedStats.level,
      player: {
        health: updatedStats.health,
        maxHealth: updatedStats.maxHealth,
        mana: updatedStats.mana,
        maxMana: updatedStats.maxMana,
      },
      stats: {
        strength: updatedStats.strength,
        agility: updatedStats.agility,
        intelligence: updatedStats.intelligence,
        endurance: updatedStats.endurance,
        charisma: updatedStats.charisma,
      },
    };

    return updatedMonster;
  } catch (err) {
    logger.log(
      "gameLogic.js",
      `Error occurred during monster selection: ${err.message}`,
      "error"
    );
    logger.log("gameLogic.js", `Stack Trace: ${err.stack}`, "error");
    throw new Error("Server error selecting monster");
  }
}

function calculateDamage(userStats, monsterStats) {
  // Example damage formula: damage = strength - monster defense
  // Adjust formula as needed
  const baseDamage = userStats.strength - monsterStats.defense;

  // Ensure damage is not negative
  return Math.max(baseDamage, 0);
}

function interactWithNPC(npcId) {
  let npc = getNPCById(npcId);

  if (npc) {
    return npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];
  } else {
    return "NPC not found.";
  }
}

function getNPCById(npcId) {
  // Fetch NPC data from the area database or other sources
  // Example: return area.NPCs[npcId];
}

function checkForRandomEvent(areaId) {
  let area = areasDatabase.find((area) => area.id === areaId);

  if (!area || !area.randomEvents) {
    return null; // No events to check
  }

  for (let eventId in area.randomEvents) {
    let event = area.randomEvents[eventId];
    if (Math.random() < event.chance) {
      return event;
    }
  }

  return null; // No event triggered
}

async function getUserProfile(userId) {
  try {
    const userProfileResponse = await axios.get(
      `http://localhost:3000/user/${userId}`
    );
    return userProfileResponse.data;
  } catch (error) {
    logger.log(
      "gameLogic.js",
      `Error fetching user profile: ${error.message}`,
      "error"
    );
    throw error; // Rethrow error for handling upstream
  }
}

module.exports = {
  getMonsterForArea,
  giveMonster,
  calculateDamage,
  interactWithNPC,
  getNPCById,
  checkForRandomEvent,
  getUserProfile,
};
