const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the JSON file
const equipmentPath = path.join(__dirname, '../database/equipment.json');
const itemsPath = path.join(__dirname, '../database/items.json');
const monstersPath = path.join(__dirname, '../database/monsters.json');

// Helper Function to read JSON data
const readData = (filePath, callback) =>
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    });

// Get equipment data
router.get('/equipment', (req, res) => {
    readData(equipmentPath, (err, data) => {
        if (err) {
            res.status(500).send('Error Reading Data')
        } else {
            res.json(data)
        }
    })
})

// Get equipment by prefix
router.get('/equipment/:prefix/', (req, res) => {
    const { prefix } = req.params;

    // Validate prefix format
    if (!['ENA', 'ENW', 'ESA', 'ESW'].includes(prefix)) {
        return res.status(400).send('Invalid prefix');
    }

    readData(equipmentPath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            const category = {
                'ENA': 'normal',
                'ENW': 'normal',
                'ESA': 'shiny',
                'ESW': 'shiny'
            }[prefix];

            const subcategory = {
                'ENA': 'armor',
                'ENW': 'weapons',
                'ESA': 'armor',
                'ESW': 'weapons'
            }[prefix];

            const categoryData = data[category];
            let items = [];

            // Search within a specific subcategory
            if (subcategory && categoryData[subcategory]) {
                items = Object.values(categoryData[subcategory]).filter(item =>
                    item.id.startsWith(prefix) && item.id.length === prefix.length + 1
                );
            }

            // Send response based on whether items were found
            if (items.length > 0) {
                res.json(items);
            } else {
                res.status(404).send('No equipment found for the given prefix');
            }
        }
    });
});

// Get equipment by prefix and numeric ID
router.get('/equipment/:prefix/:id', (req, res) => {
    const { prefix, id } = req.params;

    // Validate prefix format
    if (!['ENA', 'ENW', 'ESA', 'ESW'].includes(prefix)) {
        return res.status(400).send('Invalid prefix');
    }

    // Validate that ID is numeric
    if (!/^\d+$/.test(id)) {
        return res.status(400).send('Invalid ID format');
    }

    readData(equipmentPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }

        const category = {
            'ENA': 'normal',
            'ENW': 'normal',
            'ESA': 'shiny',
            'ESW': 'shiny'
        }[prefix];

        const subcategory = {
            'ENA': 'armor',
            'ENW': 'weapons',
            'ESA': 'armor',
            'ESW': 'weapons'
        }[prefix] || null;

        const categoryData = data[category];
        let items = [];

        if (subcategory) {
            // Search within a specific subcategory
            if (categoryData[subcategory]) {
                items = Object.values(categoryData[subcategory]).filter(item =>
                    item.id.endsWith(id) // Only match numeric ID
                );
            }
        } else {
            // Search within all subcategories of the category
            for (const type in categoryData) {
                if (categoryData.hasOwnProperty(type)) {
                    items.push(...Object.values(categoryData[type]).filter(item =>
                        item.id.endsWith(id) // Only match numeric ID
                    ));
                }
            }
        }

        // Send response based on whether items were found
        if (items.length > 0) {
            res.json(items);
        } else {
            res.status(404).send('Equipment not found');
        }
    });
});

// Get all items data
router.get('/items', (req, res) => {
    readData(itemsPath, (err, data) => {
        if (err) {
            res.status(500).send('Error Reading Data');
        } else {
            res.json(data);
        }
    });
});

// Get items by category
router.get('/items/:category', (req, res) => {
    const { category } = req.params;

    // Validate category format
    if (!['IM', 'IC', 'IS', 'IG'].includes(category)) {
        return res.status(400).send('Invalid category');
    }

    readData(itemsPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error Reading Data');
        }

        const categoryData = data[{
            'IM': 'materials',
            'IC': 'cols',
            'IS': 'scrolls',
            'IG': 'gems'
        }[category]];

        if (categoryData) {
            res.json(categoryData);
        } else {
            res.status(404).send('Category not found');
        }
    });
});

// Get items by category and numeric ID
router.get('/items/:category/:id', (req, res) => {
    const { category, id } = req.params;

    // Validate category format
    if (!['IM', 'IC', 'IS', 'IG'].includes(category)) {
        return res.status(400).send('Invalid category');
    }

    // Validate that ID is numeric
    if (!/^\d+$/.test(id)) {
        return res.status(400).send('Invalid ID format');
    }

    readData(itemsPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error Reading Data');
        }

        const categoryData = data[{
            'IM': 'materials',
            'IC': 'cols',
            'IS': 'scrolls',
            'IG': 'gems'
        }[category]];

        if (!categoryData) {
            return res.status(404).send('Category not found');
        }

        // Find item by numeric ID
        const item = Object.values(categoryData).find(item => item.id.endsWith(id));
        if (item) {
            res.json(item);
        } else {
            res.status(404).send('Item not found');
        }
    });
});

// Get monster data
router.get('/monsters', (req, res) => {
    readData(monstersPath, (err, data) => {
        if (err) {
            res.status(500).send('Error Reading Data')
        } else {
            res.json(data)
        }
    })
})

// Get monsters by category
router.get('/monsters/:category', (req, res) => {
    const { category } = req.params;

    // Validate category format
    if (!['MN', 'MS', 'MB'].includes(category)) {
        return res.status(400).send('Invalid category');
    }

    readData(monstersPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error Reading Data');
        }

        const categoryData = data[{
            'MN': 'Normal',
            'MS': 'Shiny',
            'MB': 'Boss'
        }[category]];

        if (categoryData) {
            res.json(categoryData);
        } else {
            res.status(404).send('Category not found');
        }
    });
});

// Get monsters by category and numeric ID
router.get('/monsters/:category/:id', (req, res) => {
    const { category, id } = req.params;

    // Validate category format
    if (!['MN', 'MS', 'MB'].includes(category)) {
        return res.status(400).send('Invalid category');
    }

    // Validate that ID is numeric
    if (!/^\d+$/.test(id)) {
        return res.status(400).send('Invalid ID format');
    }

    readData(monstersPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error Reading Data');
        }

        const categoryData = data[{
            'MN': 'Normal',
            'MS': 'Shiny',
            'MB': 'Boss'
        }[category]];

        if (!categoryData) {
            return res.status(404).send('Category not found');
        }

        // Find monster by numeric ID
        const monster = Object.values(categoryData).find(monster => monster.id.endsWith(id));
        if (monster) {
            res.json(monster);
        } else {
            res.status(404).send('Monster not found');
        }
    });
});


/*
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
*/

module.exports = router;
