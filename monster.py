import pygame
import random
from item import Item, Equipment  # Add this line

# Load the monster image
# Load the monster images
monster_images = [
    pygame.image.load("monster1.png"),
    pygame.image.load("monster2.png"),
    pygame.image.load("monster3.png"),
    pygame.image.load("monster4.png"),
    pygame.image.load("monster5.png"),
    # Add more images as needed
]

# Monster stats
items = [
    Item('Health Potion', 'items/healthpotion.png', 'health', 20),  # Changed 'heal' to 20
    Item('Scroll of Defense', 'items/scroll.png', 10, 60),
    # Add more items as needed
]

equipment = [
    Equipment('Sword', 'items/rustedsword.png', 10, 0),
    Equipment('Shield', 'items/shield.png', 0, 10),
    # Add more equipment as needed
]

monster_types = [
    {'name': 'Goblin', 'health': 50, 'reward': 20, 'loot': [{'item': items[0], 'probability': 0.5}, {'item': items[1], 'probability': 0.3}, {'item': equipment[0], 'probability': 0.2}, {'item': equipment[1], 'probability': 0.2}]},
    {'name': 'Orc', 'health': 100, 'reward': 40, 'loot': [{'item': items[0], 'probability': 0.5}, {'item': items[1], 'probability': 0.3}, {'item': equipment[0], 'probability': 0.2}, {'item': equipment[1], 'probability': 0.2}]},
    {'name': 'Dragon', 'health': 200, 'reward': 80, 'loot': [{'item': items[0], 'probability': 0.5}, {'item': items[1], 'probability': 0.3}, {'item': equipment[0], 'probability': 0.2}, {'item': equipment[1], 'probability': 0.2}]},
]

class Monster:
    def __init__(self, player_level):
        self.type = random.choice(monster_types)
        self.health = self.type['health'] * player_level
        self.level = player_level
        self.defense = self.level * 2  # Adjust this formula as needed
        self.reward = self.type['reward'] * player_level
        self.loot = self.type['loot']
        self.image = random.choice(monster_images)
        self.x = None
        self.y = None
        self.attack_power = random.randint(1, 5)  # Controls attack power of monsters. 

    def spawn(self, screen_width, screen_height):
        """Spawn the monster at a random position."""
        self.x = (screen_width - self.image.get_width()) // 2
        self.y = (screen_height - self.image.get_height()) // 2

    def draw(self, screen):
        """Draw the monster on the screen."""
        screen.blit(self.image, (self.x, self.y))

    def draw_name(self, screen):
        """Draw the monster's name above the monster."""
        font = pygame.font.Font(None, 36)  # Choose the font for the text
        text = font.render(self.type['name'], True, (255, 255, 255))  # Create the text
        screen.blit(text, (self.x, self.y - 60))  # Draw the text

    def draw_health_bar(self, screen):
        """Draw a health bar above the monster."""
        BAR_LENGTH = 120  # Increase this value to make the health bar bigger
        BAR_HEIGHT = 20  # Increase this value to make the health bar taller
        fill = (self.health / self.type['health']) * BAR_LENGTH
        fill = min(max(fill, 0), BAR_LENGTH)  # Ensure fill is between 0 and BAR_LENGTH

        # Calculate the x position of the health bar to center it above the monster image
        x = self.x + (self.image.get_width() - BAR_LENGTH) // 2

        outline_rect = pygame.Rect(x, self.y - 30, BAR_LENGTH, BAR_HEIGHT)
        fill_rect = pygame.Rect(x, self.y - 30, fill, BAR_HEIGHT)
        pygame.draw.rect(screen, (255, 0, 0), fill_rect)
        pygame.draw.rect(screen, (255, 255, 255), outline_rect, 2)

    def drop_loot(self):
        """Drop the loot when the monster is defeated."""
        dropped_loot = []
        for loot in self.loot:
            if random.random() < loot['probability']:
                dropped_loot.append(loot['item'])
        return dropped_loot