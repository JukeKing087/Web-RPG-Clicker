# Blog
## Day One:
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

## Day Two:
1. Working on the database for monsters, just finished up the Goblin. I'm starting to think this is going to take while. Please continue the database with this chat:

[The chatGPT chat link](https://chatgpt.com/c/41246f33-8b1d-4b3e-8952-d5c6d936728a)

For Day 3: Think if we should have a boss after every dungeon or ever so often

# Notes

## Drop System:
   I am currently in the process of overhauling the drop system completely. My goal is to have the database populated with a comprehensive list of monsters. Each monster should have a designated drop rate for both items and equipment, allowing for a varied loot table. The list of items that can be dropped by monsters should include their respective drop rates, ensuring that all necessary details are readily available without the need for additional searches. In terms of drop chances, I aim to assign a fixed probability to each monster, such as a 30% chance for loot drops. The drop system will then take into account the probabilities for both equipment and items, which must collectively add up to 100% (e.g., 20% for equipment and 80% for items). While multiple drops are a possibility, duplicates of the same item should be avoided unless explicitly specified. The likelihood of receiving double loot is quite rare, with chances ranging from 5 to 15 times the monster's base drop rate (e.g., a 30% drop rate multiplied by 5 equals a 1.5% chance for double loot after all other calculations, falling within the 5-15 range to introduce an element of randomness). Below is the database structure: [insert database content]. Currently, I am utilizing express.js, tailwind css, postman for database debugging, jest for automated database testing, uuid for player identification, ejs for templating, bcrypt for player data security, nodemon for website testing, and all other necessary dependencies for these primary projects.
## Template for Items:
- Enchantments -
	Count: Typically, 1 to 3 enchantments per item. For items without enchantments, 	it will be 0.
- Gem Sockets -
	Count: 1 to 3 sockets per item, depending on item type and rarity. For items 	without gem sockets, it will be 0.
- Attributes -
	Count: Common attributes include strength, agility, and intelligence. You can 	have up to 3 or more attributes depending on the item, with a placeholder value 	of 0 for items that don’t use attributes.
- Crafting -
	Count: Usually 1 crafting recipe per item, but you might include additional 	crafting requirements if needed. If the item is not craftable or doesn’t require 	crafting, it will be 0 materials and empty fields.
## Boss:
- Boss has it's own **Named** items.