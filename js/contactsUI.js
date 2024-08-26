let currentlyDisplayedContact = null;


/**
 * Displays the contacts grouped by the first letter of their names into alphabetical sections.
 * Each contact element is made clickable to show the contact details when selected.
 * 
 * @param {Object[]} contacts - An array of contact objects to be displayed.
 * 
 * The function clears the existing contact list, groups the contacts alphabetically, 
 * appends them to their respective sections, and adds event listeners to handle user interaction.
 */
function displayContacts(contacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = ''; // Clear any existing contacts

    const groupedContacts = groupContactsByFirstLetter(contacts);
    appendContactSections(groupedContacts, contactList);
    addContactListEventListener(contactList);
}

/**
 * Groups the contacts by the first letter of their names.
 * 
 * @param {Object[]} contacts - An array of contact objects.
 * @param {string} contacts[].name - The name of the contact.
 * @returns {Object} An object where each key is a letter, and each value is an array of contacts
 *                   whose names start with that letter.
 * 
 * The function iterates over the array of contacts and groups them by the first letter of their names.
 * The result is an object where the keys are uppercase letters, and the values are arrays of contacts.
 */
function groupContactsByFirstLetter(contacts) {
    return contacts.reduce((acc, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(contact);
        return acc;
    }, {});
}

/**
 * Appends alphabetically sorted contact sections to the contact list. 
 * Each section is identified by the first letter of the contact names and contains a title 
 * (the letter) and a separator line.
 * 
 * @param {Object} groupedContacts - An object where each key is a letter, and each value is an array 
 *                                   of contacts whose names start with that letter.
 * @param {HTMLElement} contactList - The DOM element representing the contact list.
 * 
 * The function sorts the contact sections alphabetically, creates a title and separator for each section,
 * and appends the corresponding contacts under each section.
 */
function appendContactSections(groupedContacts, contactList) {
    Object.keys(groupedContacts).sort().forEach(letter => {
        const sectionTitle = createSectionTitle(letter);
        const separator = createSeparator();

        contactList.appendChild(sectionTitle);
        contactList.appendChild(separator);

        appendContactElements(groupedContacts[letter], contactList);
    });
}

/**
 * Adds an event listener to the contact list element that listens for click events. 
 * When a contact list item is clicked, it triggers the `hideContactDetails()` function 
 * to hide the currently displayed contact details and remove the active state from 
 * the list element.
 * 
 * @param {HTMLElement} contactList - The DOM element representing the contact list.
 * @listens click - The event type being listened for on the contact list element.
 */
function addContactListEventListener(contactList) {
    contactList.addEventListener('click', function () {
        if (currentlyDisplayedContact) {
            hideContactDetails();
            currentlyDisplayedContact = null;
        }
    });
}

/**
 * Appends contact elements to the contact list by converting each contact into a 
 * visual list item. Each contact element is made clickable, allowing the user to 
 * view the contact details.
 * 
 * @param {Array<Object>} contacts - The array of contact objects to be displayed.
 * @param {HTMLElement} contactList - The DOM element representing the contact list.
 */
function appendContactElements(contacts, contactList) {
    contacts.forEach(contact => {
        const contactElement = createContactElement(contact);
        contactList.appendChild(contactElement);
        addContactClickListener(contactElement, contact);
    });
}

/**
 * Creates a section title in alphabetical position and order and shows the title as a letter.
 * @param {string} letter - The alphabetical letter.
 * @returns - returns the section title as a letter.
 */
function createSectionTitle(letter) {
    const sectionTitle = document.createElement('p');
    sectionTitle.className = 'abc-order';
    sectionTitle.textContent = letter;
    return sectionTitle;
}

function createSeparator() {
    const separator = document.createElement('div');
    separator.className = 'underline';
    return separator;
}

/**
 * Creates a visual contact element (div) representing the contact, including an icon 
 * with the contact's initials and assigned color. The contact's name and email are 
 * displayed within the element, and the Firebase ID is stored as a data attribute.
 * 
 * @param {Object} contact - The contact object containing the details of the contact.
 * @param {string} contact.id - The unique identifier of the contact in Firebase.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.color - The color assigned to the contact.
 * @returns {HTMLElement} - The created contact element (div).
 */
function createContactElement(contact) {
    const contactElement = document.createElement('div');
    contactElement.className = 'contact-item';
    contactElement.dataset.contactId = contact.id;
    const contactIcon = createContactIcon(contact.name, contact.color);
    contactElement.innerHTML = createContactElementDiv(contactIcon, contact.name, contact.email);
    return contactElement;
}

/**
 * Adds a click event listener to a contact element in the contact list. 
 * When the element is clicked, it triggers the handleContactClick function 
 * to toggle the contact's details visibility and the active state of the element.
 * 
 * @param {HTMLElement} contactElement - The DOM element representing a contact in the list.
 * @param {Object} contact - The contact object containing the contact's details.
 * @listens click - The event type being listened for a click on the contact element.
 */
function addContactClickListener(contactElement, contact) {
    contactElement.addEventListener('click', function (event) {
        event.stopPropagation();
        handleContactClick(contactElement, contact); // Übergebe beide Parameter
    });
}

/**
 * Handles the click event on a contact element by toggling the visibility 
 * of the contact's details and updating the element's active state.
 * 
 * @param {HTMLElement} contactElement - The DOM element representing the clicked contact.
 * @param {Object} contact - The contact object containing the contact's details.
 */
function handleContactClick(contactElement, contact) {
    // Wenn der angeklickte Kontakt bereits angezeigt wird
    if (currentlyDisplayedContact === contact) {
        // Verstecke die Details und entferne den Hintergrund
        hideContactDetails();
        currentlyDisplayedContact = null;
        contactElement.classList.remove('active'); // Hintergrundfarbe entfernen
    } else if (!currentlyDisplayedContact) {
        // Wenn kein Kontakt aktuell angezeigt wird, zeige die Details des neuen Kontakts an
        createContactDetail(contact);
        slideInContactDetails();
        currentlyDisplayedContact = contact;
        contactElement.classList.add('active'); // Hintergrundfarbe hinzufügen
    }
}

/**
 * Displays the detailed contact information in the contact detail section after a contact 
 * list item is clicked. This function generates a contact icon with the contact's initials 
 * and assigned color, and populates the contact details like name, email, and phone.
 * 
 * It also assigns event handlers to the edit and delete buttons, allowing the user to load 
 * the contact data into the edit form or delete the contact.
 * 
 * @param {Object} contact - The contact object containing the contact's details.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.email - The email of the contact.
 * @param {string} contact.phone - The phone number of the contact.
 */
function createContactDetail(contact) {
    const contactDetail = document.getElementById('contactDetailInformation');
    const contactIconLarge = createContactIcon(contact.name, contact.color, 'large');
    const name = contact.name || '';
    const email = contact.email || '';
    const phone = contact.phone || '';
    currentContactId = contact.id;
    contactDetail.innerHTML = createContactDetailDiv(contactIconLarge, name, email, phone)

    document.getElementById('editButton').onclick = function () {
        loadContact(contact.id, contact);
    };
    document.getElementById('deleteFromContactDetail').onclick = function () {
        deleteContact();
    };
}

/**
 * Animates the display of the contact details by sliding the contact detail element 
 * into view from the right side of the screen. This function manages the CSS classes 
 * responsible for the slide-in effect, ensuring any previous animations are cleared 
 * before applying the new one.
 * 
 * The method `offsetWidth` is used to force a reflow, ensuring the slide-out 
 * animation is fully removed before the slide-in animation is added.
 */
function slideInContactDetails() {
    const contactDetails = document.getElementById('contactDetailInformation');

    // Entferne vorherige Animationsklassen
    contactDetails.classList.remove('slide-out');
    void contactDetails.offsetWidth; // Reflow, um die Klasse zu entfernen

    // Füge die Klasse für den Slide-In-Effekt hinzu
    contactDetails.classList.add('slide-in');
}

/**
 * Animates the contact details element by sliding it out of view to the right side of the screen. 
 * The slide-out effect is controlled by CSS classes. After 300 ms, the contact detail content is cleared,
 * and the current contact information is reset to null. Finally, the contact list is refreshed by fetching 
 * the latest data from Firebase.
 */
function hideContactDetails() {
    const contactDetails = document.getElementById('contactDetailInformation');

    contactDetails.classList.remove('slide-in');
    contactDetails.classList.add('slide-out');
    currentContactId = null;
    currentlyDisplayedContact = null;

    setTimeout(() => {
        contactDetails.innerHTML = '';
    }, 300);

    fetchContacts()
}

/**
 * Provides visual feedback to the user confirming that a new contact was added successfully. 
 * The alert slides into view from the right and then slides out of view after 800 ms.
 * The `offsetWidth` method is used to force a reflow, ensuring the slide-out 
 * animation is fully reset before the slide-in animation is triggered again.
 */
function showSuccessAlert() {
    const successAlert = document.getElementById('successAlert');

    successAlert.classList.remove('slide-out');
    void successAlert.offsetWidth;
    successAlert.classList.add('slide-in');

    setTimeout(() => {
        successAlert.classList.remove('slide-in');
        successAlert.classList.add('slide-out');
    }, 800);
}

/**
 * Handles the process after a contact has been updated. 
 * This function is triggered by the `updateContact()` function after an update to a contact's information.
 * 
 * It locates the updated contact in the `contactsArray` using the current contact ID, then updates the 
 * contact details displayed on the screen by calling the `createContactDetail()` function.
 * Finally, it closes the edit popup by triggering the `closeEditPopup()` function.
 */
function handleContactUpdate() {
    const updatedContactData = contactsArray.find(contact => contact.id === currentContactId);
    createContactDetail(updatedContactData);
    closeEditPopup();
}

/**
 * Displays a popup and an overlay with a sliding animation when the user opens a form. 
 * The popup slides in from the right, and the overlay creates a light, transparent shadow effect.
 * The CSS classes manage the visual effects and animations. The `offsetWidth` method is used 
 * to force a reflow, ensuring any previous animations are reset before starting the new ones.
 */
function openPopup() {
    const overlay = document.getElementById('add-contact-pop-up-overlay');
    const popup = document.querySelector('.add-contact-pop-up');

    overlay.classList.remove('active');
    popup.classList.remove('animate');
    void overlay.offsetWidth;
    void popup.offsetWidth;

    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('active');
        popup.classList.add('animate');
    }, 10);
}

/**
 * Displays a popup and an overlay with a sliding animation when the user opens a form. 
 * The popup slides in from the right, and the overlay creates a light, transparent shadow effect.
 * The CSS classes manage the visual effects and animations. The `offsetWidth` method is used 
 * to force a reflow, ensuring any previous animations are reset before starting the new ones.
 */
function openEditPopup() {
    const overlay = document.getElementById('edit-contact-pop-up-overlay');
    const popup = document.querySelector('.edit-contact-pop-up');

    overlay.classList.remove('active');
    popup.classList.remove('animate');
    void overlay.offsetWidth;
    void popup.offsetWidth;

    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('active');
        popup.classList.add('animate');
    }, 10);
}

/**
 * Closes the edit popup and overlay with a sliding animation when the user submits the form.
 * The popup slides out to the right side of the screen, and the overlay fades out to become fully 
 * transparent. CSS classes manage the visual effects and animations.
 * 
 * The `closing` class is added to start the closing animations, and after a delay (matching the 
 * animation duration), the `animate` and `closing` classes are removed to reset the styles and hide the overlay.
 * 
 * @listens click - The function is called when the user submits the form or clicks to close the popup.
 */
function closePopup() {
    const overlay = document.getElementById('add-contact-pop-up-overlay');
    const popup = document.querySelector('.add-contact-pop-up');

    popup.classList.add('closing');
    overlay.classList.add('closing');

    setTimeout(() => {
        popup.classList.remove('animate', 'closing');
        overlay.classList.remove('active', 'closing');
        overlay.style.display = 'none';
    }, 500);
}

/**
 * Closes the edit popup and overlay with a sliding animation when the user submits the form.
 * The popup slides out to the right side of the screen, and the overlay fades out to become fully 
 * transparent. CSS classes manage the visual effects and animations.
 * 
 * The `closing` class is added to start the closing animations, and after a delay (matching the 
 * animation duration), the `animate` and `closing` classes are removed to reset the styles and hide the overlay.
 * 
 * @listens click - The function is called when the user submits the form or clicks to close the popup.
 */
function closeEditPopup() {
    const overlay = document.getElementById('edit-contact-pop-up-overlay');
    const popup = document.querySelector('.edit-contact-pop-up');

    popup.classList.add('closing');
    overlay.classList.add('closing');

    setTimeout(() => {
        popup.classList.remove('animate', 'closing');
        overlay.classList.remove('active', 'closing');
        overlay.style.display = 'none';
    }, 500);
}

/**
 * Listens to a click event outside of the popup and within the overlay to trigger the `closePopup()`
 * function. This will close the popup when the user clicks on the overlay background.
 * @listens click - The event type being listened for on the overlay.
 */
document.getElementById('add-contact-pop-up-overlay').addEventListener('click', (event) => {
    if (event.target === document.getElementById('add-contact-pop-up-overlay')) {
        closePopup();
    }
});

/**
 * Listens to a click event outside of the popup and within the overlay to trigger the `closePopup()`
 * function. This will close the popup when the user clicks on the overlay background.
 * @listens click - The event type being listened for on the overlay.
 */
document.getElementById('edit-contact-pop-up-overlay').addEventListener('click', (event) => {
    if (event.target === document.getElementById('edit-contact-pop-up-overlay')) {
        closeEditPopup();
    }
});