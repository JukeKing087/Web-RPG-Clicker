const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../logger"); // Import the logger

// Define the schema for monsters in each area
const monsterSchema = new Schema({
  normal: {
    type: Map,
    of: new Schema(
      {
        id: String,
        chance: Number,
      },
      { _id: false }
    ),
  },
  shiny: {
    type: Map,
    of: new Schema(
      {
        id: String,
        chance: Number,
      },
      { _id: false }
    ),
  },
  boss: {
    type: Map,
    of: new Schema(
      {
        id: String,
        chance: Number,
      },
      { _id: false }
    ),
  },
});

// Define the schema for NPCs
const npcSchema = new Schema(
  {
    id: String,
    name: String,
    description: String,
    dialogue: [String],
  },
  { _id: false }
);

// Define the schema for random events
const randomEventSchema = new Schema(
  {
    id: String,
    name: String,
    description: String,
    chance: Number,
    events: [String],
  },
  { _id: false }
);

// Define the schema for each area
const areaSchema = new Schema({
  name: String,
  id: String,
  monsters: monsterSchema,
  NPCs: {
    type: Map,
    of: npcSchema,
  },
  randomEvents: {
    type: Map,
    of: randomEventSchema,
  },
});

// Define the schema for the database
const areaDBSchema = new Schema({
  areas: [areaSchema],
});

// Create and export the model
const AreaDB = mongoose.model("Areas", areaDBSchema);

// Log schema creation or significant changes
logger.log("areaDB.js", "Area schemas defined and model created.", "info");

module.exports = AreaDB;
