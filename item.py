import pygame

class Item:
    def __init__(self, name, image_path, effect, effect_value, duration=None):
        self.name = name
        self.image = pygame.image.load(image_path)
        self.effect = effect
        self.effect_value = effect_value
        self.duration = duration

    def use(self, player):
        if self.effect == 'health':
            player.health += self.effect_value
            player.health = min(player.health, 100)
        elif self.effect == 'defense':
            player.buffs.append({
                'effect': self.effect,
                'effect_value': self.effect_value,
                'duration': self.duration,
            })

class Consumable:
    def __init__(self, name, effect, effect_value):
        self.name = name
        self.effect = effect
        self.effect_value = effect_value

    def use(self, player):
        if self.effect == 'heal':
            player.health += self.effect_value
        # Add other effects as needed

class Equipment:
    def __init__(self, name, image_path, attack_boost, defense_boost):
        self.name = name
        self.image = pygame.image.load(image_path)
        self.attack_boost = attack_boost
        self.defense_boost = defense_boost


        
# Define your items
health_potion = Item('Health Potion', 'items/healthpotion.png', 'health', 50)
defense_scroll = Item('Scroll of Defense', 'items/scroll.png', 10, 60)

# Define your equipment
sword = Equipment('Sword', 'items/rustedsword.png', 10, 0)
shield = Equipment('Shield', 'items/shield.png', 0, 10)
breastplate = Equipment('Breastplate', 'items/shield.png', 0, 20)