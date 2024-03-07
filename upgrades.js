export function levelUp(level, coins, levelUpgradeButton) {
    var cost = 100 * level; // The cost is 100 times the current level
    if (coins >= cost) {
        level++;
        coins -= cost;
        cost = 100 * level; // Recalculate the cost
    } else {
        alert('Not enough coins to purchase upgrade!');
    }
    levelUpgradeButton.textContent = "Upgrade Level (Cost: " + cost + " coins)";
    return { level, coins };
}

export function upgradeDamage(damage, coins, damageUpgradeButton,) {
    var cost = 100 * damage; // The cost is 100 times the current damage
    if (coins >= cost) {
        damage += Math.floor(Math.random() * 3) + 2; // Increase damage by a random amount between 2 and 4
        coins -= cost;
        cost = 100 * damage; // Recalculate the cost
    } else {
        alert('Not enough coins to purchase upgrade!');
    }
    damageUpgradeButton.textContent = "Upgrade Damage (Cost: " + cost + " coins)";
    return { damage, coins };
}

export function autoCollectCoins(coins, autoCollectCoinsButton,) {
    if (coins >= 100) {
        coins -= 100;
        if (typeof window !== 'undefined' && window.autoCollectCoinsInterval) {
            clearInterval(window.autoCollectCoinsInterval);
        }
        window.autoCollectCoinsInterval = setInterval(function() {
            coins += 5;
        }, 5000); // Increase coins by 5 every 5 seconds
    } else {
        alert('Not enough coins to purchase upgrade!');
    }
    autoCollectCoinsButton.textContent = "Auto Collect Coins (Cost: 100 coins)";
    return coins;
}

export function meteorStormUpgrade(coins, mana, meteorStormButton, dealDamage, displayDamage, spawnCoin, updateScore, updateMana) {
    const cost = 100;
    const manaCost = 20;
    if (coins >= cost && mana >= manaCost) {
        coins -= cost;
        meteorStormButton.style.display = 'block'; // Show the button
        meteorStormButton.disabled = false; // Enable the button
        meteorStormButton.textContent = "Meteor Storm";
        meteorStormButton.addEventListener('click', function() {
            if (mana < manaCost) {
                alert('Not enough mana to cast the spell!');
                return;
            }
            mana -= manaCost; // Deduct mana here, outside of setInterval
            updateMana(mana); // Update mana here, outside of setInterval
            meteorStormButton.disabled = true; // Disable the button while the spell is active
            let spellDuration = 10;
            let cooldown = 3;
            let spellInterval = setInterval(function() {
                let damage = Math.floor(Math.random() * 51) + 50; // Calculate damage
                dealDamage(damage); // Deal damage using the callback function
                displayDamage(damage);  // Display damage using the callback function
                spawnCoin();
                updateScore(damage);
                spellDuration--;
                if (spellDuration <= 0) {
                    clearInterval(spellInterval); // Stop the spell after 10 seconds
                    setTimeout(function() {
                        meteorStormButton.disabled = false; // Enable the button after the cooldown period
                    }, cooldown * 1000);
                }
            }, 1000);
        });
    } else {
        alert('Not enough coins or mana to purchase upgrade!');
    }
    return { coins, mana };
}