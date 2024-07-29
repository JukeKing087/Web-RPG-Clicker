const mongoose = require("mongoose");

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
  coins: {
    // Changed from `cols` to `coins`
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

const Items = mongoose.model("Items", itemsSchema);

module.exports = Items;
