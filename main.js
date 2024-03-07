import { levelUp, upgradeDamage, autoCollectCoins, meteorStormUpgrade, healingSpellUpgrade } from './upgrades.js';
import { checkAchievements, displayAchievements } from './achievements.js';
import { monsters, bosses } from './monsters.js';
import { items } from './items.js';

window.onload = function() {
    var score = 0;
    var level = 1;
    var damage = 1;
    var damageDealt = 0;
    var monstersKilled = 0;
    var monsterHealth = 10;
    var coins = 0;
    var coinsOnScreen = [];
    var autoCollectCoinsInterval;
    var monsterData;
    var monster = document.getElementById('monster');
    var monsterImageElement = document.getElementById('monster-image');
    var scoreElement = document.getElementById('score');
    var levelElement = document.getElementById('level');
    var coinElement = document.getElementById('coins');
    var coinContainer = document.getElementById('coin-container');
    var damageUpgradeButton = document.getElementById('damage-upgrade-button');
    var autoCollectCoinsButton = document.getElementById('auto-collect-coins-button');
    autoCollectCoinsButton.textContent = "Auto Collect Coins (Cost: 100 coins)";
    var monsterNameElement = document.getElementById('monster-name');
    var monsterLevelElement = document.getElementById('monster-level');
    var monsterHealthElement = document.getElementById('monster-health');
    var monsterContainer = document.getElementById('monster-container');
    var upgradesButton = document.getElementById('upgrades-button');
    var upgradesModal = document.getElementById('upgrades-modal');
    var levelUpgradeButton = document.getElementById('level-upgrade-button');
    var closeUpgradesButton = document.getElementById('close-upgrades-button');
    var achievementsButton = document.getElementById('achievements-button');
    var closeAchievementsButton = document.getElementById('close-achievements-button');
    var achievementsModal = document.getElementById('achievements-modal');
    var meteorStormUpgradeButton = document.getElementById('meteor-storm-upgrade-button');
    var meteorStormButton = document.getElementById('meteor-storm-button');
    var menuButton = document.getElementById('menu-button');
    var cancelButton = document.getElementById('cancel-button');
    var menuModal = document.getElementById('menu-modal');

    let playerHealth = 100;
    let playerMana = 100;
    let inventory = {}; 
    var playerHealthElement = document.getElementById('player-health'); // New line
    var playerManaElement = document.getElementById('player-mana'); // New line
    
    document.getElementById('healing-spell-upgrade-button').addEventListener('click', function() {
        let result = healingSpellUpgrade(coins, playerHealth, playerMana, document.getElementById('healing-spell-button'), updatePlayerHealth, updatePlayerMana);
        coins = result.coins;
        playerHealth = result.health;
        playerMana = result.mana;
        document.getElementById('coins').textContent = "Coins: " + coins;
        document.getElementById('player-health').textContent = "Health: " + playerHealth;
        document.getElementById('player-mana').textContent = "Mana: " + playerMana;
    });

    document.getElementById('healing-spell-button').addEventListener('click', function() {
        if (playerMana >= 10) {
            playerMana -= 10;
            playerHealth += 20;
            updatePlayerHealth();
            updatePlayerMana();
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, 5000);
        } else {
            alert('Not enough mana to cast the spell!');
        }
    });

    function updatePlayerHealth() {
        playerHealthElement.textContent = "Health: " + playerHealth; // New function to update player health in the UI
    }

    function updatePlayerMana() {
        playerManaElement.textContent = "Mana: " + playerMana; // New function to update player mana in the UI
    }

    function updateScore() {
        scoreElement.textContent = "Score: " + score;
    }

    function updateLevel() {
        levelElement.textContent = "Level: " + level;
    }

    function updateCoins() {
        coinElement.textContent = "Coins: " + coins;
    }

    function updateMonsterInfo() {
        monsterNameElement.textContent = "Monster Name: " + monsterData.name;
        monsterLevelElement.textContent = "Monster Level: " + monsterData.level;
        monsterHealthElement.style.width = (monsterHealth / monsterData.health * 100) + '%';
    }

    function levelUp() {
        var cost = 100 * level;
        if (coins >= cost) {
            level++;
            coins -= cost;
            updateLevel();
            updateCoins();
            levelUpgradeButton.textContent = "Upgrade Level (Cost: " + (100 * level) + " coins)";
            checkAchievements(level, coins, damageDealt, monstersKilled,);
            displayAchievements();
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    }
    

    function displayDamage(damage, x, y) {
        var damageElement = document.createElement('div');
        const damageDisplay = document.getElementById('damage-display');
        damageDisplay.textContent = '-' + damage;
        damageElement.textContent = "-" + damage;
        damageElement.style.position = 'absolute';
        damageElement.style.left = x + 'px';
        damageElement.style.top = y + 'px';
        damageElement.style.color = 'red';
        damageElement.style.fontWeight = 'bold';
        damageElement.style.fontSize = '20px';
        monsterContainer.appendChild(damageElement);
    
        setTimeout(function() {
            monsterContainer.removeChild(damageElement);
        }, 500);
    }
    
    function autoCollectCoins() {
        var cost = 100;
        if (coins >= cost) {
            coins -= cost;
            if (autoCollectCoinsInterval) {
                clearInterval(autoCollectCoinsInterval);
            }
            autoCollectCoinsInterval = setInterval(function() {
                if (coinsOnScreen.length > 0) {
                    var coin = coinsOnScreen.pop();
                    coins += 10;
                    coinContainer.removeChild(coin);
                    updateCoins();
                }
            }, 5000); // Collect a coin every 5 seconds
            autoCollectCoinsButton.textContent = "Auto Collect Coins (Cost: 100 coins)";
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    }

    function upgradeDamage() {
        var cost = 100 * damage;
        if (coins >= cost) {
            damage += Math.floor(Math.random() * 3) + 2; // Increase damage by a random amount between 2 and 4
            coins -= cost;
            damageUpgradeButton.textContent = "Upgrade Damage (Cost: " + (100 * damage) + " coins)";
            checkAchievements(level, coins, damageDealt, monstersKilled,);
            displayAchievements();
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    }

    function spawnMonster() {
        var availableMonsters = monsters.filter(monster => monster.level <= level);
        var availableBosses = bosses.filter(boss => boss.level <= level);
        var spawnBoss = availableBosses.length > 0 && Math.random() < 0.5; // 50% chance to spawn a boss if there's an available boss
        if (spawnBoss) {
            monsterData = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        } else { // Otherwise, spawn a regular monster
            monsterData = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
        }
        monsterNameElement.textContent = "Monster Name: " + monsterData.name;
        monsterImageElement.src = monsterData.image;
        monsterHealth = monsterData.health;
        updateMonsterInfo();
    }

    function spawnCoin() {
        var coin = document.createElement('div');
        coin.style.width = '20px';
        coin.style.height = '20px';
        coin.style.backgroundColor = 'gold';
        coin.style.position = 'absolute';
        coin.style.left = Math.random() * (coinContainer.offsetWidth - 20) + 'px'; // Update this line
        coin.style.top = Math.random() * (coinContainer.offsetHeight - 20) + 'px'; // Update this line
        coinContainer.appendChild(coin);
    
        coin.addEventListener('mouseover', function() {
            coins += 10;
            updateCoins();
            coinContainer.removeChild(coin);
            var index = coinsOnScreen.indexOf(coin);
            if (index > -1) {
                coinsOnScreen.splice(index, 1);
            }
            checkAchievements(level, coins, damageDealt, monstersKilled,);
            displayAchievements();
        });
    
        // 10% chance to drop an item
        if (Math.random() < 0.8) {
            dropItem();
        }
    
        return coin;
    }

    function dropItem() {
        // Choose a random item
        const item = items[Math.floor(Math.random() * items.length)];
    
        // Check if the item should drop
        if (Math.random() < item.dropChance) {
            // Create a new div for the item
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.title = item.name;
            itemDiv.style.backgroundColor = 'white'; // Or any other styling you want
            itemDiv.style.width = '20px';
            itemDiv.style.height = '20px';
            itemDiv.style.position = 'absolute';
            itemDiv.style.left = Math.random() * (coinContainer.offsetWidth - 20) + 'px';
            itemDiv.style.top = Math.random() * (coinContainer.offsetHeight - 20) + 'px';
    
            // Add an event listener to the item
            itemDiv.addEventListener('mouseover', () => {
                // Check if the item is already in the inventory
                if (inventory[item.name]) {
                    // If it is, increment the count
                    inventory[item.name]++;
                } else {
                    // If it's not, add a new item to the inventory
                    inventory[item.name] = 1;
                }
    
                // Find the item in the inventory
                const inventoryItem = document.querySelector(`#player-inventory .inventory-item[title^="${item.name}"]`);
                // Check if the item was found
                if (inventoryItem) {
                    // Update the item's title to include the count
                    inventoryItem.title = `${item.name} x${inventory[item.name]}`;
                } else {
                    // If the item wasn't found, create a new inventory item
                    const inventoryItem = itemDiv.cloneNode();
                    inventoryItem.style.position = 'static';
                    inventoryItem.style.width = '60px'; // Make the item bigger
                    inventoryItem.style.height = '60px'; // Make the item bigger
                    inventoryItem.title = `${item.name} x${inventory[item.name]}`;
                    document.getElementById('player-inventory').appendChild(inventoryItem);
                }
    
                // Remove the item from the game container
                coinContainer.removeChild(itemDiv);
            });
    
            // Add the item to the game container
            coinContainer.appendChild(itemDiv);
        }
    }

    function purchaseMeteorStormUpgrade() {
        var cost = 1500;
        if (coins >= cost) {
            coins -= cost;
            meteorStormButton.style.display = 'block'; // Show the button
            meteorStormUpgradeButton.disabled = true; // Disable the "Meteor Storm Upgrade" button
            updateCoins();
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    }

    function castMeteorStorm() {
        // Add your code for casting the spell here
        // For example, you could deal a large amount of damage to the monster
        var damage = 100;
        monsterHealth -= damage;
        if (monsterHealth <= 0) {
            spawnMonster();
        } else {
            updateMonsterInfo();
        }
    }
    function calculateDamage(baseDamage) {
        // Generate a random number between 0.8 and 1.2
        let randomFactor = Math.random() * (1.2 - 0.8) + 0.8;
        // Multiply the base damage by the random factor
        let damage = baseDamage * randomFactor;
        // Round the damage to the nearest integer
        damage = Math.round(damage);
        return damage;
    }

    function useItem(itemName) {
        // Get the item from the items array
        let item = items.find(item => item.name === itemName);
        // Check if the item is a consumable
        if (item.type === 'Consumable') {
            // Check if the item is a Healing Potion
            if (item.name === 'Healing Potion') {
                // Heal the player between 5 and 10 health
                let healAmount = Math.floor(Math.random() * 6) + 5;
                playerHealth += healAmount;
                if (playerHealth > 100) playerHealth = 100; // Cap health at 100
                updatePlayerHealth();
            }
            // Check if the item is a Mana Potion
            else if (item.name === 'Mana Potion') { // Add this block
                // Increase the player's mana by a random amount between 10 and 20
                let manaAmount = Math.floor(Math.random() * 11) + 10;
                playerMana += manaAmount;
                if (playerMana > 100) playerMana = 100; // Cap mana at 100
                updatePlayerMana();
            }
            // Add more cases here for other consumable items
        }
    }

    // Call checkAchievements whenever the level, coins, damage dealt, or monsters killed changes
    monster.addEventListener('click', function(event) {
        // Use the player's fixed damage
        let finalDamage = damage;
    
        score += finalDamage;
        damageDealt += finalDamage; // Update damageDealt
        monsterHealth -= finalDamage;
    
        // New code to deal damage to player
        let minDamage = monsterData.damage[0]; // Use the monster's minimum damage
        let maxDamage = monsterData.damage[1]; // Use the monster's maximum damage
        let finalDamageToPlayer = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage; // Select a random damage within the range
        playerHealth -= finalDamageToPlayer;
        if (playerHealth < 0) playerHealth = 0; // Prevent health from going below 0
    
        // Call a function to update the player's health in the UI
        updatePlayerHealth();
    
        if (monsterHealth <= 0) {
            spawnMonster();
            monstersKilled++; // Increase the number of monsters killed
        } else {
            updateMonsterInfo();
        }
    
        // Game Over condition
        if (playerHealth <= 0) {
            // End the game
            alert('Game Over');
            // Here you can add more code to handle the end of the game
        }
    
        spawnCoin();
        updateScore();
        updateCoins();
        var rect = monster.getBoundingClientRect();
        var coin = spawnCoin();
        coinsOnScreen.push(coin);
        displayDamage(finalDamage, event.clientX - rect.left, event.clientY - rect.top); // Display the final damage, not the base damage
        checkAchievements(level, coins, damageDealt, monstersKilled,);
        displayAchievements(); // Call checkAchievements
    });

    levelUpgradeButton.addEventListener('click', function() {
        var cost = 100 * level;
        if (coins >= cost) {
            levelUp(); // Call the levelUp function without any arguments
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    });

    upgradesButton.addEventListener('click', function() {
        upgradesModal.style.display = 'block';
        achievementsModal.style.display = 'none'; // Hide the achievements modal
    });

    closeUpgradesButton.addEventListener('click', function() {
        upgradesModal.style.display = 'none';
    });

    updateScore();
    updateLevel();
    updateCoins();
    spawnMonster();

    damageUpgradeButton.addEventListener('click', function() {
        var cost = 100 * damage;
        if (coins >= cost) {
            upgradeDamage(); // Call the upgradeDamage function without any arguments
            updateCoins();
            damageUpgradeButton.textContent = "Upgrade Damage (Cost: " + (100 * damage) + " coins)";
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    });
    
    autoCollectCoinsButton.addEventListener('click', function() {
        if (coins >= 100) {
            coins -= 100;
            autoCollectCoins();
            updateCoins();
        } else {
            alert('Not enough coins to purchase upgrade!');
        }
    });

    achievementsButton.addEventListener('click', function() {
        achievementsModal.style.display = 'block';
        upgradesModal.style.display = 'none'; // Hide the upgrades modal
    });
    
    closeAchievementsButton.addEventListener('click', function() {
        achievementsModal.style.display = 'none';
    });

    menuButton.addEventListener('click', function() {
        menuModal.style.display = 'block';
    });
    
    cancelButton.addEventListener('click', function() {
        menuModal.style.display = 'none';
    });

    document.getElementById('player-inventory').addEventListener('click', function(event) {
        // Check if the clicked element is an inventory item
        if (event.target.classList.contains('inventory-item')) {
            // Get the item name from the title attribute
            let itemName = event.target.title.split(' x')[0];
            // Use the item
            useItem(itemName);
            // Decrement the count in the inventory object
            inventory[itemName]--;
            // If the count is 0, remove the item from the inventory object and the UI
            if (inventory[itemName] === 0) {
                delete inventory[itemName];
                event.target.parentNode.removeChild(event.target);
            } else {
                // Otherwise, update the item's title to include the new count
                event.target.title = `${itemName} x${inventory[itemName]}`;
            }
        }
    });

    meteorStormUpgradeButton.addEventListener('click', function() {
        var result = meteorStormUpgrade(coins, playerMana, meteorStormButton, function(damage) {
            monsterHealth -= damage;
            if (monsterHealth <= 0) {
                spawnMonster();
            } else {
                updateMonsterInfo();
            }
        }, displayDamage, function() {
            spawnCoin();
        }, function(damage) {
            score += damage; // Update the score
            updateScore(); // Update the score display
        }, function(mana) {
            playerMana = mana; // Update the playerMana variable
            updatePlayerMana();
        });
        coins = result.coins;
        playerMana = result.mana;
        updateCoins();
        updatePlayerMana();
    });

};
