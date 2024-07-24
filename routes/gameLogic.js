const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Game logic route
router.post('/click', (req, res) => {
    const monstersPath = path.join(__dirname, '../database/monsters.json');
    const monstersData = JSON.parse(fs.readFileSync(monstersPath, 'utf8'));
    const goblinData = monstersData.Normal.Goblin;

    const enemy = {
        name: goblinData.name,
        level: goblinData.stats.level || 1,
        attack: goblinData.stats.attack,
        defense: goblinData.stats.defense,
        health: goblinData.stats.health
    };

    res.json(enemy); // Respond with JSON data
});


// Endpoint to fetch enemy data
router.get('/enemy', (req, res) => {
    const monstersPath = path.join(__dirname, '../database/monsters.json');
    const monstersData = JSON.parse(fs.readFileSync(monstersPath, 'utf8'));

    const goblinData = monstersData.Normal.Goblin;

    const enemy = {
        name: goblinData.name,
        level: goblinData.stats.level || 1,
        attack: goblinData.stats.attack,
        defense: goblinData.stats.defense,
        health: goblinData.stats.health
    };

    console.log('Enemy data:', enemy); // Debugging line
    res.json(enemy);
});


module.exports = router;
