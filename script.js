
//---------------------------------------- Items array with name and color --------------------------------------------//
uiSettings = {
    volume: true,
    showScreen: true,
    gameMenuVisible: true,
}


// Add more if needed to create more items
const itemTypes = [
    {
        capacity: 5,
        name: 'Ruby',
        color: 'red'
    },
    {
        capacity: 5,
        name: 'Sapphire',
        color: 'blue'
    },
    {
        capacity: 5,
        name: 'Emerald',
        color: 'green'
    },
    {
        capacity: 5,
        name: 'Amethyst',
        color: 'purple'
    }

]

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.querySelector('.notifications').appendChild(notification);

    notification.addEventListener('animationend', () => notification.remove());
}


//---------------------------------- Creates Items to place indside inventory slots ----------------------------------//

function createItem(itemType) {
    // Creates new div element
    const item = document.createElement('div');
    // Adds styling from CSS .item
    item.classList.add('item');
    // Set background color from itemsTypes
    item.style.backgroundColor = itemType.color
    // Saves name as attribute for identification
    item.dataset.itemName = itemType.name;
    return item;
}


//--------------------------------------- Creates the Items outside inventory ----------------------------------------//

function createClickableItem() {
    // Finds items-container div
    const container = document.querySelector('.item-container')

    // For each ItemsType in the array
    itemTypes.forEach(itemType => {

        // Makes new clickable dic element
        const clickableItem = document.createElement('div');
        // Adds styling from CSS .clickable-item
        clickableItem.classList.add('clickable-item');
        // Sets color from itemsTypes array
        clickableItem.style.backgroundColor = itemType.color;
        //Store the item name on the clickable element
        clickableItem.dataset.itemName = itemType.name;

        // Adds click function that calls addItem with specific itemType
        clickableItem.onclick =() => {
            addItem (itemType);
            //fjerner items fra screen når de bliver klikket på
            clickableItem.style.display = 'none';
        }
        // Adds clickableItem to container
        container.appendChild(clickableItem);
    });
}


//---------------------------------------------- Add and Remove Items-------------------------------------------------//

// Adds Item to first empty slot
function addItem(itemType) {
    // Finds all inventory slot
    const slots = document.querySelectorAll('.slot');

    // Looks at all slots
    for (let slot of slots) {
        // If slots has no item
        if (!slot.hasChildNodes()) {
            // Makes new item
            const item = createItem(itemType);
            // Adds item to empty slot
            slot.appendChild(item);
            // Stops when first empty slot is found
            break;
        }
    }
}


// Removes items when clicked
function removeItem(event) {
    if (event.target.classList.contains('item')) {
        const itemName = event.target.dataset.itemName;
        event.target.parentElement.removeChild(event.target);

        // Find the corresponding clickable item and show it again
        const clickableItems = document.querySelectorAll('.clickable-item');
        clickableItems.forEach(clickable => {
            if (clickable.dataset.itemName === itemName) {
                clickable.style.display = 'block';
            }
        });
    }
}

//---------------------------------------------- Event Listeners -----------------------------------------------------//

// Generate the clickable items
createClickableItem();


// Adds click event to all slots to items can be removed
const slots = document.querySelectorAll('.slot');
slots.forEach(slot => {
    slot.addEventListener('click', removeItem);
});

const volumeButton = document.querySelector('#volumeToggle');
volumeButton.addEventListener('click', volumeToggle);
function volumeToggle () {
    const volumeOn = volumeButton.querySelector('#volumeOn');
    const volumeOff = volumeButton.querySelector('#volumeOff');
    if (uiSettings.volume === true) {
        uiSettings.volume = false
        volumeOn.style.display = 'none';
        volumeOff.style.display = 'block';
        showNotification('Volume off');

    } else {
        uiSettings.volume = true
        volumeOn.style.display = 'block';
        volumeOff.style.display = 'none';
        showNotification('Volume on');
    }
}

function shownScreen() {
    const startScreen = document.querySelector('.startMenuScreen');
    const gameScreen = document.querySelector('.gameScreen');
    if (uiSettings.showScreen) {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'grid';
    } else {
        startScreen.style.display = 'grid';
        gameScreen.style.display = 'none';
    }

    uiSettings.showScreen = !uiSettings.showScreen;
}

document.querySelector('.gameScreen').style.display = 'none';

document.querySelector('.newGame').addEventListener('click', shownScreen);



const settingsButton = document.querySelector('.settings');
settingsButton.addEventListener('click',() => {
    showNotification("Settings menu is open");
    openSettings();
});


function openSettings() {
    showNotification("Settings menu is open");
}