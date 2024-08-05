// server.js

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const gameRoutes = require("./routes/gameRoutes");

const redirectionLog = require("./middleware/redirectionLog");
const authMiddleware = require("./middleware/authMiddleware");

const logger = require("./logger"); // Import the logger
const passport = require("./passportConfig");

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(
  "mongodb+srv://NazaRepr:Ace087Ace0807!@cluster0.7x4blwu.mongodb.net/gameDatabase",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Middleware Setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // For parsing application/json
app.use(express.static("public"));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
app.use(redirectionLog);
app.use(authMiddleware);

// Define Routes
app.get("/", (req, res) => {
  res.render("index");
});

// Define Routes
app.use("/", authRoutes);
app.use("/database", dataRoutes);
app.use("/game", gameRoutes);

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
