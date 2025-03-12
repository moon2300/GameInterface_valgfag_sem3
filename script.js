
function addItem() {
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {

        if (!slot.hasChildNodes()) {
            const item = document.createElement('div');
            item.classList.add('item');
            slot.appendChild(item);
            break;
        }
    }
}

const clickableItems = document.querySelectorAll('.clickable-item');
clickableItems.forEach(item => {
    item.addEventListener('click', addItem);
});


function removeItem(event) {
// If you click on the item, it should be removes (remove by click on item)
    if (event.target.classList.contains('item')) {
        event.target.parentElement.removeChild(event.target);
    }
// Or if you click on the inventory slot with that has an item in it, it removes it (remove by click on slot)
    else if (event.target.classList.contains('slot') &&
        event.target.hasChildNodes()) {
        event.target.removeChild(event.target.firstChild);
    }

}

const slots = document.querySelectorAll('.slot');
slots.forEach(slot => {
    slot.addEventListener('click', removeItem);
});