let clickCount = 0;

let xp = 0;

let level = 1;

let inventory = [];

let equipment = [];

let playerStats = {
  attack: 10,

  defense: 5,

  health: 30
};

let enemyStats = {
  name: "Goblin",

  level: 1,

  attack: getRandomInt(5, 10),

  defense: getRandomInt(2, 5),

  health: getRandomInt(15, 30)
};

setInterval(healPlayer, 1500); // Heal the player every 1.5 seconds

function clickHandler() {
  clickCount++;

  // Simulate battle with the enemy

  const playerDamage = calculateDamage(playerStats.attack, enemyStats.defense);

  const enemyDamage = calculateDamage(enemyStats.attack, playerStats.defense);

  // Update enemy health

  enemyStats.health -= playerDamage;

  // Check if the enemy is defeated

  if (enemyStats.health <= 0) {
    defeatEnemy();
  } else {
    // Player takes damage

    playerStats.health -= enemyDamage;

    // Check if the player is defeated

    if (playerStats.health <= 0) {
      gameOver();
    } else {
      updateStats();
    }
  }
}

function defeatEnemy() {
  alert(
    `You defeated the ${enemyStats.name}! Earned ${calculateXPGained()} XP.`
  );

  // Gain XP and check for level up

  xp += calculateXPGained();

  checkLevelUp();

  // Drop system - basic implementation

  dropSystem();

  // Reset enemy stats for the next encounter

  resetEnemy();
}

function dropSystem() {
  // Simulate drop of either resource or equipment

  const dropType = getRandomInt(1, 2); // 1 for resource, 2 for equipment

  if (dropType === 1) {
    const resource = getRandomResource();

    inventory.push(resource);

    alert(`You obtained ${resource}!`);
  } else {
    const equipmentType = getRandomEquipmentType();

    const equipmentName = getRandomEquipmentName(equipmentType);

    equipment.push(equipmentName);

    alert(`You obtained ${equipmentName}!`);
  }
}

function getRandomResource() {
  const resources = ["Wood", "Stone", "Iron", "Gold"];

  return resources[getRandomInt(0, resources.length - 1)];
}

function getRandomEquipmentType() {
  const equipmentTypes = ["Sword", "Shield", "Helmet", "Armor"];

  return equipmentTypes[getRandomInt(0, equipmentTypes.length - 1)];
}

function getRandomEquipmentName(type) {
  const prefixes = ["Dull", "Sturdy", "Sharp", "Shiny"];

  const suffixes = ["of Power", "of Defense", "of Agility"];

  return `${prefixes[getRandomInt(0, prefixes.length - 1)]} ${type} ${
    suffixes[getRandomInt(0, suffixes.length - 1)]
  }`;
}

function resetEnemy() {
  enemyStats = {
    name: "Goblin",

    level: level,

    attack: getRandomInt(5, 10),

    defense: getRandomInt(2, 5),

    health: getRandomInt(15, 30)
  };

  updateStats();
}

function gameOver() {
  alert("Game Over! You were defeated by the enemy. Restarting...");

  // Reset player and enemy stats

  resetPlayer();

  resetEnemy();
}

function resetPlayer() {
  playerStats = {
    attack: 10,

    defense: 5,

    health: 30
  };

  inventory = [];

  equipment = [];
}

function calculateXPGained() {
  return enemyStats.level * 10;
}

function updateStats() {
  const playerLevelElement = document.getElementById("playerLevel");

  const playerXPElement = document.getElementById("playerXP");

  const playerAttackElement = document.getElementById("playerAttack");

  const playerDefenseElement = document.getElementById("playerDefense");

  const playerHealthElement = document.getElementById("playerHealth");

  const enemyLevelElement = document.getElementById("enemyLevel");

  const enemyHealthElement = document.getElementById("enemyHealth");

  const inventoryElement = document.getElementById("inventory");

  const equipmentElement = document.getElementById("equipment");

  playerLevelElement.textContent = level;

  playerXPElement.textContent = xp;

  playerAttackElement.textContent = playerStats.attack;

  playerDefenseElement.textContent = playerStats.defense;

  playerHealthElement.textContent = playerStats.health;

  enemyLevelElement.textContent = enemyStats.level;

  enemyHealthElement.textContent = enemyStats.health;

  // Display inventory at the bottom

  inventoryElement.textContent = `Inventory: ${inventory.join(", ")}`;

  // Display equipment

  equipmentElement.textContent = `Equipment: ${equipment.join(", ")}`;
}

function checkLevelUp() {
  const xpToNextLevel = level * 100;

  if (xp >= xpToNextLevel) {
    level++;

    // Increase all player stats by 1 on level up

    for (let stat in playerStats) {
      if (
        playerStats.hasOwnProperty(stat) &&
        typeof playerStats[stat] === "number"
      ) {
        playerStats[stat]++;
      }
    }

    xp = 0;

    resetEnemy();

    alert(`Level Up! You are now Level ${level}`);
  }
}

function calculateDamage(attack, defense) {
  // Minimum damage is 1

  const damage = Math.max(1, attack - defense);

  return damage;
}

function healPlayer() {
  // Heal the player by 1 HP

  playerStats.health = Math.min(playerStats.health + 1, 30); // Cap health at 30

  updateStats();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the stats

resetPlayer();

resetEnemy();

updateStats();