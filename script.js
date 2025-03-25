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
        image: 'picz/ruby-gem.png'
    },
    {
        capacity: 5,
        name: 'Sapphire',
        image: 'picz/sapphire.png'
    },
    {
        capacity: 2,
        name: 'Emerald',
        image: 'picz/emerald.png'
    },
    {
        capacity: 5,
        name: 'Amethyst',
        image: 'picz/amethyst.png'
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
        showNotification("Game Notification 🎮", "The game is now paused.");
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
    showNotification("Map Size 🗺️", "Map is shown in full size")
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

document.addEventListener('DOMContentLoaded', () => {
    function showNotification(header, message, progressColor = '#4CAF50', imageUrl = null, tip = null) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.style.display = 'block';

        const progressBackground = document.createElement('div');
        progressBackground.className = 'notification-progress-background';

        const progressBar = document.createElement('div');
        progressBar.classList.add('notification-progress');
        progressBar.style.backgroundColor = progressColor;


        const headerText = document.createElement('h1');
        headerText.classList.add('notificationHeader');
        headerText.textContent = header;

        // Create message container.
        const messageText = document.createElement('div');
        messageText.classList.add('notificationMessage');
        messageText.textContent = message;

        // If an image URL is provided, append the image inside the message container.
        if (imageUrl) {
            const inlineImage = document.createElement('img');
            inlineImage.src = imageUrl;
            inlineImage.alt = header;
            inlineImage.classList.add('notification-image');
            messageText.appendChild(inlineImage);
        }

        // Create a tip element if tip text is provided.
        let tipText = null;
        if (tip) {
            tipText = document.createElement('div');
            tipText.classList.add('notificationTip');
            tipText.textContent = tip;
        }

        const closeButton = document.createElement('button');
        closeButton.classList.add('closeNotification');
        closeButton.innerHTML = '&times;';

        const maxNotifications = 4;
        const activeScreen = document.querySelector('.gameScreen').style.display !== 'none'
            ? '.gameScreen .notificationSystem'
            : '.startMenuScreen .notificationSystem';
        const notificationSystem = document.querySelector(activeScreen);
        const existingNotifications = notificationSystem.querySelectorAll('.notification');

        if (existingNotifications.length >= maxNotifications) {
            existingNotifications[0].remove();
        }

        // Append elements to the notification in the desired order.
        notification.appendChild(progressBackground);
        notification.appendChild(progressBar);
        notification.appendChild(closeButton);
        notification.appendChild(headerText);
        notification.appendChild(messageText);
        // Append tip element if provided.
        if (tipText) {
            notification.appendChild(tipText);
        }

        let fadeOutTimeout;
        const startFadeOutTimer = () => {
            clearTimeout(fadeOutTimeout);
            progressBar.style.animation = 'progress-bar-shrink 4s linear forwards';
            fadeOutTimeout = setTimeout(() => {
                if (notification.isConnected) {
                    notification.style.animation = 'slideOut 0.5s ease forwards';
                }
            }, 4000);
        };

        notification.addEventListener('mouseenter', () => {
            clearTimeout(fadeOutTimeout);
        });

        notification.addEventListener('mouseleave', () => {
            startFadeOutTimer();
        });

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
        startFadeOutTimer();
    }
    // Make showNotification available globally
    window.showNotification = showNotification;
});


//---------------------------------- Creates Items to place indside inventory slots ----------------------------------//

// Opretter et nyt item med en counter og hover-effekt
function createItem(itemType, count = 1) {
    // Create a container that is draggable
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('item');
    itemContainer.dataset.itemName = itemType.name;
    itemContainer.dataset.count = count.toString();
    itemContainer.draggable = true;

    // Create the image element and disable its draggable behavior
    const img = document.createElement('img');
    img.src = itemType.image;
    img.alt = itemType.name;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    img.draggable = false; // Disable dragging on the image itself
    itemContainer.appendChild(img);

    // Create and append the counter element
    const counter = document.createElement('div');
    counter.classList.add('item-counter');
    counter.textContent = count.toString();
    itemContainer.appendChild(counter);

    // Attach drag event listeners to the container only
    itemContainer.addEventListener('dragstart', dragStart);
    itemContainer.addEventListener('dragend', dragEnd);

    // Add hover events for showing the label
    addHoverEvents(itemContainer);

    // Optionally, add a click event for removal
    itemContainer.addEventListener('click', () => {
        removeSingleItemFromClickedSlot(itemContainer.parentElement, itemType);
    });

    updateCounter(itemContainer);
    return itemContainer;
}






//---------------------------------------------- Add and Remove Items-------------------------------------------------//

// Tilføjer items til inventory med tæller
function addItemToInventory(itemType){
    const slots = document.querySelectorAll('.slot');

    if (!discoveredItems.has(itemType.name)) {
        discoveredItems.add(itemType.name);
        showNotification('New discovery!✨', `You found a ${itemType.name}! `, '#4CAF50', itemType.image, 'Tip: Check your achievements for... .');
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

    showNotification("Inventory Notification 🎒", "Inventory er fuldt!");
    return false;
}

//----------------------------------------------Andre inventory events------------------------------------------------//

function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


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
        // Set the innerHTML of the cursor element to an image tag and a counter
        cursorElement.innerHTML = `
      <img src="${cursorItem.itemType.image}" alt="${cursorItem.itemType.name}" style="width:100%; height:100%; object-fit:cover;" />
      <div class="cursor-counter">${cursorItem.count}</div>
    `;
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
        showNotification("Element Notification", `${itemType.name} completely removed.`);
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

//------------------------------------------------- trash can --------------------------------------------------------//

// Hent skraldespand-containeren
const trashContainer = document.getElementById('trash-container');

// Tillad drop ved at forhindre standarden
trashContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// Vis visuel feedback når et item trækkes over skraldespanden
trashContainer.addEventListener('dragenter', (e) => {
    e.preventDefault();
    trashContainer.classList.add('drag-over');
});

trashContainer.addEventListener('dragleave', () => {
    trashContainer.classList.remove('drag-over');
});

// Håndter drop eventet
trashContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    trashContainer.classList.remove('drag-over');

    // Tjek om der findes et draggedItem (globalt variabel, som bruges i dit nuværende drag-drop setup)
    if (draggedItem) {
        // Fjern item'et fra dets forælder (altså fra inventory)
        draggedItem.parentElement.removeChild(draggedItem);
        showNotification(`${draggedItem.dataset.itemName} thrown out`, "Item is removed from inventory");
        draggedItem = null;
        updateCursor();
    }
});
