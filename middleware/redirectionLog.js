const logger = require("../logger"); // Import your logger module
const logRequests = (req, res, next) => {
  // Log incoming request details
  logger.log(
    "requestLogger.js",
    `Method: ${req.method}, Path: ${req.originalUrl}, IP: ${req.ip}`,
    "info"
  );

  // Capture and log any redirects
  const originalSend = res.send;
  res.send = function (body) {
    // Log redirection if status code is 3xx
    if (res.statusCode >= 300 && res.statusCode < 400) {
      logger.log(
        "requestLogger.js",
        `Redirection: ${res.statusCode} to ${res.getHeader("Location")}`,
        "info"
      );
    }
    return originalSend.apply(this, arguments);
  };

  next();
};

module.exports = logRequests;
