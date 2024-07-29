// logger.js
(function (window) {
  function log(scriptName, message, level) {
    const levels = ["info", "warn", "error"];
    if (levels.includes(level)) {
      console[level](`[${scriptName}] ${message}`);
    }
  }

  window.logger = {
    log: log,
  };
})(window);
