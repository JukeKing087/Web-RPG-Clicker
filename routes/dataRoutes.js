const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the JSON file
const dbPath = path.join(__dirname, '../database/database.json');

// Helper function to read JSON data
const readData = (callback) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    });
};

// Get all data
router.get('/', (req, res) => {
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            res.json(data);
        }
    });
});

// Get all items
router.get('/items', (req, res) => {
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            res.json(data.items);
        }
    });
});

// Get a specific item by ID
router.get('/items/:item_id', (req, res) => {
    const { item_id } = req.params;
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            const item = data.items.find(i => i.item_id === item_id);
            if (item) {
                res.json(item);
            } else {
                res.status(404).send('Item not found');
            }
        }
    });
});

// Get all equipment
router.get('/equipment', (req, res) => {
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            res.json(data.equipment);
        }
    });
});

// Get a specific equipment by ID
router.get('/equipment/:equipment_id', (req, res) => {
    const { equipment_id } = req.params;
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            const equipment = data.equipment.find(e => e.equipment_id === equipment_id);
            if (equipment) {
                res.json(equipment);
            } else {
                res.status(404).send('Equipment not found');
            }
        }
    });
});

// Get all achievements
router.get('/achievements', (req, res) => {
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            res.json(data.achievements);
        }
    });
});

// Get a specific achievement by ID
router.get('/achievements/:achievement_id', (req, res) => {
    const { achievement_id } = req.params;
    readData((err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            const achievement = data.achievements.find(a => a.achievement_id === achievement_id);
            if (achievement) {
                res.json(achievement);
            } else {
                res.status(404).send('Achievement not found');
            }
        }
    });
});

module.exports = router;
