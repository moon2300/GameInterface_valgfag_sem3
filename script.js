
//---------------------------------------- Items array with name and color --------------------------------------------//

// Add more if needed to create more items
const itemTypes = [
    {
        name: 'Ruby',
        color: 'red'
    },
    {
        name: 'Sapphire',
        color: 'blue'
    },
    {
        name: 'Emerald',
        color: 'green'
    }

]

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

        // Adds click function that calls addItem with specific itemType
        clickableItem.onclick =() => addItem (itemType);

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
// If you click directly on item
    if (event.target.classList.contains('item')) {
        event.target.parentElement.removeChild(event.target);
    }
// Or if you click on a slot that contains an item
    else if (event.target.classList.contains('slot') &&
        event.target.hasChildNodes()) {
        event.target.removeChild(event.target.firstChild);
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
