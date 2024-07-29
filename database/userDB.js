const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// Define the Stats schema
const StatsSchema = new Schema(
  {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    endurance: { type: Number, default: 0 },
    charisma: { type: Number, default: 0 },
  },
  { _id: false }
);

// Define the Social schema
const SocialSchema = new Schema(
  {
    friends: { type: [String], default: [] },
    guild: { type: String, default: null },
  },
  { _id: false }
);

// Define the Settings schema
const SettingsSchema = new Schema(
  {
    sound: { type: Boolean, default: true },
    graphicsQuality: { type: String, default: "medium" },
  },
  { _id: false }
);

// Define the Attributes schema
const AttributesSchema = new Schema(
  {
    shinySpawnChance: { type: Number, default: 1000 },
    area: { type: String, default: "village" },
  },
  { _id: false }
);

// Define the Currency schema
const CurrencySchema = new Schema(
  {
    bronzeCols: { type: Number, default: 0 },
    silverCols: { type: Number, default: 0 },
    goldCols: { type: Number, default: 0 },
    platinumCols: { type: Number, default: 0 },
  },
  { _id: false }
);

// Define the Player schema
const PlayerSchema = new Schema(
  {
    name: { type: String, required: true },
    cols: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
    maxMana: { type: Number, default: 50 },
    stats: { type: StatsSchema, default: () => ({}) },
    inventory: { type: [String], default: [] },
    equipment: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    statusEffects: { type: [String], default: [] },
    quests: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    faction: { type: String, default: null },
    social: { type: SocialSchema, default: () => ({}) },
    settings: { type: SettingsSchema, default: () => ({}) },
    attributes: { type: AttributesSchema, default: () => ({}) },
    currency: { type: CurrencySchema, default: () => ({}) }, // Add currency here
  },
  { _id: false }
);

// Define the Account schema
const AccountSchema = new Schema(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { _id: false }
);

// Define the User schema
const UserSchema = new Schema({
  account: { type: [AccountSchema], required: true },
  player: { type: PlayerSchema, required: true },
});

// Create and export the User model
const User = model("User", UserSchema);

module.exports = User;
