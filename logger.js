// logger.js

const isLoggingEnabled = true; // Toggle logging here

// Script-specific logging settings
const scriptLoggingSettings = {
  "server.js": true,
  "authRoutes.js": true,
  "dataRoutes.js": true,
  "gameLogic.js": true,
  "gameRoutes.js": true,
  "game.js": true,
  "authMiddleware.js": true,
  "db.js": true,
  "areaDB.js": true,
  "equipmentDB.js": true,
  "itemsDB.js": true,
  "monstersDB.js": true,
  "userDB.js": true,
};

function log(scriptName, message, level = "info") {
  if (isLoggingEnabled && scriptLoggingSettings[scriptName]) {
    const timestamp = new Date().toISOString();
    switch (level) {
      case "info":
        console.log(`[INFO] [${timestamp}] [${scriptName}] ${message}`);
        break;
      case "warn":
        console.warn(`[WARN] [${timestamp}] [${scriptName}] ${message}`);
        break;
      case "error":
        console.error(`[ERROR] [${timestamp}] [${scriptName}] ${message}`);
        break;
      default:
        console.log(`[LOG] [${timestamp}] [${scriptName}] ${message}`);
        break;
    }
  }
}

module.exports = { log };
