const express = require("express");
const passport = require("../passportConfig");
const User = require("../database/userDB");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      account: [
        {
          id: uuidv4(),
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        },
      ],
      player: {
        name: req.body.username,
        level: 1,
        experience: 0,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        stats: {
          strength: 0,
          agility: 0,
          intelligence: 0,
          endurance: 0,
          charisma: 0,
        },
        inventory: [],
        equipment: [],
        skills: [],
        statusEffects: [],
        quests: [],
        achievements: [],
        faction: null,
        social: {
          friends: [],
          guild: null,
        },
        settings: {
          sound: true,
          graphicsQuality: "medium",
        },
      },
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.redirect("/signup");
  }
});

// Login route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
