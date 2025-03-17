let intro = document.querySelector('.intro');
let logo = document.querySelector('.logoHeader');
let logoSpan = document.querySelectorAll('.logo');

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        logoSpan.forEach((span, idx)=>{
            setTimeout(() => {
                span.classList.add('active');
            },(idx + 1) * 400)
        });
        setTimeout(() => {
            logoSpan.forEach((span, idx) =>{
                setTimeout(() => {
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, (idx + 1) * 50)
            })
        }, 2000);
        setTimeout(() => {
            intro.style.top = '100vh';
        }, 2300)
    })
});

//---------------------------------------- Items array with name and color --------------------------------------------//
uiSettings = {
    volume: true,
    showScreen: true,
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

function showNotification(header, message) {





    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.display = 'block';

    const headerText = document.createElement('h1');
    headerText.classList.add('notificationHeader');
    headerText.textContent = header;

    // Create message span
    const messageSpan = document.createElement('span');
    messageSpan.classList.add('notificationMessage');
    messageSpan.textContent = message;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('closeNotification');
    closeButton.innerHTML = '&times;';

    const maxNotifications = 3; // Set your desired maximum number here

    const activeScreen = document.querySelector('.gameScreen').style.display !== 'none'
        ? '.gameScreen .notificationSystem'
        : '.startMenuScreen .notificationSystem';
    const notificationSystem = document.querySelector(activeScreen);
    const existingNotifications = notificationSystem.querySelectorAll('.notification');


    // Add elements to notification
    notification.appendChild(closeButton);
    notification.appendChild(headerText);
    notification.appendChild(messageSpan);

    let fadeOutTimeout;

    // Remove oldest notifications if we exceed the maximum
    if (existingNotifications.length >= maxNotifications) {
        existingNotifications[0].remove();
    }
    // Function to start/reset the fadeout timer
    const startFadeOutTimer = () => {
        clearTimeout(fadeOutTimeout); // Clear any existing timeout
        fadeOutTimeout = setTimeout(() => {
            if (notification.isConnected) {
                notification.style.animation = 'slideOut 0.5s ease forwards';
            }
        }, 4000);
    };

    // Mouse enter - clear the timeout
    notification.addEventListener('mouseenter', () => {
        clearTimeout(fadeOutTimeout);
    });

    // Mouse leave - restart the timeout
    notification.addEventListener('mouseleave', () => {
        startFadeOutTimer();
    });

    // Close button handler
    closeButton.addEventListener('click', () => {
        clearTimeout(fadeOutTimeout);
        notification.remove();
    });

    notification.addEventListener('animationend', (e) => {
        if (e.animationName === 'slideOut') {
            notification.remove();
        }
    });

    document.querySelector(activeScreen).appendChild(notification);

    // Start initial fadeout timer
    startFadeOutTimer();
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
        showNotification("Sound Notification🔇", "Volume is turned off");

    } else {
        uiSettings.volume = true
        volumeOn.style.display = 'block';
        volumeOff.style.display = 'none';
        showNotification("Sound Notification🔊", "Volume is turned on");
    }
}

function shownScreen() {
    const startScreen = document.querySelector('.startMenuScreen');
    const gameScreen = document.querySelector('.gameScreen');
    if (uiSettings.showScreen === true) {
        uiSettings.showScreen = false
        startScreen.style.display = 'none';
        gameScreen.style.display = 'grid';
    } else {
        uiSettings.showScreen = true
        startScreen.style.display = 'grid';
        gameScreen.style.display = 'none';
    }
}

document.querySelector('.gameScreen').style.display = 'none';

document.querySelector('.newGame').addEventListener('click', shownScreen);


const settingsButtonStart = document.querySelector('#settings');
settingsButtonStart.addEventListener('click',openSettings)
const settingsButton = document.querySelector('.settings');
settingsButton.addEventListener('click',openSettings)


function openSettings() {
    showNotification("Settings Notification⚙", "Settings menu is open");
}

//-------------------------------------------------- action box-------------------------------------------------------//

let energy = 100;
let gold = 50;

const valg1 = document.querySelector("#valg1");
const valg2 = document.querySelector("#valg2");
const valg3 = document.querySelector("#valg3");
const actionText = document.querySelector("#text");


function update(action) {
    valg1.innerText = action["button text"][0];
    valg2.innerText = action["button text"][1];

    valg1.onclick = action["button function"][0];
    valg2.onclick = action["button function"][1];

    if (action["button text"][2]) {
        valg3.style.display = 'inline-block';
        valg3.innerText = action["button text"][2];
        valg3.onclick = action["button function"][2];
    } else {
        valg3.style.display = 'none';
    }

    actionText.innerText = action.text;
}


const gameActions = [
    {
        name: "Town",
        "button text": ["Explore cave", "Go to store"],
        "button function": [goCave, goStore],
        text: "You are back in the town square!. "
    },
    {
        name: "Store",
        "button text": ["Buy life", "Buy weapon", "Return to Town"],
        "button function": [buyLife, buyWeapon, townSquare],
        text: "You are in the store! what would you like to buy?"
    },
    {
        name: "Cave",
        "button text": ["Return to Town", "Fight Dragon", "Explore deeper"],
        "button function": [townSquare, fightMonster, collectItems],
        text: "You are in the cave."
    },
    {
        name: "deep cave",
        "button text": ["Ruby", "Emerald", "Sapphire"],
        "button function": [townSquare, fightMonster, townSquare],
        text: "You see colorful crystals and stones laying around, would you like to take some with you?."
    }
];



valg1.onclick = goCave;
valg2.onclick = goStore;
valg3.onclick = fightMonster;

function townSquare(){
    update(gameActions[0]);
    valg3.style.display = 'none';
}
function goStore(){
    update(gameActions[1]);
}
function goCave(){
    update(gameActions[2]);
}

function collectItems() {
    update(gameActions[3]);
}
function buyLife(){
    actionText.innerText = "You bought more life!";
}

function buyWeapon(){
    actionText.innerText = "You bought a new weapon!";
}

function fightMonster(){
    actionText.innerText = "You are fighting the monster!";
}
