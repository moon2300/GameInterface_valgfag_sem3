// Constants and Configurations
const INVENTORY_SIZE = 6;
const MAX_STACK = 5;
const discoveredItems = new Set();

const itemTypes = [
    { name: 'Ruby', color: 'red' },
    { name: 'Sapphire', color: 'blue' },
    { name: 'Emerald', color: 'green' }
];

// Utility Functions
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    notification.addEventListener('animationend', () => notification.remove());
}

// Inventory Management Functions
function findMatchingSlot(itemType) {
    const slots = document.querySelectorAll('.slot');
    return Array.from(slots).find(slot => {
        const item = slot.querySelector('.item');
        return item &&
            item.dataset.itemName === itemType.name &&
            parseInt(item.dataset.count) < MAX_STACK;
    });
}

function findEmptySlot() {
    const slots = document.querySelectorAll('.slot');
    return Array.from(slots).find(slot => !slot.hasChildNodes());
}

// Item Counter Management
function updateCounter(itemElement) {
    let counter = itemElement.querySelector('.item-counter');
    const count = parseInt(itemElement.dataset.count || '0');

    if (!counter) {
        counter = document.createElement('div');
        counter.classList.add('item-counter');
        itemElement.appendChild(counter);
    }

    counter.textContent = count.toString();
    counter.style.display = count > 1 ? 'block' : 'none';
}


// Item Creation and Management
function createItem(itemType, count = 1) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.style.backgroundColor = itemType.color;
    item.dataset.itemName = itemType.name;
    // Convert count to string when setting dataset
    item.dataset.count = count.toString();
    addHoverEvents(item);
    updateCounter(item);
    return item;
}

function addHoverEvents(item) {
    const showItemTip = () => {
        const itemTip = document.createElement('div');
        itemTip.classList.add('itemNameTip');
        // Show only the item name, no count
        itemTip.textContent = item.dataset.itemName;
        item.appendChild(itemTip);
    };

    const hideItemTip = () => {
        const itemTip = item.querySelector('.itemNameTip');
        if (itemTip) itemTip.remove();
    };

    item.addEventListener('mouseenter', showItemTip);
    item.addEventListener('mouseleave', hideItemTip);
}

// Core Game Functions
function addItem(itemIndex) {
    const itemType = itemTypes[itemIndex];

    // Check if this is a new item discovery
    if (!discoveredItems.has(itemType.name)) {
        discoveredItems.add(itemType.name);
        showNotification(`New item found ${itemType.name}!`);
    }

    const matchingSlot = findMatchingSlot(itemType);

    if (matchingSlot) {
        const existingItem = matchingSlot.querySelector('.item');
        if (existingItem) {
            const currentCount = parseInt(existingItem.dataset.count || '1');
            existingItem.dataset.count = (currentCount + 1).toString();
            updateCounter(existingItem);
        }
        return;
    }

    const emptySlot = findEmptySlot();
    if (emptySlot) {
        const item = createItem(itemType);
        emptySlot.appendChild(item);
    } else {
        showNotification('Inventory full');
    }
}



function removeItem(event) {
    const target = event.target;
    const item = target.classList.contains('item') ? target : target.querySelector('.item');

    if (!item) return;

    // Provide default value for count
    const count = parseInt(item.dataset.count || '1');
    if (count > 1) {
        item.dataset.count = (count - 1).toString();
        updateCounter(item);
    } else {
        item.parentElement?.removeChild(item);
    }
}


// Initialization Functions
function createClickableItems() {
    const container = document.querySelector('.item-container');
    itemTypes.forEach((itemType, index) => {
        const clickableItem = document.createElement('div');
        clickableItem.classList.add('clickable-item');
        clickableItem.id = `item-${index + 1}`;
        clickableItem.style.backgroundColor = itemType.color;
        clickableItem.dataset.itemName = itemType.name;
        clickableItem.addEventListener('click', () => addItem(index));
        addHoverEvents(clickableItem);
        container.appendChild(clickableItem);
    });
}

function createInventorySlots() {
    const inventory = document.getElementById('inventory');
    for (let i = 0; i < INVENTORY_SIZE; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.addEventListener('click', removeItem);
        inventory.appendChild(slot);
    }
}

const clickableItems = document.querySelectorAll('.clickable-item');
clickableItems.forEach(item => {
    item.addEventListener('click', addItem);
});




// Initialize Game
function initGame() {
    createClickableItems();
    createInventorySlots();
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);