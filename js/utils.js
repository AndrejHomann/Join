/**
 * Generates a random color from a predefined list of colors. 
 * This color is used to color the contact icon when a new user or contact is added.
 * @returns {string} - A randomly selected hex color code from the predefined list.
 */
function generateRandomColor() {
    const colors = ['#FF5733', '#e3870e', '#3357FF', '#F333FF', '#FF33A8', '#b31010', '#14ab2f', '#efd426fa', '#26b0effa', '#7ac4e5fa', '#a77ae5fa', '#e57ae3fa', '#c55167fa', '#4baf89fa', '#afaf4bfa', '#e79623fa', '#e72323fa', '#bfa46cfa'];
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
 * Creates a contact icon with the initials of the contact's name und the assigned color.
 *
 * @param {string} name - The name of the contact.
 * @param {string} color - The color assigned to the contact.
 * @param {string} size - The size of the icon.
 * @returns {HTMLElement} - A div element which represents the icon.
 */
function createContactIcon(name, color, size) {
    const initials = name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();

    const icon = document.createElement('div');
    icon.className = size === 'large' ? 'contact-icon-large' : 'contact-icon';
    icon.style.backgroundColor = color;
    icon.textContent = initials;

    return icon;
}