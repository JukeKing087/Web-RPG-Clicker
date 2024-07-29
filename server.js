// server.js

const express = require("express");
const session = require("express-session");
const path = require("path");
const axios = require("axios");

const passport = require("./passportConfig");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const gameRoutes = require("./routes/gameRoutes"); // Import the function
const { giveMonster } = require("./routes/gameLogic");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./database/userDB");

const logger = require("./logger"); // Import the logger

const app = express();
const port = 3000;

// Middleware Setup
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session Configuration
app.use(
  session({
    secret: "your_secret_key", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Route Middleware
app.use(authRoutes);
app.use(authMiddleware); // Ensure authMiddleware is added after passport initialization

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// Define Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/database", dataRoutes);
app.use("/game", gameRoutes);

app.get("/game", async (req, res) => {
  try {
    logger.log("server.js", "Received request to /game", "info");

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      logger.log("server.js", "Unauthorized: User not authenticated", "error");
      return res.status(401).send("Unauthorized: User not authenticated");
    }

    // Fetch user data
    logger.log("server.js", `User ID: ${req.user._id}`, "info");
    const user = await User.findById(req.user._id).exec();
    logger.log("server.js", `Fetched User: ${JSON.stringify(user)}`, "info");

    if (!user) {
      logger.log("server.js", "User not found", "error");
      return res.status(404).send("User not found");
    }

    // Get and process area name
    const areaName = user.player.attributes.area.toLowerCase();
    logger.log("server.js", `Area Name: ${areaName}`, "info");

    if (areaName === "village") {
      logger.log(
        "server.js",
        "User is in the village area. Rendering game with no monster.",
        "info"
      );
      return res.render("game", { user, monster: null });
    }

    // Use the giveMonster function to get a monster for the area
    const selectedMonster = await giveMonster(areaName);
    logger.log(
      "server.js",
      `Selected Monster: ${JSON.stringify(selectedMonster)}`,
      "info"
    );

    // Render the game with the selected monster
    logger.log("server.js", "Rendering game with selected monster", "info");
    res.render("game", { user, monster: selectedMonster });
  } catch (err) {
    logger.log(
      "server.js",
      `Error occurred during request handling: ${err.message}`,
      "error"
    );
    logger.log("server.js", `Stack Trace: ${err.stack}`, "error");
    res.status(500).send("Server error");
  }
});

// Handle 404 Errors
app.use((req, res, next) => {
  logger.log("server.js", "404 Error: Page Not Found", "warn");
  res.status(404).render("404", { error: "Page Not Found" });
});

// Handle Other Errors
app.use((err, req, res, next) => {
  logger.log("server.js", `500 Error: ${err.stack}`, "error");
  res.status(500).render("500", { error: "Something went wrong!" });
});

// Start the Server
if (require.main === module) {
  app.listen(port, () => {
    logger.log(
      "server.js",
      `Server running at http://localhost:${port}`,
      "info"
    );
  });
}

module.exports = app; // Export the app for testing
