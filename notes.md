# Blog

## Day One

1. Make the database of items, abilities, skills, monsters and such
2. update user saves and stuff like that, (database routes and such)
3. start to make ideas for the game.js file, use modules like drop system to make it more helpful
4. make the drop system since the game will be based on that
5. mess with variables and such to make game more balanced
6. make some simple tweaks and optimize game (ie: throw all the code into GPT to see if it can revise it :skull:)
7. OPTIONAL
    1. learn react
    2. static Site
    3. Post on Github

- OR
    1. Use vite site

## Day Two

1. Working on the database for monsters, just finished up the Goblin. I'm starting to think this is going to take while. Please continue the database with this chat:

[The chatGPT chat link](https://chatgpt.com/c/41246f33-8b1d-4b3e-8952-d5c6d936728a)

For Day 3: Think if we should have a boss after every dungeon or ever so often

## Day Two Part 2

1. Lots has happened, Internet is out now so I can't code anymore so im going to make a commit for where it is non after this. The game works well. but I still haven't made it enought to cross of the first task from day 1, I think im going to focus on small things right now instead of cool guis and animations. might look bad, but it will be much better to do after all my ideas are working in the code. SO now im going to list what I got done and add to the notes for ideas. I have the database working really well, the last 5 hours I coded the gameLogic so the dropped items would go to the inventory tab. IT WAS A PAIN IN THE A$$! Loving where this is going tho. Tomorrow I should work on the index.ejs before anything. Well added ideas and a need to do.

## Day Three

1. Kyle was over today, we ramped the jumps and I have a mild wrist sprain so I didn't get to code much. Authorization completely works now. I got the database on MongoDB now im transferring the reading to it. soon ill have to use /database/:prefix/:id to get items and monsters. Right now I have to do the items and equipment after I get the monster reading to work, I also think I going to do the monster chooser by hand based on "Maps/Areas". 

## Day Four

Not much as happened. took 5 hours to get some json to work. now im going to have to get the /users to work. Pain in the ass. no clue what im doing. i wish it was so much easier. wrist still hurts too. feels like im completely redoing all my code. had a working drop system back on day 2 and a working /database

# Notes

## Drop System

   I am currently in the process of overhauling the drop system completely. My goal is to have the database populated with a comprehensive list of monsters. Each monster should have a designated drop rate for both items and equipment, allowing for a varied loot table. The list of items that can be dropped by monsters should include their respective drop rates, ensuring that all necessary details are readily available without the need for additional searches. In terms of drop chances, I aim to assign a fixed probability to each monster, such as a 30% chance for loot drops. The drop system will then take into account the probabilities for both equipment and items, which must collectively add up to 100% (e.g., 20% for equipment and 80% for items). While multiple drops are a possibility, duplicates of the same item should be avoided unless explicitly specified. The likelihood of receiving double loot is quite rare, with chances ranging from 5 to 15 times the monster's base drop rate (e.g., a 30% drop rate multiplied by 5 equals a 1.5% chance for double loot after all other calculations, falling within the 5-15 range to introduce an element of randomness). Below is the database structure: [insert database content]. Currently, I am utilizing express.js, tailwind css, postman for database debugging, jest for automated database testing, uuid for player identification, ejs for templating, bcrypt for player data security, nodemon for website testing, and all other necessary dependencies for these primary projects.

## Template for Items

- Enchantments -
 Count: Typically, 1 to 3 enchantments per item. For items without enchantments,  it will be 0.
- Gem Sockets -
 Count: 1 to 3 sockets per item, depending on item type and rarity. For items  without gem sockets, it will be 0.
- Attributes -
 Count: Common attributes include strength, agility, and intelligence. You can  have up to 3 or more attributes depending on the item, with a placeholder value  of 0 for items that don’t use attributes.
- Crafting -
 Count: Usually 1 crafting recipe per item, but you might include additional  crafting requirements if needed. If the item is not craftable or doesn’t require  crafting, it will be 0 materials and empty fields.

## Boss

- Boss has it's own **Named** items.

## Ideas

- Diablo or any other RPG-like game's hover over item GUI

# **NEED TO DO**

- WORKING /users
- WORKING /database
- Test changing areas
- Working click
- working drop system
- MAKE THE DROP CHANCE ACTUALLY HAVE CHANCE NOT 100%
1. **Home Screen**
3. **MAKE THE MONSTERS HAVE RANGES OF LEVELS AND STATS**
