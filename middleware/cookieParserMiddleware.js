const cookieParser = require("cookie-parser");

// Middleware to initialize cookie-parser
const initializeCookieParser = (app) => {
  app.use(cookieParser()); // Initialize cookie-parser
};

module.exports = initializeCookieParser;
