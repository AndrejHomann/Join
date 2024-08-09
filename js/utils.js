function generateRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#33FFF0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Sorts an array of contacts alphabetically by their name.
 * @param {Object[]} contacts - The array of contact objects to sort.
 * @returns {Object[]} - The sorted array of contacts.
 */
function sortContactsAlphabetically(contacts) {
    return Object.values(contacts).sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}

/**
 * Erstellt ein Kontakt-Icon mit den Initialen des Namens und der zugeordneten Farbe.
 *
 * @param {string} name - Der Name des Kontakts.
 * @param {string} color - Die Farbe, die dem Kontakt zugeordnet ist.
 * @returns {HTMLElement} - Ein div-Element, das das Icon repräsentiert.
 */
function createContactIcon(name, color) {
    const initials = name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();

    const icon = document.createElement('div');
    icon.className = 'contact-icon';
    icon.style.backgroundColor = color;
    icon.textContent = initials;

    return icon;
}