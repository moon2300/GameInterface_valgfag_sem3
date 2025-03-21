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
//------------------------------------------------ Splash Screen -----------------------------------------------------//

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

//----------------------------------------------- Show Screen --------------------------------------------------------//

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

const startMenuScreen = document.querySelector(".startMenuScreen");
const gameScreen = document.querySelector(".gameScreen");
const backToStartMenuButton = document.querySelector(".setting-start-menu-knap");


function returnToStartMenu() {
    gameScreen.style.display = "none";
    startMenuScreen.style.display = "grid";
    closeOverlay();
}

// Attach event listener to the button
backToStartMenuButton.addEventListener("click", returnToStartMenu);

document.querySelector('.gameScreen').style.display = 'none';

document.querySelector('.newGame').addEventListener('click', shownScreen);


const startScreenOverlay = document.querySelector(".startMenuScreenOverlay");
const settingsButtonStart = document.querySelector("#settings");
const settingsButton = document.querySelector(".settings");
const gameOverlay = document.querySelector(".overlayGameScreen");
const closeButtons = document.querySelectorAll(".x-button");


settingsButtonStart.addEventListener('click', () => showOverlay('start'));
settingsButton.addEventListener('click', () => showOverlay('game'));

closeButtons.forEach(button => button.addEventListener('click', closeOverlay));

function showOverlay(type) {
    if (type === 'start') {
        startScreenOverlay.style.display = "flex";
    } else if (type === 'game') {
        gameOverlay.style.display = "flex"; // Ensure this matches the correct overlay
        showNotification("The game is now paused.");
    }
}

// Function to close the overlay
function closeOverlay() {
    startScreenOverlay.style.display = "none";
    gameOverlay.style.display = "none";
}


const miniMap = document.querySelector('.mini-map');

miniMap.addEventListener('click',openMinimap)

function openMinimap (){
    showNotification("Map is shown in full size")
}

//------------------------------------- Settings and volume on StartMenuScreen ---------------------------------------//

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

//------------------------------------------------ Notifications -----------------------------------------------------//

function showNotification(header, message) {

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.display = 'block';

    const headerText = document.createElement('h1');
    headerText.classList.add('notificationHeader');
    headerText.textContent = header;

    // Create message span
    const messageText = document.createElement('div');
    messageText.classList.add('notificationMessage');
    messageText.textContent = message;

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
    notification.appendChild(messageText);

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
    item.classList.add('item');
    item.style.backgroundColor = itemType.color;
    item.dataset.itemName = itemType.name;
    item.dataset.count = count.toString();

    item.draggable = true;
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);

    // Use the corrected handler clearly isolating the clicked slot
    item.addEventListener('click', (event) => {
        removeSingleItemFromClickedSlot(event.currentTarget.parentElement, itemType);
    });

    const counter = document.createElement('div');
    counter.classList.add('item-counter');
    item.appendChild(counter);

    updateCounter(item);
    addHoverEvents(item);

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
            const { capacity} = itemType;

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


let draggedItem = null;

function dragStart(e) {
    draggedItem = e.target;
    draggedItem.classList.add('dragging');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');

    setTimeout(() => {
        draggedItem.style.visibility = 'hidden';
    }, 0);
}

function dragEnd() {
    if (draggedItem) {
        draggedItem.style.visibility = 'visible';
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
}


// Setup drag-and-drop events on slots
function initializeInventoryDragAndDrop() {
    const slots = document.querySelectorAll('.slot');

    slots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', dropItem);
    });
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
}

function dragLeave() {
    this.classList.remove('drag-over');
}

function dropItem() {
    this.classList.remove('drag-over');

    if (cursorItem.count > 0) {
        handleCursorDrop(this);
        return;
    }

    if (!draggedItem) return;

    if (this.children.length === 0) {
        this.appendChild(draggedItem);
    } else {
        swapItems(this, draggedItem.parentElement);
    }
}


// Function to clearly handle dropping cursor-held items
function handleCursorDrop(slot) {
    if (!cursorItem.itemType || cursorItem.count === 0) return;

    if (!slot.hasChildNodes()) {
        // Add cursor stack to empty slot
        const item = createItem(cursorItem.itemType, cursorItem.count);
        slot.appendChild(item);
        cursorItem.itemType = null;
        cursorItem.count = 0;
        updateCursor();
    } else {
        const slotItem = slot.firstElementChild;
        const slotItemType = itemTypes.find(it => it.name === slotItem.dataset.itemName);

        if (slotItemType.name === cursorItem.itemType.name) {
            // Combine cursor stack with existing stack if same type
            const total = parseInt(slotItem.dataset.count) + cursorItem.count;
            if (total <= slotItemType.capacity) {
                slotItem.dataset.count = total.toString();
                cursorItem.count = 0;
                updateCounter(slotItem);
                updateCursor();
            } else {
                const overflow = total - slotItemType.capacity;
                slotItem.dataset.count = slotItemType.capacity.toString();
                cursorItem.count = overflow;
                updateCounter(slotItem);
                updateCursor();
            }
        } else {
            showNotification("Item mismatch", "You can only stack identical items!");
        }
    }
}


// Swap items between two slots
function swapItems(slot1, slot2) {
    const item1 = slot1.firstElementChild;
    const item2 = slot2.firstElementChild;

    slot1.appendChild(item2);
    slot2.appendChild(item1);
}

//-----------------------------------------cursor events for inventory -----------------------------------------------//
// Cursor State
const cursorItem = {
    itemType: null,
    count: 0
};

const cursorElement = document.getElementById('cursor-item');

document.addEventListener('mousemove', (e) => {
    cursorElement.style.top = `${e.clientY + 5}px`;
    cursorElement.style.left = `${e.clientX + 5}px`;
});

function updateCursor() {
    if (cursorItem.itemType && cursorItem.count > 0) {
        cursorElement.style.display = 'block';
        cursorElement.style.backgroundColor = cursorItem.itemType.color;
        cursorElement.innerHTML = `<div class="cursor-counter">${cursorItem.count}</div>`;
    } else {
        cursorElement.style.display = 'none';
        cursorElement.innerHTML = '';
        cursorItem.itemType = null;
        cursorItem.count = 0;
    }
}


// This single handler clearly distinguishes between normal click and shift-click
function handleSlotClick(e) {
    e.preventDefault();

    const slot = e.currentTarget;

    const slotHasItem = slot.hasChildNodes();
    const slotItem = slotHasItem ? slot.firstElementChild : null;
    const slotItemType = slotHasItem ? itemTypes.find(it => it.name === slotItem.dataset.itemName) : null;

    if (e.shiftKey && slotHasItem) {
        // Always prioritize shift-click behavior clearly separated:
        shiftClickPickupOneItem(e, slot);
    } else if (cursorItem.count > 0) {
        // Clearly handle cursor drop if holding items:
        handleCursorDrop(slot);
    } else if (slotHasItem) {
        // Normal click removal:
        removeSingleItemFromClickedSlot(slot, slotItem, slotItemType);
    }
}



// Clearly define the normal click removal function (isolated from others)
function removeSingleItemFromClickedSlot(slot, slotItem, itemType) {
    let count = parseInt(slotItem.dataset.count || '1');

    if (count > 1) {
        count--;
        slotItem.dataset.count = count.toString();
        updateCounter(slotItem);
    } else {
        slot.removeChild(slotItem);
        showNotification(`${itemType.name} completely removed.`);
    }
}

// Clearly define the shift-click handler (isolated logic)
function shiftClickPickupOneItem(e, slot) {
    if (!slot.hasChildNodes()) return;

    const slotItem = slot.firstElementChild;
    const slotItemType = itemTypes.find(it => it.name === slotItem.dataset.itemName);
    let slotCount = parseInt(slotItem.dataset.count);

    if (slotCount <= 0) return;

    if (!cursorItem.itemType) {
        cursorItem.itemType = slotItemType;
        cursorItem.count = 1;
        slotCount -= 1;
    } else if (cursorItem.itemType.name === slotItemType.name) {
        cursorItem.count += 1;
        slotCount -= 1;
    } else {
        showNotification("Item mismatch", "You can only stack similar items!");
        return;
    }

    if (slotCount === 0) {
        slot.removeChild(slotItem);
    } else {
        slotItem.dataset.count = slotCount.toString();
        updateCounter(slotItem);
    }

    updateCursor();
}


// Clearly attach the single combined event listener to all slots:
function initializeInventoryClickListeners() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.addEventListener('click', handleSlotClick);
    });
}

// Call this on DOM load:
window.addEventListener('DOMContentLoaded', () => {
    initializeInventoryClickListeners();
    initializeInventoryDragAndDrop();
});

//-------------------------------------------------- Health bar -------------------------------------------------------//

// Initial health value (0 to 100)
let health = 100;
let wasHealthFullBefore = true; // Tracks if health was previously at 100

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
    } else if (health <= 20) {
        lifeBar.style.backgroundColor = "red";
    } else if (health <= 50) {
        lifeBar.style.backgroundColor = "orange";
    } else {
        lifeBar.style.backgroundColor = "green";
    }

    // Only show "Health is Full" if health was previously lower than 100
    if (health === 100 && !wasHealthFullBefore) {
        showNotification("Health Restored", "Your health is full!");
        wasHealthFullBefore = true;
    }

    if (health < 100) {
        wasHealthFullBefore = false;
    }
}

function gainLife() {
    if (health < 100) {
        health = Math.min(health + 10, 100);
        updateLifeBar();
    }
}

function loseLife() {
    if (health > 0) {
        health = Math.max(health - 10, 0);
        updateLifeBar();
    }
}

plusKnap.onclick = gainLife;
minusKnap.onclick = loseLife;

//----------------------------------------------------- Gold ---------------------------------------------------------//

updateLifeBar();
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
    itemButton.addEventListener('click', () => {
        const itemName = itemButton.textContent.trim();
        const itemType = itemTypes.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (itemType) {
            addItemToInventory(itemType);
        }
    });


});


//------------------------------------------------------ Chat --------------------------------------------------------//

// Chat functionality
const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    // Initialize chat with saved messages
    document.getElementById('chatMessages')?.append(
        ...chatMessages.map(msg => createMessageElement(msg.message, msg.timestamp))
    );

    // Event listeners
    document.getElementById("msg")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            sendMessage();
        }
    });

    document.querySelector(".chat-send")?.addEventListener("click", sendMessage);

    // Add clear chat button listener
    document.querySelector(".chat-clear")?.addEventListener("click", clearChat);
});

// Add the clear chat function
function clearChat() {
    // Clear the messages array
    chatMessages.length = 0;

    // Clear localStorage
    localStorage.setItem('chatMessages', '[]');

    // Clear the chat messages from DOM
    const chatMessagesDiv = document.getElementById("chatMessages");
    if (chatMessagesDiv) {
        chatMessagesDiv.innerHTML = '';
    }

    // Optional: Show a notification that chat was cleared
    showNotification("Chat Cleared", "All messages have been removed");
}


function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.querySelector(".chat-toggle").style.display = "none";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.querySelector(".chat-toggle").style.display = "block";
}


function formatTimestamp(date) {
    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
}

function createMessageElement(message, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    messageElement.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <span class="message-timestamp">${timestamp}</span>
        </div>
    `;
    return messageElement;
}

function sendMessage() {
    const messageInput = document.getElementById("msg");
    const message = messageInput.value.trim();

    if (message) {
        const timestamp = formatTimestamp(new Date());
        const messageData = { message, timestamp };

        // Save to array and localStorage
        chatMessages.push(messageData);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));

        // Add message to chat
        const chatMessagesDiv = document.getElementById("chatMessages");
        chatMessagesDiv.appendChild(createMessageElement(message, timestamp));

        // Clear input and scroll to bottom
        messageInput.value = "";
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
}


