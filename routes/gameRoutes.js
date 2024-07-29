// router/gameRoutes.js

const express = require("express");
const setUserMiddleware = require("../middleware/authMiddleware");
const { getUserProfile, giveMonster } = require("./gameLogic"); // Adjust path as needed
const User = require("../database/userDB");

const logger = require("../logger"); // Import the logger

const router = express.Router();

router.use("/user", setUserMiddleware);

// GET user profile
router.get("/user/profile", async (req, res) => {
  try {
    logger.log(
      "gameRoutes.js",
      `Fetching user profile for user: ${req.user._id}`,
      "info"
    );
    const userProfile = await User.findById(req.user._id).select(
      "player.attributes player.name player.level player.experience"
    );
    if (userProfile) {
      res.json(userProfile);
    } else {
      res.status(404).send("User profile not found");
    }
  } catch (err) {
    logger.log(
      "gameRoutes.js",
      `Error fetching user profile: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching user profile");
  }
});

// POST update user area
router.post("/user/update-area", async (req, res) => {
  const { area } = req.body;
  if (!area) {
    return res.status(400).json({ error: "Area is required" });
  }

  try {
    const user = await User.findById(req.user._id); // Ensure `_id` is used
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.player.attributes.area = area;
    await user.save();

    res.json({ success: true, message: "Area updated successfully" });
  } catch (error) {
    logger.log("gameRoutes.js", `Error details: ${error.message}`, "error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET user by account.id
router.get("/account/:accountId", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const user = await User.findOne({ "account.id": accountId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    logger.log(
      "gameRoutes.js",
      `Error fetching user profile: ${error.message}`,
      "error"
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch a random monster based on user's current area
router.post("/random-monster", async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is populated by authentication middleware
    const userProfile = await getUserProfile(userId);

    if (userProfile.player.attributes.area === "Village") {
      logger.log(
        "gameRoutes.js",
        "No monsters available in the village",
        "warn"
      );
      return res.status(400).send("No monsters available in the village");
    }

    // Fetch monsters for the current area
    const monsters = await giveMonster(userProfile.player.attributes.area);

    if (monsters.length === 0) {
      logger.log("gameRoutes.js", "No monsters found for the area", "warn");
      return res.status(404).send("No monsters found for the area");
    }

    // Randomly select a monster
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    res.json(randomMonster);
  } catch (error) {
    logger.log(
      "gameRoutes.js",
      `Error fetching random monster: ${error.message}`,
      "error"
    );
    res.status(500).send("Internal server error");
  }
});

// Route to handle click logic
router.post("/click", async (req, res) => {
  try {
    const { damage, enemyHealth } = req.body;
    const userId = req.user._id;
    const userProfile = await getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Here, update the monster's health in the database if needed
    // Example: Assuming you have a monster ID or other identifiers
    // await Monster.updateOne({ _id: monsterId }, { health: enemyHealth });

    // Update user stats, experience, etc., based on the click
    // For instance, increase experience based on damage dealt
    userProfile.player.experience += damage; // Example adjustment

    // Save updated user profile
    await userProfile.save();

    res.json({
      success: true,
      updatedHealth: enemyHealth,
      updatedExperience: userProfile.player.experience,
    });
  } catch (error) {
    logger.log(
      "gameRoutes.js",
      `Error handling click: ${error.message}`,
      "error"
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
