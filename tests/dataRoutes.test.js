const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const dataRoutes = require('../routes/dataRoutes'); // Adjust the path as needed

// Use the routes in your Express app
app.use('/api', dataRoutes);

// Mock data
const mockData = {
  items: [
    { item_id: 'item001', name: 'Healing Potion', type: 'consumable', description: 'Restores 50 HP.', effect: { restore_health: 50 }, rarity: 'common' },
    { item_id: 'item002', name: 'Mana Elixir', type: 'consumable', description: 'Restores 30 MP.', effect: { restore_mana: 30 }, rarity: 'rare' }
  ],
  equipment: [
    { equipment_id: 'equip001', name: 'Iron Sword', type: 'weapon', description: 'A sturdy sword made of iron.', attributes: { attack_power: 25, durability: 100 }, rarity: 'uncommon' },
    { equipment_id: 'equip002', name: 'Steel Shield', type: 'shield', description: 'A solid shield crafted from steel.', attributes: { defense_power: 20, durability: 150 }, rarity: 'rare' },
    { equipment_id: 'equip003', name: 'Mage\'s Robe', type: 'armor', description: 'A robe worn by mages that enhances magical abilities.', attributes: { defense_power: 10, magic_boost: 15 }, rarity: 'epic' }
  ],
  achievements: [
    { achievement_id: 'ach001', name: 'First Dungeon Completion', description: 'Complete your first dungeon.', criteria: { dungeon_completions: 1 }, reward: { gold: 500, item_id: 'item001' } },
    { achievement_id: 'ach002', name: 'Master Warrior', description: 'Reach level 50.', criteria: { level: 50 }, reward: { gold: 1000, equipment_id: 'equip001' } },
    { achievement_id: 'ach003', name: 'Dungeon Conqueror', description: 'Complete all dungeons up to level 10.', criteria: { dungeon_levels_completed: 10 }, reward: { gold: 2000, equipment_id: 'equip002' } }
  ]
};

// Mock fs.readFile to return mock data
jest.mock('fs');
fs.readFile.mockImplementation((path, encoding, callback) => {
  callback(null, JSON.stringify(mockData));
});

describe('Database API', () => {
  it('should get all data', async () => {
    const response = await request(app).get('/api/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should get all items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData.items);
  });

  it('should get an item by ID', async () => {
    const response = await request(app).get('/api/items/item001');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData.items[0]);
  });

  it('should return 404 for non-existent item', async () => {
    const response = await request(app).get('/api/items/nonexistent');
    expect(response.statusCode).toBe(404);
  });

  it('should get all equipment', async () => {
    const response = await request(app).get('/api/equipment');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData.equipment);
  });

  it('should get equipment by ID', async () => {
    const response = await request(app).get('/api/equipment/equip001');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData.equipment[0]);
  });

  it('should return 404 for non-existent equipment', async () => {
    const response = await request(app).get('/api/equipment/nonexistent');
    expect(response.statusCode).toBe(404);
  });

  it('should get all achievements', async () => {
    const response = await request(app).get('/api/achievements');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData.achievements);
  });

  it('should get achievement by ID', async () => {
    const response = await request(app).get('/api/achievements/ach001');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData.achievements[0]);
  });

  it('should return 404 for non-existent achievement', async () => {
    const response = await request(app).get('/api/achievements/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});
