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

/**
 * Returns the current screen width.
 * 
 * @returns {number} The width of the screen in pixels.
 */
function getScreenSize() {
    const screenSize = window.innerWidth;
    return screenSize;
}

/**
 * Toggles between displaying the contact list and contact details
 * based on the current screen size and the status of contact detail view.
 * 
 * - On screens wider than 1130px, both the contact list and details are visible.
 * - On screens smaller than 1130px, either the contact list or the details are shown.
 * 
 * It also handles showing and hiding based on whether a contact is currently displayed.
 */
function toggleContactView() {
    if (getScreenSize() > 1130) {
        document.getElementById('contacts').style.display = 'flex';
        document.getElementById('contactDetailSection').style.display = 'block';
    } else {
        if (currentlyDisplayedContact) {
            document.getElementById('contacts').style.display = 'none';
            document.getElementById('contactDetailSection').style.display = 'block';
        } else {
            document.getElementById('contactDetailSection').style.display = 'none';
            document.getElementById('contacts').style.display = 'block';
        }
    }
}

// Event listener to adjust the view when the window is resized
window.addEventListener('resize', function () {
    const contactSection = document.getElementById('contacts');
    if (contactSection) {
        // Nur ausführen, wenn der Kontaktbereich existiert
        toggleContactView();
    }
});

// Initial view adjustment when the page loads
// window.onload = function () {
//     const contactsElement = document.getElementById('contacts');
//     const contactDetailElement = document.getElementById('contactDetailSection');

//     if (contactsElement && contactDetailElement) {
//         toggleContactView();
//     }
// };

/**
 * Asynchronously loads and inserts HTML content into elements with the `includeHTML` attribute.
 * Fetches the HTML file specified in the `includeHTML` attribute and replaces the element's innerHTML.
 * If the file is not found, it displays 'Page not found'.
 *
 * @async
 * @function includeHTML
 * @returns {Promise<void>} A promise that resolves when all HTML content has been included.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[includeHTML]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("includeHTML");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * Redirects the user to the previous page (typically the log in page) when the button is clicked.
 * 
 * This function uses the browser's history to navigate back to the previous page.
 */
function goBack() {
    if (document.referrer) {
        window.location.href = document.referrer; // Leitet zur vorherigen Seite zurück
    } else {
        window.location.href = 'index.html'; // Fallback: Zur Hauptseite leiten, falls keine Referrer vorhanden ist
    }
    window.close();
}

// Funktion zum Speichern der Initialen im Local Storage
function storeUserInitials(name) {
    const initials = getInitials(name);
    localStorage.setItem('userInitials', initials);
    console.log(`Initialen des Users gespeichert: ${initials}`);
}

// Funktion zum Ermitteln der Initialen
function getInitials(name) {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part[0]).join('');
    return initials.toUpperCase();
}