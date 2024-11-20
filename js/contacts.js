const BASE_URL = 'https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/';

const addContactForm = document.getElementById('addContactForm');
let contactsArray = [];
let currentContactId = null;

/**
 * Initializes the application once the DOM content is fully loaded.
 *
 * This event listener waits for the complete loading of the DOM tree before 
 * executing the `fetchContacts` function. This ensures that all necessary 
 * elements are available in the DOM before trying to interact with them.
 *
 * @event DOMContentLoaded
 * @function
 */
document.addEventListener("DOMContentLoaded", () => {
    fetchContacts();
    includeHTML();
});

/**
 * Fetches contacts from the server and processes them.
 *
 * This asynchronous function sends a GET request to the server to retrieve 
 * contacts data in JSON format. It then maps the received data into an array 
 * of contact objects, each containing an `id` and the corresponding contact details.
 * The contacts are then sorted alphabetically by name and displayed on the UI.
 *
 * @async
 * @function fetchContacts
 * @returns {Promise<void>} Returns a promise that resolves when the contacts 
 * are fetched and displayed.
 * @throws {Error} Logs an error message to the console if the fetch operation fails.
 */
async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}contacts.json`);
        const data = await response.json();
        contactsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        const sortedContacts = sortContactsAlphabetically(contactsArray);
        displayContacts(sortedContacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

/**
 * Event listener for the Add Contact form submission.
 * Prevents the default form submission behavior and validates the form.
 * If all fields are valid, processes the form data.
 * 
 * @param {SubmitEvent} event - The submit event object.
 */
document.getElementById('createContact').addEventListener('click', (event) => {
    event.preventDefault(); // Wichtig, um Standardaktion zu verhindern
    if (validateForm()) {
        processForm(); // Speichert die Daten
    }
});

/**
 * Processes the Add Contact form data.
 * Extracts values from the form, generates a random color, 
 * and sends the data to the server or storage.
 * 
 * @function
 */
function processForm() {
    const name = document.getElementById('addNewName').value.trim();
    const email = document.getElementById('addNewEmail').value.trim();
    const phone = document.getElementById('addNewPhone').value.trim();
    const color = generateRandomColor();

    pushContactData(name, email, phone, color);
}

/**
 * Adds a newly created contact to the Firebase contacts database.
 *
 * This function sends the contact data to the Firebase database by making
 * a POST request. Upon successful submission, the contact list is refreshed, 
 * and additional steps like processing the new contact and displaying a success 
 * alert are triggered.
 *
 * @async
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The generated color code associated with the contact.
 * @param {boolean} [isRegistered=false] - Indicates whether the contact is a registered user.
 * 
 * @throws {Error} Throws an error if the contact data could not be saved.
 */
async function pushContactData(name, email, phone, color, isRegistered = false, session = 'inactive') {
    contactData = { name, email, phone, color, isRegistered, session };
    try {
        const response = await fetch(`${BASE_URL}contacts.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, color, isRegistered, session })
        });

        if (!response.ok) throw new Error('Failed to save contact data');

        const data = await response.json();
        await handleContactAdd(); // Refresh the contact list
        processNewContact(data, contactData);
        showSuccessAlert();

    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Handles the process after a contact has been added. This function resets the contact form fields,
 * closes the pop-up form, and updates the contact list by fetching the latest contacts from the database.
 *
 * @async
 * @function handleContactAdd
 * @returns {Promise<void>} - A promise that resolves when the contact list has been successfully updated.
 *
 * @description
 * After a contact is added, the form fields are cleared to prepare for the next entry.
 * The pop-up form is then closed to return the user to the main view. Finally, the contact list
 * is refreshed by retrieving the updated list of contacts from the database, ensuring that the
 * newly added contact is displayed.
 */
async function handleContactAdd() {
    addContactForm.reset();
    closePopup();
    await fetchContacts();
}

/**
 * Updates an existing contact in the global `contactsArray` with new data.
 * 
 * This function searches for a contact in the `contactsArray` by its `contactId`.
 * If the contact is found, it replaces the existing contact data with the new `updatedContact` data.
 * 
 * @param {string} contactId - The unique identifier of the contact, provided by Firebase.
 * @param {Object} updatedContact - An object containing the updated contact data.
 * @throws {Error} Will throw an error if the contactId does not exist in the array.
 */
function updateContactInArray(contactId, updatedContact) {
    const contactIndex = contactsArray.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
        contactsArray[contactIndex] = { id: contactId, ...updatedContact };
    }
}

/**
 * Sends an update request to the Firebase database to modify an existing contact's data.
 * 
 * This function communicates with the Firebase database to update the specified contact's 
 * information using the `PUT` method. If the request is successful, the contact data is updated in Firebase.
 * 
 * @param {string} contactId - The unique identifier of the contact, provided by Firebase.
 * @param {Object} updatedContact - An object containing the updated contact data.
 * @throws {Error} Will throw an error if the update request to Firebase fails.
 * @returns {Promise<void>} - Returns a promise that resolves when the update is complete.
 */
async function sendUpdateRequest(contactId, updatedContact) {
    const response = await fetch(`${BASE_URL}contacts/${contactId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
    });

    if (!response.ok) throw new Error('Failed to update contact');
}

/**
 * Updates an existing contact by sending the collected updated contact data to Firebase and 
 * updating the local array.
 * 
 * The function accesses the current contact ID to identify the corresponding entry and replace 
 * the old data with the new data. After a successful update, the handleContactUpdate() function 
 * is called to refresh the contact list and close the edit pop-up.
 * 
 * @throws {Error} Throws an error if the update fails.
 * @returns {Promise<void>} Returns a promise that resolves when the update is complete.
 */
async function updateContact() {
    try {
        const updatedContact = processEditForm();
        updateContactInArray(currentContactId, updatedContact);
        await sendUpdateRequest(currentContactId, updatedContact);
        handleContactUpdate();
        closeMoreBox();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Deletes a contact from the database and updates related tasks.
 *
 * @async
 * @returns {Promise<void>|null} A Promise that resolves when the contact is successfully deleted, or null if an error occurs.
 */
async function deleteContact() {
    let fetchContactData = await fetchContactColorAndName();
    let deleteUserColor = fetchContactData.UserColor;
    let deleteUserName = fetchContactData.UserName;
    let taskIdsWithContactNamesToDelete = await fetchTaskIds(deleteUserColor, deleteUserName);
    await createNewColorAndNameArrays(deleteUserColor, deleteUserName, taskIdsWithContactNamesToDelete);
    await deleteContactFromDatabase();
}

/**
 * Fetches the color and name of a specific contact from the server.
 *
 * @async
 * @returns {Promise<{UserColor: string, UserName: string}|null>} A Promise that resolves to an object containing the contact's color and name, or null if an error occurs.
 */
async function fetchContactColorAndName() {
    try {
        const response = await fetch(`${BASE_URL}/${`contacts`}.json`);
        const contactData = await response.json();
        let UserColor = contactData[currentContactId].color;
        let UserName = contactData[currentContactId].name;
        return { UserColor, UserName };
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}

/**
 * Fetches IDs of tasks that match the provided color and name.
 *
 * @async
 * @param {string} deleteUserColor The color to match against tasks.
 * @param {string} deleteUserName The name to match against tasks.
 * @returns {Promise<string[]>|null} A Promise that resolves to an array of task IDs that match the criteria, 
 * or null if an error occurs during the fetch operation.
 */
async function fetchTaskIds(deleteUserColor, deleteUserName) {
    try {
        const response = await fetch(`${BASE_URL}.json`);
        const data = await response.json();
        const tasks = data.tasks;
        let taskIdArray = [];
        for (const taskId in tasks) {
            const task = tasks[taskId];
            if (task.name && task.name.includes(deleteUserName) && task.color.includes(deleteUserColor)) {
                taskIdArray.push(taskId);
            }
        }
        return taskIdArray;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}

/**
 * Updates color and name arrays of tasks based on a deleted contact.
 *
 * @async
 * @param {string} deleteUserColor The color of the deleted contact.
 * @param {string} deleteUserName The name of the deleted contact.
 * @param {string[]} taskIdsWithContactNamesToDelete An array of task IDs containing the deleted contact's name.
 * @returns {Promise<void>|null} A Promise that resolves to nothing (void) if successful, 
 *  or null if an error occurs during the fetch operation.
 */
async function createNewColorAndNameArrays(deleteUserColor, deleteUserName, taskIdsWithContactNamesToDelete) {
    try {
        const response = await fetch(`${BASE_URL}.json`);
        const data = await response.json();
        for (let i = 0; i < taskIdsWithContactNamesToDelete.length; i++) {
            const taskId = taskIdsWithContactNamesToDelete[i];
            const task = data.tasks[taskId];
            const newColorArray = task.color.filter(user => user !== deleteUserColor)
            const newNameArray = task.name.filter(user => user !== deleteUserName)
            await deleteColorAndContactFromTask(taskId, newColorArray, newNameArray, deleteUserColor, deleteUserName);
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

/**
 * Updates a task by removing a specific color and name from its respective arrays.
 *
 * @async
 * @param {string} taskId The ID of the task to be updated.
 * @param {string[]} newColorArray The new color array for the task.
 * @param {string[]} newNameArray The new name array for the task.
 * @param {string} deleteUserColor The color to be removed.
 * @param {string} deleteUserName The name to be removed.
 * @returns {Promise<void>} A Promise that resolves when the update is successful, or throws an error otherwise.
 */
async function deleteColorAndContactFromTask(taskId, newColorArray, newNameArray, deleteUserColor, deleteUserName) {
    const patchResponse = await fetch(`${BASE_URL}/${`tasks`}/${taskId}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            color: newColorArray,
            name: newNameArray
        })
    });
    if (!patchResponse.ok) {
        throw new Error(`Error while deleting contact color and contact name from task ${taskId}`);
    }
}

/**
 * Deletes an existing contact using the 'DELETE' method. 
 * Upon successful deletion, the contact list and the UI are refreshed.
 *
 * @throws {Error} Throws an error if the deletion from Firebase fails.
 * @returns {Promise<void>} Returns a promise that resolves when the contact is deleted.
 */
async function deleteContactFromDatabase() {
    try {
        const url = `${BASE_URL}contacts/${currentContactId}.json`;
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (response.ok) {
            handleDeleteContact();
        } else {
            console.error('Failed to delete contact');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Handles the deletion of a contact by updating the UI and refreshing the contact list.
 * - Fetches the updated contact list from Firebase, which also updates the local array.
 * - Hides the contact details if the currently displayed contact is deleted.
 * - Removes the active state from the deleted contact's list element in the UI.
 * - Triggers a click event on the contact list to ensure the UI is updated.
 * 
 * @returns {Promise<void>} Returns a promise that resolves when the contact data is fetched and the UI is updated.
 */
async function handleDeleteContact() {
    await fetchContacts();

    if (currentlyDisplayedContact) {
        hideContactDetails();
        goBackToContactList();
        currentlyDisplayedContact = null;
    }
    const contactList = document.querySelector('.contact-list');
    if (contactList) {
        const deletedContactElement = contactList.querySelector(`[data-contact-id="${currentContactId}"]`);
        if (deletedContactElement) {
            deletedContactElement.classList.remove('active');
        }
    }
    if (contactList) {
        contactList.click();
    }
}

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