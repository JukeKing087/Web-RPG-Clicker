document.addEventListener("DOMContentLoaded", () => {
  const dropdownButton = document.getElementById("dropdownButton");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (dropdownButton && dropdownMenu) {
    // Toggle the dropdown menu when the button is clicked
    dropdownButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click event from propagating
      dropdownMenu.classList.toggle("show"); // Toggle the visibility
      logger.log(
        "game.js",
        "Dropdown menu toggled: " +
          (dropdownMenu.classList.contains("show") ? "Shown" : "Hidden"),
        "info"
      );
    });

    // Hide the dropdown menu when clicking outside of it
    document.addEventListener("click", () => {
      if (dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
        logger.log("game.js", "Dropdown menu hidden", "info");
      }
    });

    // Prevent the dropdown menu from closing when clicking inside it
    dropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      logger.log(
        "game.js",
        "Dropdown menu click event stopped from propagating",
        "info"
      );
    });
  }

  // Handle area selection from dropdown menu
  document.querySelectorAll(".area-link").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const area = e.target.getAttribute("data-area");
      logger.log("game.js", "Area selected: " + area, "info");

      // Send a POST request to update the user's area
      try {
        const response = await fetch("/game/user/update-area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ area }),
        });

        const data = await response.json();
        if (data.success) {
          logger.log(
            "game.js",
            "Area updated successfully: " + data.message,
            "info"
          );
          // Optionally refresh the page or update UI
          location.reload(); // or update UI elements to reflect the change
        } else {
          logger.log("game.js", "Error updating area: " + data.error, "error");
        }
      } catch (error) {
        logger.log("game.js", "Error updating area: " + error.message, "error");
      }
    });
  });

  const clickButton = document.getElementById("clickButton");
  const clickAmount = document.getElementById("clickAmount");
  const playerLevel = document.getElementById("playerLevel");
  const playerXP = document.getElementById("playerXP");
  const playerHealth = document.getElementById("playerHealth");
  const playerMana = document.getElementById("playerMana");
  const playerStrength = document.getElementById("playerStrength");
  const playerAgility = document.getElementById("playerAgility");
  const playerIntelligence = document.getElementById("playerIntelligence");
  const playerEndurance = document.getElementById("playerEndurance");
  const playerCharisma = document.getElementById("playerCharisma");
  const enemyName = document.getElementById("enemyName");
  const enemyLevel = document.getElementById("enemyLevel");
  const enemyHealth = document.getElementById("enemyHealth");
  const enemyMana = document.getElementById("enemyMana");
  const enemyMaxHealth = document.getElementById("enemyMaxHealth");
  const enemyMaxMana = document.getElementById("enemyMaxMana");
  const enemyStrength = document.getElementById("enemyStrength");
  const enemyAgility = document.getElementById("enemyAgility");
  const enemyIntelligence = document.getElementById("enemyIntelligence");
  const enemyEndurance = document.getElementById("enemyEndurance");
  const enemyCharisma = document.getElementById("enemyCharisma");
  const enemyAttack = document.getElementById("enemyAttack");
  const enemyDefense = document.getElementById("enemyDefense");

  let clicks = 0;
  let playerData = {
    level: playerLevel ? parseInt(playerLevel.textContent) : 0,
    experience: playerXP ? parseInt(playerXP.textContent) : 0,
    health: playerHealth
      ? parseInt(playerHealth.textContent.split(" / ")[0])
      : 0,
    maxHealth: playerHealth
      ? parseInt(playerHealth.textContent.split(" / ")[1])
      : 0,
    mana: playerMana ? parseInt(playerMana.textContent.split(" / ")[0]) : 0,
    maxMana: playerMana ? parseInt(playerMana.textContent.split(" / ")[1]) : 0,
    stats: {
      strength: playerStrength ? parseInt(playerStrength.textContent) : 0,
      agility: playerAgility ? parseInt(playerAgility.textContent) : 0,
      intelligence: playerIntelligence
        ? parseInt(playerIntelligence.textContent)
        : 0,
      endurance: playerEndurance ? parseInt(playerEndurance.textContent) : 0,
      charisma: playerCharisma ? parseInt(playerCharisma.textContent) : 0,
    },
  };

  let monsterData = {
    name: enemyName ? enemyName.textContent : "Unknown",
    level: enemyLevel ? parseInt(enemyLevel.textContent) : 0,
    health: enemyHealth ? parseInt(enemyHealth.textContent) : 0,
    maxHealth: enemyMaxHealth ? parseInt(enemyMaxHealth.textContent) : 0,
    mana: enemyMana ? parseInt(enemyMana.textContent) : 0,
    maxMana: enemyMaxMana ? parseInt(enemyMaxMana.textContent) : 0,
    stats: {
      strength: enemyStrength ? parseInt(enemyStrength.textContent) : 0,
      agility: enemyAgility ? parseInt(enemyAgility.textContent) : 0,
      intelligence: enemyIntelligence
        ? parseInt(enemyIntelligence.textContent)
        : 0,
      endurance: enemyEndurance ? parseInt(enemyEndurance.textContent) : 0,
      charisma: enemyCharisma ? parseInt(enemyCharisma.textContent) : 0,
    },
    attack: enemyAttack ? parseInt(enemyAttack.textContent) : 0,
    defense: enemyDefense ? parseInt(enemyDefense.textContent) : 0,
  };

  function updateFrontend() {
    if (playerLevel) playerLevel.textContent = playerData.level;
    if (playerXP) playerXP.textContent = playerData.experience;
    if (playerHealth)
      playerHealth.textContent = `${playerData.health} / ${playerData.maxHealth}`;
    if (playerMana)
      playerMana.textContent = `${playerData.mana} / ${playerData.maxMana}`;
    if (playerStrength) playerStrength.textContent = playerData.stats.strength;
    if (playerAgility) playerAgility.textContent = playerData.stats.agility;
    if (playerIntelligence)
      playerIntelligence.textContent = playerData.stats.intelligence;
    if (playerEndurance)
      playerEndurance.textContent = playerData.stats.endurance;
    if (playerCharisma) playerCharisma.textContent = playerData.stats.charisma;

    if (enemyName) enemyName.textContent = monsterData.name;
    if (enemyLevel) enemyLevel.textContent = monsterData.level;
    if (enemyHealth) enemyHealth.textContent = monsterData.health;
    if (enemyMaxHealth) enemyMaxHealth.textContent = monsterData.maxHealth;
    if (enemyMana) enemyMana.textContent = monsterData.mana;
    if (enemyMaxMana) enemyMaxMana.textContent = monsterData.maxMana;
    if (enemyStrength) enemyStrength.textContent = monsterData.stats.strength;
    if (enemyAgility) enemyAgility.textContent = monsterData.stats.agility;
    if (enemyIntelligence)
      enemyIntelligence.textContent = monsterData.stats.intelligence;
    if (enemyEndurance)
      enemyEndurance.textContent = monsterData.stats.endurance;
    if (enemyCharisma) enemyCharisma.textContent = monsterData.stats.charisma;
    if (enemyAttack) enemyAttack.textContent = monsterData.attack;
    if (enemyDefense) enemyDefense.textContent = monsterData.defense;

    logger.log(
      "game.js",
      "Frontend updated with player and monster data",
      "info"
    );
  }

  if (clickButton) {
    clickButton.addEventListener("click", () => {
      clicks += 1;
      if (clickAmount) clickAmount.textContent = `Clicks: ${clicks}`;
      logger.log(
        "game.js",
        "Click button pressed, total clicks: " + clicks,
        "info"
      );

      // Simulate attack logic
      const damage = Math.max(
        1,
        playerData.stats.strength - monsterData.defense
      );
      monsterData.health -= damage;
      logger.log("game.js", "Calculated damage: " + damage, "info");

      if (monsterData.health <= 0) {
        monsterData.health = 0;
        alert("Monster defeated!");
        logger.log("game.js", "Monster defeated", "info");
        // You can add logic here to handle monster defeat, e.g., level up the player, change monster, etc.
      }

      updateFrontend();
    });
  }

  // Initialize frontend
  updateFrontend();
});
