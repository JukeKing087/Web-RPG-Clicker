const mongoose = require("mongoose");

// Define the ability schema
const abilitySchema = new mongoose.Schema(
  {
    name: String,
    effect: String,
    damageBonus: Number,
    condition: String,
    duration: Number,
    evasionIncrease: Number,
    speedIncrease: Number,
    knockbackDistance: Number,
    healthRegen: Number,
    damageReduction: Number,
    dazzleChance: Number,
    defenseIncrease: Number,
    damageReflection: Number,
  },
  { _id: false }
);

// Define the drop schema
const dropSchema = new mongoose.Schema(
  {
    id: String,
    chance: Number,
  },
  { _id: false }
);

// Define the stats schema
const statsSchema = new mongoose.Schema(
  {
    health: Number,
    attack: Number,
    defense: Number,
    speed: Number,
  },
  { _id: false }
);

// Define the monster schema
const monsterSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    stats: statsSchema,
    abilities: [abilitySchema],
    drops: {
      type: Map,
      of: dropSchema,
    },
  },
  { _id: false }
);

// Define the monsters collection schema
const monstersSchema = new mongoose.Schema({
  Normal: {
    type: Map,
    of: monsterSchema,
  },
  Shiny: {
    type: Map,
    of: monsterSchema,
  },
  Boss: {
    type: Map,
    of: monsterSchema,
  },
});

const Monster = mongoose.model("Monster", monstersSchema);

module.exports = Monster;
