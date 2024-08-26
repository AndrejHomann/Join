/**
 * Processes the newly created contact by assigning it a Firebase-generated ID,
 * integrating it into the local contact list, and updating the UI.
 * This function handles:
 * - Creating a new contact object with the Firebase-generated ID.
 * - Finding the corresponding contact element in the UI and marking it as active.
 * - Simulating a click event to display the contact's details.
 * - Ensuring the new contact is highlighted and event listeners are updated.
 *
 * @param {Object} data - The response object containing the Firebase-generated ID for the new contact.
 * @param {Object} contactData - The object containing the details of the newly created contact.
 */
function processNewContact(data, contactData) {
    const newContactId = data.name; // Firebase returns the ID of the new contact
    const newContact = { id: newContactId, ...contactData }; // Create the new contact object with the received ID
    const newContactElement = document.querySelector(`[data-contact-id="${newContact.id}"]`); // Find and highlight the new contact in the contact list
    if (newContactElement) {
        addContactClickListener(newContactElement, newContact);
        newContactElement.click(); // Simulate a click on the new list element to mark it as active
        currentlyDisplayedContact = newContact;  // Set the new contact as the currently displayed contact
        addContactListEventListener(contactList); // Reattach the event listener for the entire contact list if necessary
    }
}

/**
 * Populates the edit form fields with the data from the selected contact.
 * This function ensures that the current contact's details are pre-filled
 * in the edit form, allowing the user to update the contact information.
 *
 * @param {Object} contact - The object containing the details of the currently selected contact.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.phone - The phone number of the contact.
 */
function setEditFormFields(contact) {
    document.getElementById('editName').value = contact.name || '';
    document.getElementById('editEmail').value = contact.email || '';
    document.getElementById('editPhone').value = contact.phone || '';
}

/**
 * Creates and displays a contact icon with the contact's initials and assigned color
 * in the edit contact form.
 * 
 * This function calls `createContactIcon` to generate an icon based on the contact's name
 * and color. The generated icon is then added to the `editContactIcon` div, replacing any
 * existing content.
 * 
 * @param {Object} contact - The contact object containing details for the icon.
 * @param {string} contact.name - The name of the contact used to generate initials.
 * @param {string} contact.color - The color assigned to the contact for the icon background.
 */
function setContactIcon(contact) {
    const contactIcon = createContactIcon(contact.name, contact.color, 'large');
    const editContactIconDiv = document.getElementById('editContactIcon');

    editContactIconDiv.innerHTML = ''; // Clear existing content
    editContactIconDiv.appendChild(contactIcon);
}

/**
 * Sets the color assigned to the contact by updating the `data-color` attribute of the contact icon.
 * This ensures that the correct color is associated with the contact when editing and saving to Firebase.
 * 
 * @param {Object} contact - The contact object containing the color code.
 * @param {string} contact.color - The color assigned to the contact.
 */
function setContactIconColor(contact) {
    const editContactIconDiv = document.getElementById('editContactIcon');
    editContactIconDiv.dataset.color = contact.color || '#D1D1D1'; // Set default color if none provided
}
/**
 * Sets the registration status of the contact in a hidden input field. 
 * This ensures that the registration status is preserved when editing the contact and 
 * saving the updated information to Firebase.
 * 
 * @param {boolean} isRegistered - Indicates whether the contact is a registered user.
 */
function setIsRegisteredValue(isRegistered) {
    document.getElementById('editIsRegistered').value = isRegistered ? "true" : "false";
}

/**
 * Loads the full contact data into the edit form, including hidden fields like the contact ID 
 * and the registration status. This ensures that all relevant information is preserved 
 * when the contact is edited.
 * 
 * @param {string} id - The unique identifier of the contact in Firebase.
 * @param {Object} contact - The contact object containing all details to be loaded into the form.
 */
function loadContact(id, contact) {
    currentContactId = id;
    setEditFormFields(contact);
    setContactIcon(contact);
    setContactIconColor(contact);
    setIsRegisteredValue(contact.isRegistered);
    openEditPopup();
}

/**
 * Collects the updated contact data from the edit form, preserving the originally set color 
 * and registration status. The collected data is then returned as an object, ready to be 
 * passed to the `updateContact` function for saving to Firebase.
 * 
 * @returns {Object} An object containing the updated contact data.
 * @returns {string} return.name - The updated name of the contact.
 * @returns {string} return.email - The updated email of the contact.
 * @returns {string} return.phone - The updated phone number of the contact.
 * @returns {string} return.color - The color associated with the contact.
 * @returns {boolean} return.isRegistered - Indicates whether the contact is a registered user.
 */
function getUpdatedContactData() {
    const iconColor = document.getElementById('editContactIcon').dataset.color || '#D1D1D1';
    const isRegistered = document.getElementById('editIsRegistered').value === 'true';
    return {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        color: iconColor,
        isRegistered: isRegistered
    };
}

/**
 * Listens for the submission event of the edit contact form, prevents the default form submission, 
 * and triggers the `updateContact()` function to replace the old data with the new data.
 * 
 * @param {Event} event - The event object representing the form submission.
 * @listens submit - The event type being listened for on the form element.
 */
document.getElementById('editContactForm').addEventListener('submit', function (event) {
    event.preventDefault();
    updateContact();
});

/**
 * Listens for the click event on the delete button and triggers the `deleteContact()` function
 * to remove the selected contact from Firebase and refresh the contact list. Calling the function
 * `closeEditPopup()` will cause the closing of the edit popup.
 * 
 * @param {Event} event - The event object representing the button click.
 * @listens click - The event type being listened for on the button element.
 */
const deleteButton = document.getElementById('deleteContactButton');
deleteButton.addEventListener('click', () => {
    deleteContact(); // Kontakt löschen
    closeEditPopup(); // Popup schließen
});