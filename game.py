import pygame
import random
from player import Player  # Import the Player class
from monster import Monster  # Import the Monster class
from item import Item, Equipment, Consumable

# Initialize Pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 1200, 900
FPS = 60
BUTTON_WIDTH, BUTTON_HEIGHT = 80, 40
BUTTON_X, BUTTON_Y = (WIDTH - BUTTON_WIDTH) // 2, HEIGHT - BUTTON_HEIGHT - 10
INFO_SECTION_WIDTH = WIDTH // 4
PLAYER_STATS_HEIGHT = 240
INVENTORY_Y = PLAYER_STATS_HEIGHT + 10

#Inventory Constants
INVENTORY_X = 10
SLOT_SIZE = 50
SLOTS_PER_ROW = 5
INVENTORY_WIDTH = SLOTS_PER_ROW * SLOT_SIZE  # Define the inventory width

# Colors
WHITE = (128, 128, 128)
LIGHT_GREY = (192, 192, 192)
DARK_GREY = (64, 64, 64)
BLACK = (0, 0, 0)

# Initialize player and monster
player = Player()
monster = Monster(player.level)
monster.spawn(WIDTH, HEIGHT)

# Create the game window
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Clicker RPG")

# Clock to control the frame rate
clock = pygame.time.Clock()

# Font for displaying text
font = pygame.font.Font(None, 36)

# Initialize player
player = Player()

# Enemy stats
enemy_types = [
    {'name': 'Goblin', 'health': 50, 'reward': 20},
    {'name': 'Orc', 'health': 100, 'reward': 40},
    {'name': 'Dragon', 'health': 200, 'reward': 80},
]
current_enemy = None

def draw_text(text, x, y, color):
    """Draw text on the screen."""
    text_surface = font.render(text, True, color)
    screen.blit(text_surface, (x, y))

def main():
    running = True
    dragged_item = None

    # Initialize the first monster
    monster = Monster(player.level)
    monster.spawn(WIDTH, HEIGHT)

    last_hovered_item = None
    tooltip_surface = None
    tooltip_rect = None

    # Calculate the inventory height
    INVENTORY_HEIGHT = (len(player.inventory) // SLOTS_PER_ROW + 1) * SLOT_SIZE

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.MOUSEBUTTONDOWN:
                # Check if the click is within the monster's bounding box
                mouse_x, mouse_y = pygame.mouse.get_pos()
                if (
                    monster.x < mouse_x < monster.x + monster.image.get_width() and
                    monster.y < mouse_y < monster.y + monster.image.get_height()
                ):
                    # Player clicked on the monster, deal damage
                    player.attack(monster)

                # Check if the click is within the attack button
                if BUTTON_X <= mouse_x <= BUTTON_X + BUTTON_WIDTH and BUTTON_Y <= mouse_y <= BUTTON_Y + BUTTON_HEIGHT:
                    player.attack(monster)

                # Check if the click is within the inventory
                if INVENTORY_X <= mouse_x <= INVENTORY_X + INVENTORY_WIDTH and INVENTORY_Y <= mouse_y <= INVENTORY_Y + INVENTORY_HEIGHT:
                    # Calculate the clicked slot
                    col = (mouse_x - INVENTORY_X) // SLOT_SIZE
                    row = (mouse_y - INVENTORY_Y) // SLOT_SIZE
                    index = row * SLOTS_PER_ROW + col

                    # Check if the slot contains an item
                    if index < len(player.inventory):
                        item_dict = player.inventory[index]
                        item = item_dict['item']
                        dragged_item = item_dict

                        # Check if the item is an Equipment
                        if isinstance(item, Equipment):
                            dragged_item = item
                            player.inventory.remove(item_dict)
                        else:  # Treat all other items as consumables
                            item.use(player)
                            player.inventory.remove(item_dict)
                            dragged_item = None

                # Check if the click is within the equipped gear slots
                if GEAR_X <= mouse_x <= GEAR_X + 3 * (SLOT_SIZE + 10) and GEAR_Y <= mouse_y <= GEAR_Y + SLOT_SIZE:
                    # Calculate the clicked slot
                    index = (mouse_x - GEAR_X) // (SLOT_SIZE + 10)

                    # Check if the slot contains an item
                    item_key = list(player.equipped_gear.keys())[index]
                    item = player.equipped_gear[item_key]
                    if item is not None:
                        dragged_item = {'item': item, 'probability': 1.0}

                if event.type == pygame.MOUSEBUTTONUP:
                    # Check if the release is within the equipped gear slots
                    mouse_x, mouse_y = pygame.mouse.get_pos()
                    if GEAR_X <= mouse_x <= GEAR_X + 3 * (SLOT_SIZE + 10) and GEAR_Y <= mouse_y <= GEAR_Y + SLOT_SIZE:
                        # Calculate the released slot
                        index = (mouse_x - GEAR_X) // (SLOT_SIZE + 10)

                        # Check if the slot is empty
                        if list(player.equipped_gear.values())[index] is None and isinstance(dragged_item['item'], Equipment):  # Change this line
                            # Equip the dragged item
                            player.equip(dragged_item['item'])  # Change this line
                        else:
                            # Unequip the current item in the slot, if any
                            current_item = player.equipped_gear[list(player.equipped_gear.keys())[index]]
                            if current_item is not None:
                                player.unequip(current_item)
                                player.inventory.append({'item': current_item, 'probability': 1.0})

                            # Equip the dragged item
                            player.equip(dragged_item['item'])  # Change this line

                        dragged_item = None
                    else:
                        if dragged_item is not None:
                            player.inventory.append(dragged_item)
                            dragged_item = None
                    if isinstance(dragged_item, Consumable):
                        dragged_item = None
                if item is not None:  # Add this line
                    item.use(player)

        # Check if the mouse is hovering over the inventory
        mouse_x, mouse_y = pygame.mouse.get_pos()
        if INVENTORY_X <= mouse_x <= INVENTORY_X + INVENTORY_WIDTH and INVENTORY_Y <= mouse_y <= INVENTORY_Y + INVENTORY_HEIGHT:
            # Calculate the hovered slot
            col = (mouse_x - INVENTORY_X) // SLOT_SIZE
            row = (mouse_y - INVENTORY_Y) // SLOT_SIZE
            index = row * SLOTS_PER_ROW + col

            # Check if the slot contains an item
            if index < len(player.inventory):
                item = player.inventory[index]['item']

                # If the hovered item has changed, create a new tooltip
                if item != last_hovered_item:
                    # Create the tooltip text
                    tooltip_text = f"{item.name}"
                    if hasattr(item, 'effect') and hasattr(item, 'effect_value'):
                        tooltip_text += f"\nEffect: {item.effect}\nValue: {item.effect_value}"
                    if hasattr(item, 'duration'):
                        tooltip_text += f"\nDuration: {item.duration}s"

                    # Create the tooltip surface
                    tooltip_surface = font.render(tooltip_text, True, (255, 255, 255))  # Change color to white
                    tooltip_rect = tooltip_surface.get_rect()
                    tooltip_rect.topleft = (mouse_x + 20, mouse_y + 20)  # Offset the tooltip position

                    last_hovered_item = item
        else:
            last_hovered_item = None
            tooltip_surface = None
            tooltip_rect = None

        # Clear the screen
        screen.fill(BLACK)

        # Load the background image
        background_image = pygame.image.load('background.png')

        # Draw the background image
        screen.blit(background_image, (400, 225))

        # Draw the player info section
        pygame.draw.rect(screen, DARK_GREY, pygame.Rect(0, 0, INFO_SECTION_WIDTH, HEIGHT))

        # Display player stats
        draw_text(f"Level: {player.level}", 10, 10, (0, 0, 0))
        draw_text(f"Health: {player.health}", 10, 50, (0, 0, 0))
        draw_text(f"Attack Power: {player.attack_power}", 10, 90, (0, 0, 0))
        draw_text(f"Defense: {player.defense}", 10, 130, (0, 0, 0))
        draw_text(f"Gold: {player.gold}", 10, 170, (0, 0, 0))
        draw_text(f"Experience: {player.experience}/{player.experience_needed}", 10, 210, (0, 0, 0))

        # Draw the buff timer
        for i, buff in enumerate(player.buffs):
            if buff['effect'] == 'defense':
                draw_text(f"Defense buff: {buff['duration']}s", 10, 10 + i * 20, (0, 0, 0))

        # Draw the monster and its health bar and its name
        monster.draw(screen)
        monster.draw_health_bar(screen)
        monster.draw_name(screen)

        # Draw the inventory background
        pygame.draw.rect(screen, LIGHT_GREY, pygame.Rect(INVENTORY_X, INVENTORY_Y, INVENTORY_WIDTH, INVENTORY_HEIGHT))

        # Display player's inventory
        for i, item_dict in enumerate(player.inventory):
            # Calculate the row and column
            row = i // SLOTS_PER_ROW
            col = i % SLOTS_PER_ROW

            # Calculate the x and y position of the slot
            x = INVENTORY_X + (i % SLOTS_PER_ROW) * SLOT_SIZE
            y = INVENTORY_Y + (i // SLOTS_PER_ROW) * SLOT_SIZE

            # Draw the inventory slot
            pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(x, y, SLOT_SIZE, SLOT_SIZE), 2)

            # Draw the item image
            item = item_dict['item']
            screen.blit(pygame.transform.scale(item.image, (SLOT_SIZE, SLOT_SIZE)), (x, y))

        # Draw the attack button
        pygame.draw.rect(screen, DARK_GREY, pygame.Rect(BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT))

        # Calculate the position of the equipped gear
        GEAR_X = INVENTORY_X
        GEAR_Y = INVENTORY_Y + INVENTORY_HEIGHT + 30

        # Draw the equipped gear
        draw_text("Equipped Gear", GEAR_X, GEAR_Y - 20, (0, 0, 0))
        for i, (type, item) in enumerate(player.equipped_gear.items()):
            x = GEAR_X + i * (SLOT_SIZE + 10)
            y = GEAR_Y
            pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(x, y, SLOT_SIZE, SLOT_SIZE), 2)
            if item is not None:
                screen.blit(pygame.transform.scale(item.image, (SLOT_SIZE, SLOT_SIZE)), (x, y))

        # Draw the tooltip if it exists
        if tooltip_surface is not None:
            screen.blit(tooltip_surface, tooltip_rect)

        # Draw the info section
        pygame.draw.rect(screen, DARK_GREY, pygame.Rect(WIDTH - INFO_SECTION_WIDTH, 0, INFO_SECTION_WIDTH, HEIGHT))

        # If dragged_item is not None, draw the item at the mouse cursor's position
        if dragged_item is not None:
            mouse_x, mouse_y = pygame.mouse.get_pos()
            screen.blit(pygame.transform.scale(dragged_item.image, (SLOT_SIZE, SLOT_SIZE)), (mouse_x, mouse_y))

        # Update the display
        pygame.display.flip()

        # Check if the monster is defeated
        if monster.health <= 0:
            # Spawn a new monster
            monster = Monster(player.level)
            monster.spawn(WIDTH, HEIGHT)

        # Check if the player is dead
        if player.is_dead():
            # Display game over screen
            screen.fill(WHITE)
            draw_text("Game Over", WIDTH // 2, HEIGHT // 2, (0, 0, 0))
            draw_text(f"Level reached: {player.level}", WIDTH // 2, HEIGHT // 2 + 50, (0, 0, 0))
            draw_text(f"Gold collected: {player.gold}", WIDTH // 2, HEIGHT // 2 + 100, (0, 0, 0))
            pygame.display.flip()

            # Wait for a few seconds before ending the game
            pygame.time.wait(3000)
            running = False

        # Cap the frame rate
        clock.tick(FPS)

    pygame.quit()

if __name__ == "__main__":
    main()