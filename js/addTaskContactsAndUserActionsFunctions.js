let contactsArray = []; // added by Andrej Homann for board=>task-detail=>edit=>contact-dropwdown=>checked-checkbox-for-assigned-contacts

/**
 * Fetches contacts from the server and stores their names and colors in `contactList` and `colors` arrays.
 * This data is used for displaying contacts in the dropdown list.
 *
 * @async
 */
async function fetchContacts() {
    let response = await fetch(BASE_URL + "/contacts.json");
    let contactsData = await response.json();
    contactList = [];
    colors = [];

    for (let id in contactsData) {
        let contact = contactsData[id];
        if (contact.name) {
            contactList.push(contact.name);
            colors.push(contact.color);
        }
    }
}

/**
 * Displays the contacts dropdown list with fetched contacts and their colors.
 * Also updates the UI elements such as the dropdown arrow and the assigned placeholder.
 *
 * @async
 */
async function showContactsDropDown() {
    await fetchContacts();

    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    if (selectedContacts.length >= 0) {
        assignedPlaceholder.innerHTML = "An";
    }

    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("dropdown-list");
    dropdownList.innerHTML = templateContactsHTMLDropdownList();

    document.getElementById("dropdown-list").classList.remove("d-none");
    // document.getElementById("selected-contacts-circle-container").classList.add("d-none");
    document.getElementById("selected-contacts-circle-container").style.display = "none";

    setColorOfAssignedContainer();
    showCheckedContactsAfterDropdownClosing();
}

/**
 * Updates the state of checkboxes in the contacts dropdown list based on previously selected contacts.
 */
function showCheckedContactsAfterDropdownClosing() {
    for (let i = 0; i < contactList.length; i++) {
        let contactName = contactList[i];
        let checkBox = document.getElementById(`unchecked-box-${i}`);

        if (selectedContacts.includes(contactName)) {
            checkBox.src = "/img/checked.png";
        } else {
            checkBox.src = "/img/unchecked.png";
        }
    }
}

/**
 * Closes the contacts dropdown list and updates the UI elements, including showing selected contacts in circles.
 */
function closeContactsDropDown() {
    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    assignedPlaceholder.innerHTML = /*html*/ `<span id="assigned-placeholder">Select contacts to assign</span>`;

    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<div id="contacts-dropwdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>`;
    document.getElementById("dropdown-list").classList.add("d-none");
    // document.getElementById("selected-contacts-circle-container").classList.remove("d-none");
    document.getElementById("selected-contacts-circle-container").style.display = "";

    removeColorOfBorderAssignedContainer();
    showCirclesOfSelectedContacts();
}

/**
 * Selects or deselects a contact based on the current checkbox state and updates the UI accordingly.
 *
 * @param {string} contactName - The name of the contact to be selected or deselected.
 * @param {number} index - The index of the contact in the contact list.
 */
function selectContact(contactName, index) {
    let checkBox = document.getElementById(`unchecked-box-${index}`);

    if (checkBox.src.includes("unchecked.png")) {
        checkBox.src = "/img/checked.png";
        handleContactSelection(contactName, index);
    } else {
        checkBox.src = "/img/unchecked.png";
        handleContactDeselection(contactName, index);
    }
}

/**
 * Handles the selection of a contact by updating the UI and the selectedContacts array.
 *
 * @param {string} contactName - The name of the contact to be selected.
 * @param {number} index - The index of the contact in the contact list.
 */
function handleContactSelection(contactName, index) {
    let selectedContactColor = colors[index];
    let assignedPlaceholder = document.getElementById("assigned-placeholder");

    if (!selectedContacts.includes(contactName)) {
        selectedContacts.push(contactName);
        selectedColors.push(selectedContactColor);
        assignedPlaceholder.innerHTML = /*html*/ `<span id="assigned-placeholder">An</span>`;
        document.getElementById("assigned-container").classList.add("heightAuto");
    }
}

/**
 * Handles the deselection of a contact by updating the UI and the selectedContacts array.
 *
 * @param {string} contactName - The name of the contact to be deselected.
 * @param {number} index - The index of the contact in the contact list.
 */
function handleContactDeselection(contactName, index) {
    let indexOfSelectedContacts = selectedContacts.indexOf(contactName);
    let indexOfSelectedColors = selectedColors.indexOf(colors[index]);

    if (indexOfSelectedContacts >= 0) {
        selectedContacts.splice(indexOfSelectedContacts, 1);
        selectedColors.splice(indexOfSelectedColors, 1);
    }

    if (selectedContacts.length === 0) {
        document.getElementById("assigned-container").classList.remove("heightAuto");
    }
}

/**
 * Sets a colored border for the assigned contacts container when contacts are selected.
 */
function setColorOfAssignedContainer() {
    let selectContactsContainer = document.getElementById("selected-name");
    selectContactsContainer.style.border = "1px solid #90D1ED";
}

/**
 * Removes the colored border from the assigned contacts container.
 */

function removeColorOfBorderAssignedContainer() {
    let selectContactsContainer = document.getElementById("selected-name");
    selectContactsContainer.style.border = "";
}

/**
 * Displays the selected contacts as colored circles with their initials.
 */
function showCirclesOfSelectedContacts() {
    let circleContainer = document.getElementById("selected-contacts-circle-container");
    circleContainer.innerHTML = "";

    for (let i = 0; i < selectedContacts.length; i++) {
        let contact = selectedContacts[i];
        let choosenContact = contactList.indexOf(contact);
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();
        let color = colors[choosenContact];

        let contactHTML = /*html*/ `<div class="circle" style="background-color: ${color}">${firstLetter}${lastLetter}</div>`;
        circleContainer.innerHTML += contactHTML;
    }
}

/**
 * Generates the HTML structure for the contacts dropdown list.
 * Contacts are sorted by their first name, and each contact is displayed with a colored circle and a checkbox.
 *
 * @returns {string} The generated HTML for the contacts dropdown list.
 */
function templateContactsHTMLDropdownList() {
    let dropdownHTML = "";

    sortContactsByFirstName(contactList);

    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i];
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();
        let color = colors[i];
        contactsArray.push({ index: i, contact: contact }); // added by Andrej Homann for board=>task-detail=>edit=>contact-dropwdown=>checked-checkbox-for-assigned-contacts

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-contact-${i}" onclick="selectContact('${contact}', ${i}, '${color}'), doNotCloseDropdown(event)" >
            <div>
                <div class="circle" style="background-color: ${color};">
                    ${firstLetter}${lastLetter}
                </div>
                <span class="contactsDropdownNameSpan">${contact}</span>
            </div>
                <img src="/img/unchecked.png" alt="unchecked" id="unchecked-box-${i}" class="uncheckedBox">
            </div>`;
    }
    return dropdownHTML;
}

/**
 * Sorts the contact list alphabetically by first name.
 *
 * @param {Array<string>} contactList - The list of contact names to be sorted.
 */
function sortContactsByFirstName(contactList) {
    contactList.sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
}

/**
 * Displays a success message after the task is successfully added.
 * The message is shown for 2.5 seconds before sliding out.
 */
// function showSuccessMessage() {
//     setTimeout(successMessageSlidingIn, 500);

//     setTimeout(hideSuccessMessage, 2500);
// }

function showSuccessMessage() {
    setTimeout(successMessageSlidingIn, 500);

    setTimeout(function () {
        hideSuccessMessage();

        const createTask = document.getElementById("addTaskFromBoard");
        if (createTask && createTask.classList.contains("board-mode")) {
            closeBoardAddTaskIfNeeded();
        }
    }, 2500);
}

/**
 * Animates the sliding in of the success message.
 */
function successMessageSlidingIn() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.add("slideInFromButton");
}

/**
 * Animates the sliding out of the success message.
 */
function hideSuccessMessage() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.remove("slideInFromButton");
}

/**
 * Prevents the dropdown from closing when clicking inside it.
 *
 * @param {Event} event - The click event.
 */
function doNotCloseDropdown(event) {
    event.stopPropagation();
}

/**
 * Handles clicking outside of the dropdown areas (contacts or category) to close any open dropdowns.
 *
 * @param {Event} event - The click event.
 */
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", clickOutsideOfDropdown);
});

function clickOutsideOfDropdown(event) {
    let contactsDropdown = document.getElementById("dropdown-list");
    let categoryDropdown = document.getElementById("category-dropdown-list");

    let clickedInsideContacts = contactsDropdown && contactsDropdown.contains(event.target);
    let clickedInsideCategory = categoryDropdown && categoryDropdown.contains(event.target);

    if (!clickedInsideContacts && !clickedInsideCategory) {
        if (contactsDropdown && !contactsDropdown.classList.contains("d-none")) {
            closeContactsDropDown();
        }

        if (categoryDropdown && !categoryDropdown.classList.contains("d-none")) {
            closeCategoryDropDown();
        }
    }
}

document.addEventListener("click", clickOutsideOfDropdown);

/**
 * Selects the task priority based on user selection (urgent, medium, low).
 * Updates the UI to reflect the selected priority and logs the selected priority.
 *
 * @param {string} prio - The selected priority ("urgent", "medium", "low").
 */
function choosePrio(prio) {
    let selectedPioButton = document.getElementById(`prio-${prio}-button`);

    if (selectedPrio === prio) {
        resetPrio();
        selectedPrio = "";
    } else {
        resetPrio();

        selectedPioButton.classList.add(`prio-${prio}-button-bg-color`);
        selectedPioButton.classList.remove("prio-default-text-color");

        selectedPrio = prio;
    }
}

/**
 * Resets the priority selection by removing the background color from all priority buttons
 * and restoring the default text color for each button (urgent, medium, low).
 */
function resetPrio() {
    document.getElementById("prio-urgent-button").classList.remove("prio-urgent-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");

    document.getElementById("prio-urgent-button").classList.add("prio-default-text-color");
    document.getElementById("prio-medium-button").classList.add("prio-default-text-color");
    document.getElementById("prio-low-button").classList.add("prio-default-text-color");
}
