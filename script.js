let intro = document.querySelector('.intro');
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
            intro.style.top = '-100vh';
        }, 2300)
    })
});

//---------------------------------------- Items array with name and color --------------------------------------------//
uiSettings = {
    volume: true,
    showScreen: true,
}

const discoveredItems = new Set();
// Add more if needed to create more items
const itemTypes = [
    {
        capacity: 10,
        name: 'Ruby',
        color: 'red'
    },
    {
        capacity: 5,
        name: 'Sapphire',
        color: 'blue'
    },
    {
        capacity: 2,
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

    const maxNotifications = 4; // Set your desired maximum number here

    const activeScreen = document.querySelector('.gameScreen').style.display !== 'none'
        ? '.gameScreen .notificationSystem'
        : '.startMenuScreen .notificationSystem';
    const notificationSystem = document.querySelector(activeScreen);
    const existingNotifications = notificationSystem.querySelectorAll('.notification');

    // Remove old notifications if we exceed the maximum
    if (existingNotifications.length >= maxNotifications) {
        existingNotifications[0].remove();
    }

    // Add elements to notification
    notification.appendChild(closeButton);
    notification.appendChild(headerText);
    notification.appendChild(messageSpan);

    let fadeOutTimeout;

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

// Opretter et nyt item med en counter og hover-effekt
function createItem(itemType, count = 1) {
    const item = document.createElement('div');
    // Adds styling from CSS .item
    item.classList.add('item');
    // Set background color from itemsTypes
    item.style.backgroundColor = itemType.color
    // Saves name as attribute for identification
    item.dataset.itemName = itemType.name;
    item.dataset.count = count.toString();


//addEventListener for højreclick i inventory
    item.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent the default context menu
        removeItemFromInventory(itemType);
    });

    // Tilføj item counter element
    const counter = document.createElement('div');
    counter.classList.add('item-counter');
    item.appendChild(counter);

    updateCounter(item); // Opdaterer tælleren synligt
    addHoverEvents(item); // Hover-effekt til itemnavn

    return item;
}


//---------------------------------------------- Add and Remove Items-------------------------------------------------//

// Tilføjer items til inventory med tæller
function addItemToInventory(itemType){
    const slots = document.querySelectorAll('.slot');

    if (!discoveredItems.has(itemType.name)) {
        discoveredItems.add(itemType.name);
        showNotification('New item found', `Nice! you found ${itemType.name}!`);
    }

    // Hvis item findes i inventory allerede
    for (let slot of slots) {
        if (slot.hasChildNodes() && slot.firstElementChild.dataset.itemName === itemType.name) {
            const item = slot.firstElementChild;
            const count = parseInt(item.dataset.count || '1');
            const { capacity, name } = itemType;

            if (count < capacity) {
                item.dataset.count = (count + 1).toString();
                updateCounter(item);
                return true;
            }
        }
    }

    // Hvis item ikke findes, oprettes ny stack
    for (let slot of slots) {
        if (!slot.hasChildNodes()) {
            const item = createItem(itemType);
            slot.appendChild(item);
            return true;
        }
    }

    showNotification("Inventory er fuldt!");
    return false;
}


//items bliver fjernet fra inventory
function removeItemFromInventory(itemType){
    const slots = document.querySelectorAll('.slot');

    for (let i = slots.length - 1; i >= 0; i--) {
        const slot = slots[i];
        if (slot.hasChildNodes() && slot.firstChild.dataset.itemName === itemType.name) {
            const item = slot.firstChild;
            let count = parseInt(item.dataset.count || '1');

            if (count > 1) {
                count--;
                item.dataset.count = count.toString();
                updateCounter(item);
            } else {
                slot.removeChild(item);
                showNotification(`${itemType.name} helt fjernet.`);
            }
            return;
        }
    }

    showNotification(`Ingen ${itemType.name} i inventory!`);
}

//---------------------------------------------- Event Listeners -----------------------------------------------------//

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

//----------------------------------------------Andre inventory events------------------------------------------------//

// Opdaterer tælleren på item-elementet
function updateCounter(itemElement) {
    const counter = itemElement.querySelector('.item-counter');
    const count = parseInt(itemElement.dataset.count || '0');

    counter.textContent = count.toString();
    counter.style.display = count > 1 ? 'block' : 'none';
}

// Tilføjer hover-effekt til items med item-navn
function addHoverEvents(item) {
    const showItemTip = () => {
        const itemTip = document.createElement('div');
        itemTip.classList.add('itemNameTip');
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

//-------------------------------------------------- Action box-------------------------------------------------------//

//let energy = 100;
let gold = 50;

const plusKnapGold = document.querySelector(".plusKnapGold");
const minusKnapGold = document.querySelector(".minusKnapGold");
const goldText = document.querySelector("#goldText ");


function gainGold(){
       gold +=5;
       goldText.innerText = gold;

}

function loseGold(){
    goldText.innerText = gold;
    if (gold > 0){
        gold -=5;
    } else if (gold === 0){
        showNotification("You are broke!", "you've lost all your Gold");
    }
}

plusKnapGold.onclick = gainGold;

minusKnapGold.onclick = loseGold;
    document.querySelectorAll('.item-in-action-box').forEach((itemButton) => {

    // Left click to add an item
    itemButton.addEventListener('click', (event) => {
        const itemName = itemButton.textContent.trim();
        const itemType = itemTypes.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (itemType) {
            addItemToInventory(itemType);
        }
    });

        itemButton.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Prevent the default context menu
            const itemName = itemButton.textContent.trim();
            const itemType = itemTypes.find(item => item.name.toLowerCase() === itemName.toLowerCase());
            if (itemType) {
                removeItemFromInventory(itemType);
            }
        });

});



// Initial health value (0 to 100)
let health = 100;

const lifeBar = document.querySelector("#lifeBar");
const lifePercent = document.querySelector("#lifePercent");
const plusKnap = document.querySelector(".plusKnap");
const minusKnap = document.querySelector(".minusKnap");

function updateLifeBar() {
    lifeBar.style.width = health + "%";
    lifePercent.textContent = health + "%";
    if (health <= 0) {
        lifeBar.style.backgroundColor = "red";
        showNotification("You're dead!", "You just lost all your health");
    } else if (health <= 20){
        if (health <= 20)
            lifeBar.style.backgroundColor = "red";
    } else if (health <= 50){
        lifeBar.style.backgroundColor = "orange";

    } else {
        lifeBar.style.backgroundColor = "green";
    }

}

function gainLife() {
    // If already at max health, do nothing
    if (health === 100) return;
    // Increase health by 10, but cap at 100
    health = Math.min(health + 10, 100);
    updateLifeBar();
}

function loseLife() {
    // If already at 0, do nothing
    if (health === 0) return;
    // Decrease health by 10, but not below 0
    health = Math.max(health - 10, 0);
    updateLifeBar();

}

plusKnap.onclick = gainLife;
minusKnap.onclick = loseLife;

updateLifeBar();
