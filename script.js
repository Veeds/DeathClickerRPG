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
        lifesteal: 0.1,
        monsterArmor: 1,
        statusEffects: [],
        image: "monster1.png",
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
        lifesteal: 0.05,
        monsterArmor: 2,
        statusEffects: [],
        image: "monster2.png",
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
    monsterName.textContent = monsters[currentMonsterIndex].name;
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

    monster.maxHealth = Math.floor(playerLevelStats.maxHealth * (1 + playerLevel * 0.1));
    monster.defense = Math.floor(playerLevelStats.defense * (1 + playerLevel * 0.1));
    monster.strength = Math.floor(playerLevelStats.strength * (1 + playerLevel * 0.1));

    monster.maxHealth = Math.max(5, Math.min(monster.maxHealth, 15));
    monster.health = monster.maxHealth;

    updateMonsterName();
    updateMonsterHealthBar();
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

        const playerDamage = calculateDamage(playerStats, true);
        monsters[currentMonsterIndex].health -= playerDamage;

        playerDamageDisplay.textContent = `You dealt ${playerDamage.toFixed(0)} damage to ${monsters[currentMonsterIndex].name}!`;

        if (monsters[currentMonsterIndex].health <= 0) {
            handleVictory();
        } else {
            const monsterDamage = calculateDamage(monsters[currentMonsterIndex], false);
            playerStats.health -= monsterDamage;

            enemyDamageDisplay.textContent = `${monsters[currentMonsterIndex].name} counterattacks and deals ${monsterDamage.toFixed(0)} damage!`;

            if (playerStats.health <= 0) {
                handleDefeat();
            }

            updateUI();
        }
    }
}

function calculateDamage(character, isPlayer) {
    const baseDamage = isPlayer ? basePlayerDamage : 10;
    const criticalHitChance = character.criticalStrike;
    const isCriticalHit = Math.random() < criticalHitChance;

    const strengthScale = 0.2;
    const defenseScale = 0.1;
    const criticalScale = 0.5;

    let damage = isCriticalHit ? baseDamage * criticalScale : baseDamage;

    damage += character.strength * strengthScale;

    if (!isPlayer) {
        damage -= playerStats.defense * defenseScale;
    }

    damage = Math.max(1, damage);

    return damage;
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
    spawnMonster();
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

    // ... other updates as needed
}


function updateMonsterHealthBar() {
    const monsterHealthPercentage = (monsters[currentMonsterIndex].health / monsters[currentMonsterIndex].maxHealth) * 100;
    monsterHealthBar.style.width = `${monsterHealthPercentage}%`;
}

function updateAchievements() {
    achievementsList.innerHTML = '';
    achievements.forEach(achievement => {
        const listItem = document.createElement('li');
        listItem.textContent = `${achievement.name} (${achievement.unlocked ? 'Unlocked' : 'Locked'})`;
        achievementsList.appendChild(listItem);
    });
}