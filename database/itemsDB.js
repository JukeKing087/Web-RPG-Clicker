const mongoose = require("mongoose");
const logger = require("../logger"); // Import the logger

// Define the schema for each type of item
const itemSchema = new mongoose.Schema({
  id: String,
  effect: String,
});

const coinSchema = new mongoose.Schema({
  id: String,
  value: Number,
});

const scrollSchema = new mongoose.Schema({
  id: String,
  effect: String,
});

const gemSchema = new mongoose.Schema({
  id: String,
  effect: String,
});

const itemsSchema = new mongoose.Schema({
  materials: {
    type: Map,
    of: itemSchema,
  },
  cols: {
    type: Map,
    of: coinSchema,
  },
  scrolls: {
    type: Map,
    of: scrollSchema,
  },
  gems: {
    type: Map,
    of: gemSchema,
  },
});

// Create and export the Items model
const Items = mongoose.model("Items", itemsSchema);

// Log schema creation or significant changes
logger.log("itemDB", "Items schemas defined and model created.", "info");

module.exports = Items;
