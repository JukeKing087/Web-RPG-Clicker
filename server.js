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
    console.log("Received request to /game");

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      console.error("Unauthorized: User not authenticated");
      return res.status(401).send("Unauthorized: User not authenticated");
    }

    // Fetch user data
    console.log("User ID:", req.user._id);
    const user = await User.findById(req.user._id).exec();
    console.log("Fetched User:", user);

    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found");
    }

    // Get and process area name
    const areaName = user.player.attributes.area.toLowerCase();
    console.log("Area Name:", areaName);

    if (areaName === "village") {
      console.log(
        "User is in the village area. Rendering game with no monster."
      );
      return res.render("game", { user, monster: null });
    }

    // Use the giveMonster function to get a monster for the area
    const selectedMonster = await giveMonster(areaName);
    console.log("Selected Monster:", selectedMonster);

    // Render the game with the selected monster
    console.log("Rendering game with selected monster");
    res.render("game", { user, monster: selectedMonster });
  } catch (err) {
    console.error("Error occurred during request handling:", err.message);
    console.error("Stack Trace:", err.stack);
    res.status(500).send("Server error");
  }
});

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).render("404", { error: "Page Not Found" });
});

// Handle Other Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { error: "Something went wrong!" });
});

// Start the Server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing
