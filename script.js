
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


function removeItem(){

}

