
//---------------------------------------- Items array with name and color --------------------------------------------//
uiSettings = {
    volume: true,
    showScreen: true,
}

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

function showNotification(message) {
   // const existingNotification = document.querySelector('.notification');

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.querySelector('.notifications').appendChild(notification);

    notification.addEventListener('animationend', () => notification.remove());
}


//---------------------------------- Creates Items to place indside inventory slots ----------------------------------//

// Opretter et nyt item med en counter og hover-effekt
function createItem(itemType, count = 1) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.style.backgroundColor = itemType.color;
    item.dataset.itemName = itemType.name;
    item.dataset.count = count.toString();

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

    // Hvis item findes i inventory allerede
    for (let slot of slots) {
        if (slot.hasChildNodes() && slot.firstElementChild.dataset.itemName === itemType.name) {
            const item = slot.firstElementChild;
            const count = parseInt(item.dataset.count || '1');
            const { capacity, name } = itemType;

            if (count < capacity) {
                item.dataset.count = (count + 1).toString();
                updateCounter(item);
                showNotification(`${name} blev lagt til stakken! (antal: ${count + 1})`);
                return true;
            }
        }
    }

    // Hvis item ikke findes, oprettes ny stack
    for (let slot of slots) {
        if (!slot.hasChildNodes()) {
            const item = createItem(itemType);
            slot.appendChild(item);
            showNotification(`${itemType.name} blev tilføjet til dit inventory!`);
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
                showNotification(`Én ${itemType.name} fjernet. (antal tilbage: ${count})`);
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



const settingsButton = document.querySelector('.settings');
settingsButton.addEventListener('click',() => {
    console.log("det virker");
    openSettings();
});


function openSettings() {
    showNotification("Settings menu is open");
}

//-------------------------------------------------------andre events-------------------------------------------------//

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

//-------------------------------------------------- action box-------------------------------------------------------//

//let energy = 100;
//let gold = 50;

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
    const actionButtonsContainer = document.querySelector('.action-buttons-container');
    actionButtonsContainer.innerHTML = ''; // Ryd container først

    const collectContainer = document.createElement('div');
    collectContainer.classList.add('collect-items-container');

    itemTypes.forEach(itemType => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('collect-item');

        // minusknap
        const minusKnap = document.createElement('div');
        minusKnap.classList.add('minusKnap');
        minusKnap.textContent = '-';
        minusKnap.onclick = () => removeItemFromInventory(itemType);

        // Item navn (almindelig div i stedet for button)
        const itemLabel = document.createElement('div');
        itemLabel.classList.add('item-label');
        itemLabel.textContent = itemType.name;

        // plusknap
        const plusKnap = document.createElement('div');
        plusKnap.classList.add('plusKnap');
        plusKnap.textContent = '+';
        plusKnap.onclick = () => addItemToInventory(itemType);

        itemDiv.appendChild(minusKnap);
        itemDiv.appendChild(itemLabel);
        itemDiv.appendChild(plusKnap);

        collectContainer.appendChild(itemDiv);
    });

    // Tilføj enkelt "Return to Town"-knap nedenfor
    const returnBtn = document.createElement('button');
    returnBtn.classList.add('return-button');
    returnBtn.textContent = 'Return to cave entrance';
    returnBtn.onclick = goCave;

    collectContainer.appendChild(returnBtn);

    actionButtonsContainer.appendChild(collectContainer);

    actionText.innerText = "You see colorful crystals and stones around. Which one will you take?";
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
