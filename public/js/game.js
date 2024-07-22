let player = {
    id: Number,
    name: String,
    level: Number,
    experience: Number,
    health: Number,
    maxHealth: Number,
    mana: Number,
    maxMana: Number,

    // Stats
    stats: {
        strength: 15,      // Determines physical damage
        agility: 12,       // Affects speed and evasion
        intelligence: 18,  // Influences magic power
        endurance: 14,     // Affects maximum health and stamina
        charisma: 10       // Influences interactions and persuasion
    },

    inventory: [
        { itemId: 'sword01', name: 'Sword', quantity: 1 },
        { itemId: 'potion01', name: 'Health Potion', quantity: 3 }
    ],

    skills: [
        { skillId: 'fireball', name: 'Fireball', level: 3 },
        { skillId: 'heal', name: 'Heal', level: 2 }
    ],

    position: { x: 200, y: 300 },

    statusEffects: [
        { effectId: 'poisoned', duration: 3 }
    ],

    quests: [
        { questId: 'quest01', name: 'Defeat the Dragon', status: 'inProgress' }
    ],

    achievements: [
        { achievementId: 'firstKill', name: 'First Kill', dateUnlocked: '2024-07-21' }
    ],

    faction: 'Knights of Valor',

    social: {
        friends: ['player2', 'player3'],
        guild: 'EpicGuild'
    },

    settings: {
        sound: true,
        graphicsQuality: 'high'
    }
};
