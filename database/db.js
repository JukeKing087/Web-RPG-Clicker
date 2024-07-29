// database/db.js

const mongoose = require("mongoose");
const logger = require("../logger"); // Adjust the path to where your logger is located

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://NazaRepr:Ace087Ace0807!@cluster0.7x4blwu.mongodb.net/gameDatabase",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    logger.log("db.js", "MongoDB connected successfully", "info");
  } catch (err) {
    logger.log("db.js", `Error connecting to MongoDB: ${err.message}`, "error");
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
