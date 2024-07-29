const mongoose = require("mongoose");
const logger = require("../logger"); // Import the logger

// Define the schema for enchantments
const enchantSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  effect: String,
});

// Define the schema for gem sockets
const gemSocketSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  socketType: String,
  quantity: Number,
});

// Define the schema for crafting materials
const craftingMaterialSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  quantity: Number,
});

// Define the schema for crafting details
const craftingSchema = new mongoose.Schema({
  requiredMaterials: [craftingMaterialSchema],
  craftingTime: String,
  requiredLevel: Number,
  _id: mongoose.Schema.Types.ObjectId,
});

// Define the schema for equipment items
const equipmentItemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: String,
  name: String,
  rarity: String,
  description: String,
  stats: {
    defense: Number,
    attack: Number,
    weight: Number,
  },
  enchants: [enchantSchema],
  gemSockets: [gemSocketSchema],
  attributes: {
    strength: Number,
    agility: Number,
    intelligence: Number,
  },
  crafting: craftingSchema,
});

// Define the schema for the equipment collection
const equipmentSchema = new mongoose.Schema({
  normal: {
    armor: {
      type: Map,
      of: equipmentItemSchema,
    },
    weapons: {
      type: Map,
      of: equipmentItemSchema,
    },
  },
  shiny: {
    armor: {
      type: Map,
      of: equipmentItemSchema,
    },
    weapons: {
      type: Map,
      of: equipmentItemSchema,
    },
  },
  legendary: {
    armor: {
      type: Map,
      of: equipmentItemSchema,
    },
    weapons: {
      type: Map,
      of: equipmentItemSchema,
    },
  },
  _id: mongoose.Schema.Types.ObjectId,
});

// Create the model for equipment
const Equipment = mongoose.model("Equipment", equipmentSchema);

// Log schema creation or significant changes
logger.log(
  "equipmentDB.js",
  "Equipment schemas defined and model created.",
  "info"
);

module.exports = Equipment;
