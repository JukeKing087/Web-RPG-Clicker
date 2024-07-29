// middleware/authMiddleware
const logger = require("../logger"); // Import the logger

const setUserMiddleware = (req, res, next) => {
  // Log the authenticated user information
  logger.log(
    "authMiddleware",
    `Authenticated User: ${
      req.isAuthenticated() ? JSON.stringify(req.user) : "None"
    }`,
    "info"
  );

  if (req.isAuthenticated()) {
    // Ensure that the user object is populated and set in res.locals
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }

  next();
};

module.exports = setUserMiddleware;
