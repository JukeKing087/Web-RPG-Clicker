// routes/dataRoutes.js

const express = require("express");
const mongoose = require("mongoose");

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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get an area by name
router.get("/areas/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const area = await Areas.findOne({ "areas.name": name }, "areas.$");
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get an area by ID
router.get("/areas/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const areaData = await Areas.findOne({ "areas.id": id }, { "areas.$": 1 });
    if (!areaData) return res.status(404).json({ message: "Area not found" });

    // Extract the specific area from the areas array
    const area = areaData.areas.find((area) => area.id === id);

    if (!area) return res.status(404).json({ message: "Area not found" });

    res.json(area);
  } catch (err) {
    console.error("Error fetching area by ID:", err); // Debugging line
    res.status(500).json({ message: err.message });
  }
});

// Get all equipment data
router.get("/equipment", async (req, res) => {
  try {
    const equipment = await Equipment.findOne().exec();
    res.json(equipment);
  } catch (err) {
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
    return res.status(400).send("Invalid type or category");
  }

  try {
    const equipment = await Equipment.findOne({}, { [type]: 1 }).exec();
    if (equipment && equipment[type] && equipment[type][category]) {
      res.json(equipment[type][category]);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get equipment by type, category, and full ID
router.get("/equipment/:type/:category/:id", async (req, res) => {
  const { type, category, id } = req.params;

  warn("fix me :(");

  if (
    !["normal", "shiny", "legendary"].includes(type) ||
    !["armor", "weapons"].includes(category)
  ) {
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
      } else {
        res.status(404).send("Item not found");
      }
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get all items data
router.get("/items", async (req, res) => {
  try {
    const items = await Items.findOne().exec();
    res.json(items);
  } catch (err) {
    console.error("Error fetching all items:", err); // Improved error logging
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get items by category
router.get("/items/:category", async (req, res) => {
  const { category } = req.params;

  if (!["materials", "coins", "scrolls", "gems"].includes(category)) {
    return res.status(400).send("Invalid category");
  }

  try {
    const items = await Items.findOne({}, { [category]: 1 }).exec();
    if (items && items[category]) {
      res.json(items[category]);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    console.error("Error fetching items by category:", err); // Improved error logging
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get item by category and ID
router.get("/items/:category/:id", async (req, res) => {
  const { category, id } = req.params;

  if (!["materials", "coins", "scrolls", "gems"].includes(category)) {
    return res.status(400).send("Invalid category");
  }

  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const items = await Items.findOne({}, { [category]: 1 }).exec();
    if (items && items[category]) {
      const item = items[category].find((i) => i.id === id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).send("Item not found");
      }
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Get all monsters
router.get("/monsters", async (req, res) => {
  try {
    const monsters = await Monster.find().exec(); // Query for all monsters
    res.json(monsters);
  } catch (err) {
    console.error("Error fetching monsters:", err);
    res.status(500).send("Error Reading Data");
  }
});

// Get monsters by category
router.get("/monsters/:category", async (req, res) => {
  const { category } = req.params;

  // Validate category format
  if (!["Normal", "Shiny", "Boss"].includes(category)) {
    return res.status(400).send("Invalid category");
  }

  try {
    const monsters = await Monster.findOne({}, { [category]: 1 }).exec();
    if (monsters && monsters[category]) {
      res.json(monsters[category]);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    console.error("Error fetching monsters by category:", err);
    res.status(500).send("Error Reading Data");
  }
});

// Get monster by exact ID across all categories
router.get("/monsters/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch all monsters and check each category
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

    // If no monster was found in any category
    res.status(404).send("Monster not found");
  } catch (err) {
    console.error("Error fetching monster by ID:", err);
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

  // Convert category to title case for matching with MongoDB schema
  category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  // Validate category format
  if (!["Normal", "Shiny", "Boss"].includes(category)) {
    return res.status(400).send("Invalid category");
  }

  // Extract numeric part from ID
  const numericId = extractNumericId(id);
  if (!numericId) {
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
      } else {
        res.status(404).send("Monster not found");
      }
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    console.error("Error fetching monster by category and numeric ID:", err);
    res.status(500).send("Error Reading Data");
  }
});

module.exports = router;
