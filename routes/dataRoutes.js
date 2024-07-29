// routes/dataRoutes.js

const express = require("express");
const mongoose = require("mongoose");
const logger = require("../logger"); // Import the logger

const Monster = require("../database/monstersDB");
const Items = require("../database/itemsDB");
const Equipment = require("../database/equipmentDB");
const Areas = require("../database/areasDB");

const router = express.Router();

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://NazaRepr:Ace087Ace0807!@cluster0.7x4blwu.mongodb.net/gameDatabase",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Route to get all areas
router.get("/areas", async (req, res) => {
  try {
    const areas = await Areas.find({}, "areas");
    res.json(areas);
    logger.log("dataRoutes.js", "Fetched all areas", "info");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching all areas: ${err.message}`,
      "error"
    );
    res.status(500).json({ message: err.message });
  }
});

// Route to get an area by name
router.get("/areas/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const area = await Areas.findOne({ "areas.name": name }, "areas.$");
    if (!area) {
      logger.log("dataRoutes.js", `Area not found: ${name}`, "warn");
      return res.status(404).json({ message: "Area not found" });
    }
    res.json(area);
    logger.log("dataRoutes.js", `Fetched area by name: ${name}`, "info");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching area by name: ${err.message}`,
      "error"
    );
    res.status(500).json({ message: err.message });
  }
});

// Route to get an area by ID
router.get("/areas/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const areaData = await Areas.findOne({ "areas.id": id }, { "areas.$": 1 });
    if (!areaData) {
      logger.log("dataRoutes.js", `Area not found by ID: ${id}`, "warn");
      return res.status(404).json({ message: "Area not found" });
    }

    const area = areaData.areas.find((area) => area.id === id);

    if (!area) {
      logger.log("dataRoutes.js", `Area not found by ID: ${id}`, "warn");
      return res.status(404).json({ message: "Area not found" });
    }

    res.json(area);
    logger.log("dataRoutes.js", `Fetched area by ID: ${id}`, "info");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching area by ID: ${err.message}`,
      "error"
    );
    res.status(500).json({ message: err.message });
  }
});

// Get all equipment data
router.get("/equipment", async (req, res) => {
  try {
    const equipment = await Equipment.findOne().exec();
    res.json(equipment);
    logger.log("dataRoutes.js", "Fetched all equipment data", "info");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching equipment data: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get equipment by type and category
router.get("/equipment/:type/:category", async (req, res) => {
  const { type, category } = req.params;

  if (
    !["normal", "shiny", "legendary"].includes(type) ||
    !["armor", "weapons"].includes(category)
  ) {
    logger.log(
      "dataRoutes.js",
      `Invalid type or category: type=${type}, category=${category}`,
      "warn"
    );
    return res.status(400).send("Invalid type or category");
  }

  try {
    const equipment = await Equipment.findOne({}, { [type]: 1 }).exec();
    if (equipment && equipment[type] && equipment[type][category]) {
      res.json(equipment[type][category]);
      logger.log(
        "dataRoutes.js",
        `Fetched equipment by type=${type} and category=${category}`,
        "info"
      );
    } else {
      logger.log(
        "dataRoutes.js",
        `Category not found: type=${type}, category=${category}`,
        "warn"
      );
      res.status(404).send("Category not found");
    }
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching equipment by type and category: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get equipment by type, category, and full ID
router.get("/equipment/:type/:category/:id", async (req, res) => {
  const { type, category, id } = req.params;

  // Log warning message for fix
  logger.log(
    "dataRoutes.js",
    "Warning: Endpoint /equipment/:type/:category/:id needs a fix",
    "warn"
  );

  if (
    !["normal", "shiny", "legendary"].includes(type) ||
    !["armor", "weapons"].includes(category)
  ) {
    logger.log(
      "dataRoutes.js",
      `Invalid type or category: type=${type}, category=${category}`,
      "warn"
    );
    return res.status(400).send("Invalid type or category");
  }

  try {
    const equipment = await Equipment.findOne({}, { [type]: 1 }).exec();
    if (equipment && equipment[type] && equipment[type][category]) {
      const item = Object.values(equipment[type][category]).find(
        (e) => e.id === id
      );
      if (item) {
        res.json(item);
        logger.log(
          "dataRoutes.js",
          `Fetched equipment item by ID=${id}`,
          "info"
        );
      } else {
        logger.log("dataRoutes.js", `Item not found: ID=${id}`, "warn");
        res.status(404).send("Item not found");
      }
    } else {
      logger.log(
        "dataRoutes.js",
        `Category not found: type=${type}, category=${category}`,
        "warn"
      );
      res.status(404).send("Category not found");
    }
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching equipment item by ID: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get all items data
router.get("/items", async (req, res) => {
  try {
    const items = await Items.findOne().exec();
    res.json(items);
    logger.log("dataRoutes.js", "Fetched all items data", "info");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching all items: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get items by category
router.get("/items/:category", async (req, res) => {
  const { category } = req.params;

  if (!["materials", "coins", "scrolls", "gems"].includes(category)) {
    logger.log("dataRoutes.js", `Invalid category: ${category}`, "warn");
    return res.status(400).send("Invalid category");
  }

  try {
    const items = await Items.findOne({}, { [category]: 1 }).exec();
    if (items && items[category]) {
      res.json(items[category]);
      logger.log(
        "dataRoutes.js",
        `Fetched items by category: ${category}`,
        "info"
      );
    } else {
      logger.log("dataRoutes.js", `Category not found: ${category}`, "warn");
      res.status(404).send("Category not found");
    }
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching items by category: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get item by category and ID
router.get("/items/:category/:id", async (req, res) => {
  const { category, id } = req.params;

  if (!["materials", "coins", "scrolls", "gems"].includes(category)) {
    logger.log("dataRoutes.js", `Invalid category: ${category}`, "warn");
    return res.status(400).send("Invalid category");
  }

  if (!/^\d+$/.test(id)) {
    logger.log("dataRoutes.js", `Invalid ID format: ${id}`, "warn");
    return res.status(400).send("Invalid ID format");
  }

  try {
    const items = await Items.findOne({}, { [category]: 1 }).exec();
    if (items && items[category]) {
      const item = items[category].find((i) => i.id === id);
      if (item) {
        res.json(item);
        logger.log(
          "dataRoutes.js",
          `Fetched item by category=${category} and ID=${id}`,
          "info"
        );
      } else {
        logger.log(
          "dataRoutes.js",
          `Item not found: category=${category}, ID=${id}`,
          "warn"
        );
        res.status(404).send("Item not found");
      }
    } else {
      logger.log("dataRoutes.js", `Category not found: ${category}`, "warn");
      res.status(404).send("Category not found");
    }
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching item by category and ID: ${err.message}`,
      "error"
    );
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get all monsters
router.get("/monsters", async (req, res) => {
  try {
    const monsters = await Monster.find().exec(); // Query for all monsters
    res.json(monsters);
    logger.log("dataRoutes.js", "Fetched all monsters", "info");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching monsters: ${err.message}`,
      "error"
    );
    res.status(500).send("Error Reading Data");
  }
});

// Get monsters by category
router.get("/monsters/:category", async (req, res) => {
  const { category } = req.params;

  if (!["Normal", "Shiny", "Boss"].includes(category)) {
    logger.log("dataRoutes.js", `Invalid category: ${category}`, "warn");
    return res.status(400).send("Invalid category");
  }

  try {
    const monsters = await Monster.findOne({}, { [category]: 1 }).exec();
    if (monsters && monsters[category]) {
      res.json(monsters[category]);
      logger.log(
        "dataRoutes.js",
        `Fetched monsters by category: ${category}`,
        "info"
      );
    } else {
      logger.log("dataRoutes.js", `Category not found: ${category}`, "warn");
      res.status(404).send("Category not found");
    }
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching monsters by category: ${err.message}`,
      "error"
    );
    res.status(500).send("Error Reading Data");
  }
});

// Get monster by exact ID across all categories
router.get("/monsters/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const monsterCategories = ["Normal", "Shiny", "Boss"];
    for (const category of monsterCategories) {
      const monsterCategory = await Monster.findOne(
        {},
        { [category]: 1 }
      ).exec();
      if (monsterCategory && monsterCategory[category]) {
        const monster = Array.from(monsterCategory[category].values()).find(
          (m) => m.id === id
        ); // Find by exact ID
        if (monster) {
          return res.json(monster);
        }
      }
    }

    logger.log("dataRoutes.js", `Monster not found by ID: ${id}`, "warn");
    res.status(404).send("Monster not found");
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching monster by ID: ${err.message}`,
      "error"
    );
    res.status(500).send("Error Reading Data");
  }
});

// Function to extract numeric ID from a given ID
const extractNumericId = (id) => {
  const match = id.match(/\d+$/); // Extract numeric part from the end of the string
  return match ? match[0] : null;
};

// Get monster by category and numeric ID
router.get("/monsters/:category/:id", async (req, res) => {
  let { category, id } = req.params;

  category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  if (!["Normal", "Shiny", "Boss"].includes(category)) {
    logger.log("dataRoutes.js", `Invalid category: ${category}`, "warn");
    return res.status(400).send("Invalid category");
  }

  const numericId = extractNumericId(id);
  if (!numericId) {
    logger.log("dataRoutes.js", `Invalid ID format: ${id}`, "warn");
    return res.status(400).send("Invalid ID format");
  }

  try {
    const monsterCategory = await Monster.findOne({}, { [category]: 1 }).exec();
    if (monsterCategory && monsterCategory[category]) {
      const monster = Array.from(monsterCategory[category].values()).find((m) =>
        m.id.endsWith(numericId)
      ); // Find by numeric ID
      if (monster) {
        res.json(monster);
        logger.log(
          "dataRoutes.js",
          `Fetched monster by category=${category} and ID=${id}`,
          "info"
        );
      } else {
        logger.log(
          "dataRoutes.js",
          `Monster not found by category=${category} and ID=${id}`,
          "warn"
        );
        res.status(404).send("Monster not found");
      }
    } else {
      logger.log("dataRoutes.js", `Category not found: ${category}`, "warn");
      res.status(404).send("Category not found");
    }
  } catch (err) {
    logger.log(
      "dataRoutes.js",
      `Error fetching monster by category and numeric ID: ${err.message}`,
      "error"
    );
    res.status(500).send("Error Reading Data");
  }
});

module.exports = router;
