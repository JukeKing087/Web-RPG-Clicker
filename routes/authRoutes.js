const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dbPath = path.join(__dirname, '../database/users.json');

// Utility function to read the database
const readDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    // Initialize with an empty array if the file does not exist
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
  }
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Utility function to write to the database
const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Handle GET request for login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle GET request for signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle login POST request
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readDatabase();

  // Find user by username
  const user = users.find(user => user.account.some(acc => acc.username === username));
  
  if (user) {
    const account = user.account.find(acc => acc.username === username);
    if (await bcrypt.compare(password, account.password)) {
      // Set session or JWT token here if needed
      res.redirect('/'); // Redirect to the home page or dashboard after login
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Handle signup POST request
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const users = readDatabase();

  // Check if the username or email already exists
  const existingUser = users.find(user => 
    user.account.some(acc => acc.username === username || acc.email === email)
  );

  if (existingUser) {
    res.render('signup', { error: 'Username or email already exists' });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      account: [{
        id: uuidv4(), // Unique account ID
        username,
        email,
        password: hashedPassword
      }],
      player: {
        name: username,
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
          charisma: 0
        },
        inventory: [],
        skills: [],
        statusEffects: [],
        quests: [],
        achievements: [],
        faction: null,
        social: {
          friends: [],
          guild: null
        },
        settings: {
          sound: true,
          graphicsQuality: 'medium'
        }
      }
    };
    users.push(newUser);
    writeDatabase(users);
    res.redirect('/login'); // Redirect to the login page after signup
  }
});

module.exports = router;
