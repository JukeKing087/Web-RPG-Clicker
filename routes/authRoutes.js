const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../database/users.json');

// Utility function to read the database
const readDatabase = () => {
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
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readDatabase();

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    // Set session or JWT token here if needed
    res.redirect('/'); // Redirect to the home page or dashboard after login
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Handle signup POST request
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const users = readDatabase();

  const existingUser = users.find(user => user.username === username || user.email === email);
  if (existingUser) {
    res.render('signup', { error: 'Username or email already exists' });
  } else {
    const newUser = { username, email, password };
    users.push(newUser);
    writeDatabase(users);
    res.redirect('/login'); // Redirect to the login page after signup
  }
});

module.exports = router;
