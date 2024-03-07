export var achievements = [
    { name: 'Level 5', condition: (level) => level >= 5, unlocked: false },
    { name: 'Level 10', condition: (level) => level >= 10, unlocked: false },
    { name: 'Gold Collector', condition: (_, coins) => coins >= 1000, unlocked: false },
    { name: 'Monster Slayer', condition: (_, __, monstersKilled) => monstersKilled >= 100, unlocked: false },
    { name: 'Level Master', condition: (level) => level >= 20, unlocked: false },
    { name: 'Wealth Accumulator', condition: (_, coins) => coins >= 5000, unlocked: false },
    { name: 'Monster Exterminator', condition: (_, __, monstersKilled) => monstersKilled >= 500, unlocked: false },
    { name: 'First Blood', condition: (_, __, monstersKilled) => monstersKilled >= 1, unlocked: false },
    { name: 'Novice Collector', condition: (_, coins) => coins >= 100, unlocked: false },
    { name: 'Soul Stealer', condition: (_, __, monstersKilled) => monstersKilled >= 50, unlocked: false },
    // Add more achievements as needed
];

export function checkAchievements(level, coins, damageDealt, monstersKilled,) {
    achievements.forEach(achievement => {
        if (achievement.condition(level, coins, damageDealt, monstersKilled) && !achievement.unlocked) {
            achievement.unlocked = true;
        }
    });
}

export function displayAchievements() {
    var achievementsContainer = document.getElementById('achievements-container');
    console.log('Achievements container:', achievementsContainer); // Debug line
    achievementsContainer.innerHTML = ''; // Clear the achievements container
    achievements.forEach(achievement => {
        console.log('Creating element for achievement:', achievement.name); // Debug line
        var achievementElement = document.createElement('div');
        achievementElement.classList.add('achievement');
        if (achievement.unlocked) {
            achievementElement.classList.add('unlocked');
        }
        achievementElement.id = 'achievement-' + achievement.name;
        achievementElement.title = achievement.name;
        achievementsContainer.appendChild(achievementElement);
        console.log('Achievement element:', achievementElement); // Debug line
    });
    console.log('Achievements container after adding achievements:', achievementsContainer); // Debug line
}
