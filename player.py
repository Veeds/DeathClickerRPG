from item import Item, Equipment  # Make sure to import the Item and Equipment classes

class Player:
    def __init__(self):
        self.level = 1
        self.health = 100
        self.defense = 0
        self.attack_power = 10  # Renamed this attribute from 'attack' to 'attack_power'
        self.gold = 0
        self.experience = 0
        self.experience_needed = 50
        self.inventory = []
        self.equipped_gear = {'Armor': None, 'Weapon': None, 'Shield': None}
        self.buffs = []

    def attack(self, monster):
        # Calculate damage dealt considering player's attack power
        damage_dealt = self.attack_power - monster.defense
        # Ensure damage_dealt is at least 0
        damage_dealt = max(damage_dealt, 0)
        monster.health -= damage_dealt

        # Monster attacks the player
        if monster.health > 0:
            damage_received = monster.attack_power / (1 + self.defense / 100)  # Updated this line
            self.health -= damage_received

        # Check if the monster is defeated
        if monster.health <= 0:
            # Gain experience and gold
            self.experience += monster.reward
            self.gold += monster.reward

            # Drop loot
            for item in monster.loot:
                self.add_item(item)

            # Check if the player leveled up
            if self.experience >= self.experience_needed:
                self.level_up()

    def update_buffs(self):
        for buff in self.buffs:
            if buff['duration'] > 0:
                if buff['effect'] == 'defense':
                    self.defense += buff['effect_value']
                buff['duration'] -= 1
            else:
                if buff['effect'] == 'defense':
                    self.defense -= buff['effect_value']
                self.buffs.remove(buff)

    def level_up(self):
        self.level += 1
        self.experience = 0
        self.experience_needed *= 2
        self.attack_power += 5
        self.health += 10

    def display_stats(self):
        print(f"Level: {self.level}")
        print(f"Health: {self.health}")
        print(f"Gold: {self.gold}")
        print(f"Experience: {self.experience}/{self.experience_needed}")

    def add_item(self, item):
        """Add an item to the inventory."""
        self.inventory.append(item)

    def consume(self, item):
        if item.type == 'Health Potion':
            self.health += 20  # Restore 20 life
            self.health = min(self.health, self.max_health)  # Don't exceed max health
            self.inventory.remove(item)  # Remove the item from the inventory

    def equip(self, item):
        # Map item names to slots
        item_to_slot = {'Sword': 'Weapon', 'Shield': 'Shield', 'Armor': 'Armor'}
        slot = item_to_slot.get(item.name)

        if slot:
            # If the slot is empty or the new item is better, equip it
            if self.equipped_gear[slot] is None or self.equipped_gear[slot].attack_boost + self.equipped_gear[slot].defense_boost < item.attack_boost + item.defense_boost:
                # If there's already an item in this slot, unequip it first
                if self.equipped_gear[slot] is not None:
                    current_item = self.equipped_gear[slot]
                    self.unequip(current_item)
                    self.inventory.append(current_item)

                # Equip the new item
                self.equipped_gear[slot] = item
                self.attack_power += item.attack_boost
                self.defense += item.defense_boost

                # Remove the item from the inventory, if it's still there
                if item in self.inventory:
                    self.inventory.remove(item)

                print(f"Equipped {item.name}. Attack power: {self.attack_power}, Defense: {self.defense}")

    def unequip(self, item):
        # Map item names to slots
        item_to_slot = {'Sword': 'Weapon', 'Shield': 'Shield', 'Armor': 'Armor'}
        slot = item_to_slot.get(item.name)

        if slot:
            # Remove the item's effects
            self.attack_power -= item.attack_boost
            self.defense -= item.defense_boost

            # Remove the item from equipped gear
            self.equipped_gear[slot] = None

            # Add the item back to the inventory
            self.inventory.append(item)

            print(f"Unequipped {item.name}. Attack power: {self.attack_power}, Defense: {self.defense}")

    def use_item(self, item):
        if item in self.inventory:
            if isinstance(item, Item):
                if item.duration is not None:  # The item gives a temporary buff
                    self.buffs.append({
                        'effect': item.effect,
                        'duration': item.duration,
                        'original_value': getattr(self, item.effect),
                    })
                    setattr(self, item.effect, getattr(self, item.effect) + item.effect_value)
                else:  # The item gives a permanent effect
                    setattr(self, item.effect, getattr(self, item.effect) + item.effect_value)

                self.inventory.remove(item)
            else:
                print("You can't use that!")
        else:
            print("You don't have that item!")

    def is_dead(self):
        return self.health <= 0