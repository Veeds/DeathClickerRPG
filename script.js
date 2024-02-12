// Game variables
const monsters = [
    {
        name: "Monster1",
        health: 100,
        maxHealth: 100,
        defense: 1,
        criticalStrike: 0.1,
        strength: 1,
        accuracy: 0.8,
        evasion: 0.1,
        criticalHitChance: 0.1,
        criticalHitDamageMultiplier: 2,
        lifesteal: 0.0,
        monsterArmor: 1,
        statusEffects: [],
        image: "monster1.png",
		drops: [
            { name: "Health Potion", type: "consumable", effect: { health: 20 } },
            // Add more items as needed
        ],
        dropRate: 0.3, // Probability of getting drops (0.0 to 1.0)
    },
    {
        name: "Monster2",
        health: 120,
        maxHealth: 120,
        defense: 2,
        criticalStrike: 0.15,
        strength: 2,
        accuracy: 0.7,
        evasion: 0.2,
        criticalHitChance: 0.15,
        criticalHitDamageMultiplier: 1.5,
        lifesteal: 0.00,
        monsterArmor: 2,
        statusEffects: [],
        image: "monster2.png",
		drops: [
            { name: "Health Potion", type: "consumable", effect: { health: 20 } },
            // Add more items as needed
        ],
        dropRate: 0.3, // Probability of getting drops (0.0 to 1.0)
    },
    {
        name: "Monster3",
        health: 120,
        maxHealth: 120,
        defense: 2,
        criticalStrike: 0.15,
        strength: 2,
        accuracy: 0.7,
        evasion: 0.2,
        criticalHitChance: 0.15,
        criticalHitDamageMultiplier: 1.5,
        lifesteal: 0.00,
        monsterArmor: 2,
        statusEffects: [],
        image: "monster3.png",
		drops: [
            { name: "Health Potion", type: "consumable", effect: { health: 20 } },
            // Add more items as needed
        ],
        dropRate: 0.3, // Probability of getting drops (0.0 to 1.0)
    },
    {
        name: "Monster4",
        health: 75,
        maxHealth: 75,
        defense: 4,
        criticalStrike: 0.20,
        strength: 4,
        accuracy: 0.7,
        evasion: 0.2,
        criticalHitChance: 0.15,
        criticalHitDamageMultiplier: 1.5,
        lifesteal: 0.00,
        monsterArmor: 2,
        statusEffects: [],
        image: "monster4.png",
		drops: [
            { name: "Health Potion", type: "consumable", effect: { health: 20 } },
            // Add more items as needed
        ],
        dropRate: 0.3, // Probability of getting drops (0.0 to 1.0)
    },
    {
        name: "Monster5",
        health: 75,
        maxHealth: 75,
        defense: 4,
        criticalStrike: 0.20,
        strength: 4,
        accuracy: 0.7,
        evasion: 0.2,
        criticalHitChance: 0.15,
        criticalHitDamageMultiplier: 1.5,
        lifesteal: 0.00,
        monsterArmor: 2,
        statusEffects: [],
        image: "monster5.png",
		drops: [
            { name: "Health Potion", type: "consumable", effect: { health: 20 } },
            // Add more items as needed
        ],
        dropRate: 0.3, // Probability of getting drops (0.0 to 1.0)
    },
    // Add more monsters as needed
];

let playerLevel = 1;

function calculateNextLevelExperience(level) {
    return Math.floor(50 * Math.pow(1.2, level - 1));
}

let playerStats = {
    level: playerLevel,
    experience: 0,
    experienceToNextLevel: calculateNextLevelExperience(playerLevel),
    health: 100,
    maxHealth: 100,
    defense: 3,
    criticalStrike: 0.05,
    strength: 8,
    accuracy: 0.8,
    evasion: 0.1,
    criticalHitChance: 0.1,
    criticalHitDamageMultiplier: 2,
    lifesteal: 0.1,
    playerArmor: 2,
    comboMultiplier: 1,
    statusEffects: [],
};

let playerCoins = 0;
let playerExperience = 0;
let maxPlayerHealth = playerStats.maxHealth;
let basePlayerDamage = 5;
let minHealthIncrease = 1;
let maxHealthIncrease = 10;
let currentMonsterIndex;
let monsterCycleIndex = 0;
let playerInventory = []; // Initialize an empty array to store items


// New variables for achievements
let monstersKilled = 0;
let goldCollected = 0;

// Array to store achievements
const achievements = [
    { id: 'monstersKilled10', name: 'Novice Slayer', requirement: 10, unlocked: false },
    { id: 'goldCollected100', name: 'Gold Digger', requirement: 100, unlocked: false },
    // Add more achievements as needed
];

// DOM elements
const monsterImage = document.getElementById('monster-image');
const monsterName = document.getElementById('monster-name');
const monsterHealthBar = document.getElementById('monster-health-bar');

const playerName = document.getElementById('player-name');
const playerHealthBar = document.getElementById('player-health-bar');
const coinDisplay = document.getElementById('coin-display');
const levelDisplay = document.getElementById('level-display');
const defenseDisplay = document.getElementById('defense-display');
const strengthDisplay = document.getElementById('strength-display');
const experienceBar = document.getElementById('player-experience-bar');

const attackButton = document.getElementById('attack-button');
const playerDamageDisplay = document.getElementById('player-damage-display');
const enemyDamageDisplay = document.getElementById('enemy-damage-display');
const coinsDisplay = document.getElementById('coins-display');

const achievementsList = document.getElementById('achievements-list');

attackButton.addEventListener('click', () => {
    handleAttack();
});

resetGame();

// Event listener for the "Attack" button
attackButton.addEventListener('click', () => {
    handleAttack();
});

// Event listener for using a Health Potion
const useHealthPotionButton = document.getElementById('useHealthPotionButton');
if (useHealthPotionButton) {
    useHealthPotionButton.addEventListener('click', () => {
        useItem('Health Potion');
    });
}


function openModal() {
    const modal = document.getElementById('nameModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('nameModal');
    modal.style.display = 'none';
}

function setPlayerName() {
    const inputElement = document.getElementById('playerNameInput');
    const newName = inputElement.value.trim();

    if (newName !== '') {
        playerName.textContent = `Player: ${newName}`;
        playerStats.name = newName;
        closeModal();
    }
}

function updateMonsterName() {
    const monsterContainer = document.getElementById('monster-container');
    const monsterNameElement = document.getElementById('monster-name');

    if (currentMonsterIndex !== undefined && monsters[currentMonsterIndex]) {
        monsterNameElement.textContent = monsters[currentMonsterIndex].name;
        monsterContainer.style.display = 'block'; // Show the monster container if a monster is present
    } else {
        monsterNameElement.textContent = ''; // Clear the name if there's no monster
        monsterContainer.style.display = 'none'; // Hide the monster container if there's no monster
    }
}

function resetGame() {
    playerLevel = 1;
    playerStats.level = playerLevel;
    playerStats.experience = 0;
    playerStats.experienceToNextLevel = calculateNextLevelExperience(playerLevel);

    playerStats.health = 100;
    playerStats.maxHealth = 100;
    playerStats.defense = 3;
    playerStats.criticalStrike = 0.05;
    playerStats.strength = 8;
    playerStats.accuracy = 0.8;
    playerStats.evasion = 0.1;
    playerStats.criticalHitChance = 0.1;
    playerStats.criticalHitDamageMultiplier = 2;
    playerStats.lifesteal = 0.1;
    playerStats.playerArmor = 2;
    playerStats.comboMultiplier = 1;
    playerStats.statusEffects = [];

    playerCoins = 0;
    playerExperience = 0;
    maxPlayerHealth = playerStats.maxHealth;
    basePlayerDamage = 5;
    minHealthIncrease = 1;
    maxHealthIncrease = 10;
    currentMonsterIndex = undefined;

    monstersKilled = 0;
    goldCollected = 0;
    achievements.forEach(achievement => {
        achievement.unlocked = false;
    });

    // Check if currentMonsterIndex is defined before accessing the image property
    if (currentMonsterIndex !== undefined && monsters[currentMonsterIndex]) {
        monsters[currentMonsterIndex].image = monsters[currentMonsterIndex].image;
    }

    updateUI();
    updateAchievements();

    spawnMonster();
}

function spawnMonster() {
    currentMonsterIndex = Math.floor(Math.random() * monsters.length);
    const monster = monsters[currentMonsterIndex];

    // Ensure the monster has a level property
    monster.level = calculateMonsterLevel();

    monster.name = generateRandomMonsterName();

    const baseStats = {
        1: { maxHealth: 15, defense: 1, strength: 1 },
        2: { maxHealth: 40, defense: 2, strength: 2 },
    };

    const playerLevelStats = baseStats[playerLevel];

    monster.maxHealth = Math.floor(playerLevelStats.maxHealth * (1 + monster.level * 0.2));
    monster.defense = Math.floor(playerLevelStats.defense * (1 + monster.level * 0.15));
    monster.strength = Math.floor(playerLevelStats.strength * (1 + monster.level * 0.1));

    monster.maxHealth = Math.max(5, Math.min(monster.maxHealth, 15));
    monster.health = monster.maxHealth;

    updateMonsterName();
    updateMonsterHealthBar();
}


function updateMonsterImage() {
    const monsterImageElement = document.getElementById('monster-image');
    
    if (currentMonsterIndex !== undefined && monsters[currentMonsterIndex] && 'image' in monsters[currentMonsterIndex]) {
        monsterImageElement.src = monsters[currentMonsterIndex].image;
        monsterImageElement.alt = `Monster Image: ${monsters[currentMonsterIndex].name}`;
    }
}

// Add a function to calculate the monster level
function calculateMonsterLevel() {
    // You can adjust the logic for calculating the monster's level
    // For simplicity, let's set it to the player's level for now
    return playerLevel;
}

function generateRandomMonsterName() {
    const adjectives = ['Fierce', 'Cunning', 'Vicious', 'Thunderous', 'Swift', 'Mystical'];
    const nouns = ['Dragon', 'Serpent', 'Basilisk', 'Chimera', 'Gorgon', 'Wyrm'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
}

function handleAttack() {
    if (currentMonsterIndex !== undefined) {
        playerDamageDisplay.textContent = '';
        enemyDamageDisplay.textContent = '';

        const playerDamage = calculateDamage(playerStats, monsters[currentMonsterIndex]);
        monsters[currentMonsterIndex].health -= playerDamage;

        playerDamageDisplay.textContent = `You dealt ${playerDamage} damage to ${monsters[currentMonsterIndex].name}!`;

        if (monsters[currentMonsterIndex].health <= 0) {
            handleVictory();
        } else {
            const monsterDamage = calculateDamage(monsters[currentMonsterIndex], playerStats);
            playerStats.health -= monsterDamage;

            enemyDamageDisplay.textContent = `${monsters[currentMonsterIndex].name} counterattacks and deals ${monsterDamage} damage!`;

            if (playerStats.health <= 0) {
                handleDefeat();
            }

            updateUI();
        }
    }
}

function calculateDamage(attacker, defender) {
    const baseDamage = attacker.baseDamage || 5; // You can adjust the base damage value
    const criticalHitChance = attacker.criticalStrike || 0.1;
    const isCriticalHit = Math.random() < criticalHitChance;

    const strengthScale = 0.2;
    const defenseScale = 0.1;
    const criticalScale = 0.5;

    let damage = isCriticalHit ? baseDamage * criticalScale : baseDamage;

    // Introduce random variation
    const randomVariation = Math.random() * 1.0 - 0.1; // Adjust the range as needed
    damage += damage * randomVariation;

    damage += attacker.strength * strengthScale;

    if (defender && !defender.isPlayer) {
        damage -= defender.defense * defenseScale;
    }

    damage = Math.max(1, damage);

    return Math.floor(damage);
}


function handleCriticalHit(character, isPlayer) {
    const criticalHitChance = character.criticalHitChance || 0.1;
    const isCriticalHit = Math.random() < criticalHitChance;

    if (isCriticalHit) {
        const criticalMessage = isPlayer ? 'Critical Hit!' : 'Enemy lands a Critical Hit!';
        playerDamageDisplay.textContent += ` ${criticalMessage}`;
    }

    return isCriticalHit ? character.criticalHitDamageMultiplier || 2 : 1;
}


function calculateNextLevelExperience(level) {
    return Math.floor(50 * Math.pow(1.2, level - 1));
}

function calculateNextLevelBaseDamageIncrease() {
    return Math.floor(Math.random() * 5) + 1;
}

function calculateNextLevelStats() {
    playerStats.strength += 2;
    playerStats.maxHealth += 10;
    playerStats.playerArmor += 1;
}

function calculatePlayerNextLevelStats() {
    playerStats.level++;

    // Increase stats based on your desired scaling
    playerStats.strength += 2;
    playerStats.maxHealth += 10;
    playerStats.defense += 1;

    // Refill player's health to full
    playerStats.health = playerStats.maxHealth;
	
	// Update players max health
	maxPlayerHealth = playerStats.maxHealth;
	
	// Update the health display text
    document.getElementById('health-display').textContent = `${playerStats.health} / ${maxPlayerHealth}`;

    // Add scaling for other stats as needed

    playerStats.experienceToNextLevel = calculateNextLevelExperience(playerStats.level);
    updateUI();
}

function applyConsumableEffect(effect) {
    // Update player stats based on the consumable effect
    if (effect.health) {
        playerStats.health = Math.min(playerStats.maxHealth, playerStats.health + effect.health);
    }

    // Add more effects as needed
    updateUI();
}

function handleVictory() {
    playerDamageDisplay.textContent = `You defeated ${monsters[currentMonsterIndex].name} and gained ${Math.floor(monsters[currentMonsterIndex].health)} coins and experience!`;

    playerCoins += Math.abs(Math.floor(monsters[currentMonsterIndex].health));
    const experienceGain = calculateExperienceGain(monsters[currentMonsterIndex].level);
	console.log(`Experience Gain: ${experienceGain}`);

    if (playerStats.experience + experienceGain >= playerStats.experienceToNextLevel) {
        const remainingExperience = playerStats.experience + experienceGain - playerStats.experienceToNextLevel;

        calculatePlayerNextLevelStats();

        playerDamageDisplay.textContent += ` Level up! You are now level ${playerStats.level}!`;
    } else {
        playerStats.experience += experienceGain;
        const experiencePercentage = (playerStats.experience / playerStats.experienceToNextLevel) * 100;
        experienceBar.style.width = `${experiencePercentage}%`;
    }

    // Handle item drops
    if (currentMonsterIndex !== undefined) {
        const monster = monsters[currentMonsterIndex];
        const dropRoll = Math.random();

        if (dropRoll < monster.dropRate) {
            const randomDropIndex = Math.floor(Math.random() * monster.drops.length);
            const droppedItem = monster.drops[randomDropIndex];

            // Log information about the dropped item
            console.log(`Dropped Item: ${droppedItem.name}, Type: ${droppedItem.type}, Effect: ${JSON.stringify(droppedItem.effect)}`);

            // Check if an <li> element with the same name already exists
            const existingItemElement = findItemElementByName(droppedItem.name);

            if (existingItemElement) {
                // Update the quantity if the item already exists
                updateItemQuantity(existingItemElement);
            } else {
                // Create a new <li> element for the dropped item
                const newItemElement = createNewItemElement(droppedItem);

                // Append the new <li> element to the inventory list
                const inventoryList = document.getElementById('inventory-list');
                inventoryList.appendChild(newItemElement);
            }

			if (droppedItem.type === "consumable") {
			  // Add the item to the player's inventory
			  playerInventory.push(droppedItem);
			  playerDamageDisplay.textContent += ` You received a ${droppedItem.name}!`;
			} else {

            // Handle the dropped item based on its type and effect
            if (droppedItem.type === "consumable") {
                // For now, let's assume consumables affect the player immediately
                applyConsumableEffect(droppedItem.effect);
            }

            playerDamageDisplay.textContent += ` You received a ${droppedItem.name}!`;
        }
    }
}

    monstersKilled++;
    goldCollected += Math.abs(monsters[currentMonsterIndex].health);

    achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            if (achievement.id === 'monstersKilled10' && monstersKilled >= achievement.requirement) {
                unlockAchievement(achievement);
            } else if (achievement.id === 'goldCollected100' && goldCollected >= achievement.requirement) {
                unlockAchievement(achievement);
            }
        }
    });

    playerDamageDisplay.textContent += ` Monsters Killed: ${monstersKilled} | Gold Collected: ${goldCollected}`;

    updateUI();
    updateMonsterName();
    updateMonsterImage();
    monsterCycleIndex++;
    spawnMonster();
}

function findItemElementByName(itemName) {
    // Helper function to find an <li> element with the specified item name
    const inventoryList = document.getElementById('inventory-list');
    const itemElements = inventoryList.getElementsByTagName('li');

    for (const itemElement of itemElements) {
        if (itemElement.textContent.includes(itemName)) {
            return itemElement;
        }
    }

    return null;
}

function updateItemQuantity(itemElement) {
    // Helper function to update the quantity of an existing item in the inventory
    const quantityElement = itemElement.querySelector('.item-quantity');
    if (quantityElement) {
        const currentQuantity = parseInt(quantityElement.textContent, 10) || 1;
        quantityElement.textContent = currentQuantity + 1;
    }
}

function createNewItemElement(item) {
    const newItemElement = document.createElement('li');
    newItemElement.classList.add('inventory-item');
    newItemElement.setAttribute('data-item-name', item.name);

    const quantityElement = document.createElement('span');
    quantityElement.classList.add('item-quantity');
    quantityElement.textContent = ` x${item.quantity || 1}`;

    // Create a button for using the item
    const useButton = document.createElement('button');
    useButton.textContent = 'Use';
    useButton.setAttribute('data-item-name', item.name); // Unique identifier for each button
    useButton.addEventListener('click', () => useItem(item.name));

    newItemElement.textContent = `${item.name}`;
    newItemElement.appendChild(useButton);
    newItemElement.appendChild(quantityElement);

    newItemElement.style.listStyleType = 'none';

    return newItemElement;
}

function useItem(itemName) {
  const itemIndex = playerInventory.findIndex(item => item.name === itemName);

  if (itemIndex !== -1) {
    const item = playerInventory[itemIndex];

    switch (item.name) {
      case 'Health Potion':
        // Restore 20 health
        playerStats.health = Math.min(playerStats.health + 20, playerStats.maxHealth);
        break;
      // Add cases for other item types as needed
    }

    // Decrease item quantity only
    item.quantity--;

    // If the item is depleted, remove it from the inventory
    if (item.quantity === 0) {
      playerInventory.splice(itemIndex, 1);
    }

    updateUI();
    updateItemElement(findItemElementByName(item.name), item); // Assuming you have a findItemElementByName function
    updateInventory();
  } else {
    // Handle case where item is not found in inventory
    console.error(`Item "${itemName}" not found in inventory.`);
  }
}

function findItemInInventory(itemName) {
    return playerInventory.find(item => item.name === itemName);
}

function removeItemFromInventory(itemName) {
    const index = playerInventory.findIndex(item => item.name === itemName);
    if (index !== -1) {
        playerInventory.splice(index, 1);
    }
    updateInventory();
}

function updateInventory() {
  // Get existing item elements
  const existingItemElements = document.querySelectorAll('.player-inventory-container .item');

  // Update existing items or create new ones
  playerInventory.forEach(item => {
    const existingItemElement = existingItemElements.find(el => el.dataset.itemName === item.name);

    if (existingItemElement) {
      // Update existing item element
      updateItemElement(existingItemElement, item); // Assuming this function updates the item quantity
    } else {
      // Create new item element
      const newItemElement = createNewItemElement(item);
      inventoryList.appendChild(newItemElement);
    }
  });

  // Remove extra item elements that are no longer in inventory
  existingItemElements.forEach(itemElement => {
    if (!playerInventory.find(item => item.name === itemElement.dataset.itemName)) {
      itemElement.remove();
    }
  });
}

function updateItemElement(itemElement, item) {
  // Assuming the itemElement structure includes a span with class 'item-quantity'
  const quantityElement = itemElement.querySelector('.item-quantity');

  if (quantityElement) {
    // Update the quantity text
    quantityElement.textContent = ` x${item.quantity || 1}`;
  }
  // Add any other updating logic as needed
}
// New function to calculate experience gained based on defeated monster's level
function calculateExperienceGain(monsterLevel) {
    const baseExperience = 20; // You can adjust this value based on your game's balance
    
    console.log(`Monster Level (calculateExperienceGain): ${monsterLevel}`);
    console.log(`Player Level (calculateExperienceGain): ${playerStats.level}`);
    
    // Check if playerStats.level is greater than 0 to avoid division by 0
    const experienceGain = playerStats.level > 0 ? baseExperience * (monsterLevel / playerStats.level) : 0;
    
    console.log(`Experience Gain (calculateExperienceGain): ${experienceGain}`);
    
    return Math.floor(experienceGain);
}

function handleDefeat() {
    playerDamageDisplay.textContent = `You were defeated by ${monsters[currentMonsterIndex].name}. Game over!`;

    updateUI();

    setTimeout(() => {
        resetGame();
    }, 3000);
}

function unlockAchievement(achievement) {
    achievement.unlocked = true;
    playerDamageDisplay.textContent += ` Achievement Unlocked: ${achievement.name}!`;
}

function updateUI() {
    // Update player name and level
    playerName.textContent = `Player: Level ${playerStats.level}`;

    // Update health display text
    const healthDisplay = document.getElementById('health-display');
    healthDisplay.textContent = `${playerStats.health.toFixed(0)}`;

    // Update max health display text
    const maxHealthDisplay = document.getElementById('max-health-display');
    maxHealthDisplay.textContent = `${playerStats.maxHealth}`;

    // Update progress bar width
    playerHealthBar.style.width = `${(playerStats.health / maxPlayerHealth) * 100}%`;

    // Update level display
    levelDisplay.textContent = playerStats.level;

    // Update defense and strength displays
    defenseDisplay.textContent = playerStats.defense;
    strengthDisplay.textContent = playerStats.strength;

    // Update experience bar width
    const experiencePercentage = (playerStats.experience / playerStats.experienceToNextLevel) * 100;
    experienceBar.style.width = `${experiencePercentage}%`;

    // Update coin display
    coinDisplay.textContent = playerCoins;

    // Update monster name and health bar if a monster is present
    if (currentMonsterIndex !== undefined) {
        monsterName.textContent = monsters[currentMonsterIndex].name;
        updateMonsterHealthBar();
    }

	console.log('Player Health:', playerStats.health);
    console.log('Player Inventory:', playerInventory);
    // ... other updates as needed
}

function updateMonsterHealthBar() {
    const monsterHealthBar = document.getElementById('monster-health-bar');

    if (currentMonsterIndex !== undefined && monsters[currentMonsterIndex] && 'health' in monsters[currentMonsterIndex]) {
        const monsterHealthPercentage = (monsters[currentMonsterIndex].health / monsters[currentMonsterIndex].maxHealth) * 100;
        monsterHealthBar.style.width = `${monsterHealthPercentage}%`;
    } else {
        // Reset the health bar if there's no valid monster and update monster image
        monsterHealthBar.style.width = '0%';
		updateMonsterImage();
		
    }
}

function updateAchievements() {
    achievementsList.innerHTML = '';
    achievements.forEach(achievement => {
        const listItem = document.createElement('li');
        listItem.textContent = `${achievement.name} (${achievement.unlocked ? 'Unlocked' : 'Locked'})`;
        achievementsList.appendChild(listItem);
    });
}
