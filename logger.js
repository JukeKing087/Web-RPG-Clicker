// logger.js

const isLoggingEnabled = true; // Toggle logging here

function log(message, level = "info") {
  if (isLoggingEnabled) {
    const timestamp = new Date().toISOString();
    switch (level) {
      case "info":
        console.log(`[INFO] [${timestamp}] ${message}`);
        break;
      case "warn":
        console.warn(`[WARN] [${timestamp}] ${message}`);
        break;
      case "error":
        console.error(`[ERROR] [${timestamp}] ${message}`);
        break;
      default:
        console.log(`[LOG] [${timestamp}] ${message}`);
        break;
    }
  }
}

module.exports = { log };
