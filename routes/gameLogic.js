const express = require('express');
const axios = require('axios');
const router = express.Router();

// Game logic route
router.post('/click', async (req, res) => {
    try {
        // Fetch monster data from the API
        const response = await axios.get('http://localhost:3000/database/monsters/MN/1');
        const monsterData = response.data;

        // Use the monster data in your game logic
        // For example, you might want to check the monster's attributes, calculate damage, etc.
        const result = `Fetched monster: ${JSON.stringify(monsterData)}`;
        
        res.json({ message: result });
    } catch (error) {
        console.error('Error fetching monster data:', error);
        res.status(500).send('Error fetching monster data');
    }
});

module.exports = router;
