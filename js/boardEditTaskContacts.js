let wasContactsDropdownOpenInCurrentTask = false;

/**
 * Displays the contacts dropdown in the edit mode, populating it with contact names and updating UI elements.
 * This function fetches the contact data, sets placeholders, and renders the contact list in the dropdown.
 * It also manages the visibility and styling of the dropdown and handles the contacts already assigned to the task.
 *
 * @async
 * @returns {Promise<void>} - This function does not return a value. It performs asynchronous actions
 * like fetching contact data and updating the DOM elements to display the contact dropdown.
 */
async function showContactsDropDownEdit() {
    await fetchContacts();

    let assignedPlaceholder = document.getElementById("edit-assigned-placeholder");
    if (selectedContacts.length >= 0) {
        assignedPlaceholder.innerHTML = "An";
    }
    setColorOfAssignedContainerEdit();
    document.getElementById("edit-contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("edit-dropdown-list");
    dropdownList.innerHTML = templateContactsHTMLDropdownListEdit();

    if (wasContactsDropdownOpenInCurrentTask === false) {
        await matchTaskAssignedUserToCheckedDropdown();
        wasContactsDropdownOpenInCurrentTask = true;
    }
    dropdownList.classList.remove("d-none");
    document.getElementById("edit-selected-contacts-circle-container").style.display = "none";

    showCheckedContactsAfterDropdownClosingEdit();
}

/**
 * Finds the index of a contact in the contact list by name.
 *
 * This function searches for the provided contact name in the `contactList` array
 * and returns the index of the first occurrence. If the name is not found,
 * it logs an error and returns -1.
 *
 * @param {string} name - The name of the contact to search for.
 * @returns {number} The index of the contact in the `contactList` array, or -1 if not found.
 */
function findContactIndexForTaskName(name) {
    const i = contactList.indexOf(name);
    if (i !== -1) {
        return i;
    }
    console.error("contact array index could not be calculated");
    return -1;
}

/**
 * Checks the status of checkboxes in a dropdown list and updates the selected contacts and their colors.
 * This function is used to process task data and ensure that the contacts related to a task are marked
 * as selected, based on the task's user list and their associated colors.
 *
 * @async
 * @param {Object} data - The data object containing task information.
 * @param {string} taskEditCheckboxId - The ID of the task whose checkbox status is being checked.
 * This ID is used to access the specific task within `data.tasks`.
 *
 * @returns {Promise<void>} - This function returns a promise. It does not explicitly return any value.
 * It updates the `selectedContacts` and `selectedColors` arrays based on the task data.
 *
 * @throws {Error} - This function assumes that `findContactIndexForTaskName` and the arrays `selectedContacts`
 * and `selectedColors` are defined and accessible in the scope.
 */
async function checkDropdownListCheckboxStatus(data, taskEditCheckboxId) {
    let taskUserNameList = data.tasks[taskEditCheckboxId].name;
    let taskUserNameColors = data.tasks[taskEditCheckboxId].color;

    if (taskUserNameList && taskUserNameColors) {
        for (let i = 0; i < taskUserNameList.length; i++) {
            let name = taskUserNameList[i];
            let color = taskUserNameColors[i];

            let contactIndex = findContactIndexForTaskName(name);

            if (contactIndex !== -1) {
                if (!selectedContacts.includes(name)) {
                    selectedContacts.push(name);
                    selectedColors.push(color);
                }
            }
        }
    }
}

/**
 * Matches the task's assigned users to the checked dropdown list based on the task title and description.
 * This function fetches task data from a remote server, compares the task's title and description with
 * the values from the input fields, and if a match is found, it updates the checked state of the dropdown
 * list with the task's assigned users.
 *
 * @async
 * @returns {Promise<void>} - This function returns a Promise and does not explicitly return any value.
 * It updates the state of the dropdown list based on the task data.
 *
 * @throws {Error} - If an error occurs during the fetch request or in processing the data, an error is logged to the console.
 */
async function matchTaskAssignedUserToCheckedDropdown() {
    try {
        const response = await fetch(`${BASE_URL}/.json`);
        const data = await response.json();
        let taskTitle = document.getElementById("edit-title-input").value;
        let description = document.getElementById("edit-textarea-input").value;
        for (const taskId in data.tasks) {
            if (data.tasks[taskId].title === taskTitle && data.tasks[taskId].taskDescription === description) {
                let taskEditCheckboxId = taskId;
                checkDropdownListCheckboxStatus(data, taskEditCheckboxId);
            }
        }
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}

/**
 * Updates the state of checkboxes in the contacts dropdown list based on previously selected contacts.
 */
function showCheckedContactsAfterDropdownClosingEdit() {
    for (let i = 0; i < contactsWithColors.length; i++) {
        let contactName = contactsWithColors[i].contact;
        let checkBox = document.getElementById(`edit-unchecked-box-${i}`);

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
function closeContactsDropDownEdit() {
    let assignedPlaceholder = document.getElementById("edit-assigned-placeholder");
    assignedPlaceholder.innerHTML = /*html*/ `<span id="edit-assigned-placeholder">Select contacts to assign</span>`;

    document.getElementById("edit-contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<div id="contacts-dropwdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>`;
    document.getElementById("edit-dropdown-list").classList.add("d-none");
    document.getElementById("edit-selected-contacts-circle-container").style.display = "flex";

    removeColorOfBorderAssignedContainerEdit();
    showCirclesOfSelectedContactsEdit();
}

/**
 * Selects or deselects a contact based on the current checkbox state and updates the UI accordingly.
 *
 * @param {string} contactName - The name of the contact to be selected or deselected.
 * @param {number} index - The index of the contact in the contact list.
 */
function selectContactEdit(contactName, index) {
    if (selectedContacts.includes(contactName)) {
        handleContactDeselectionEdit(contactName, index);
    } else {
        handleContactSelectionEdit(contactName, index);
    }
}

/**
 * Handles the selection of a contact by updating the UI and the selectedContacts array.
 *
 * @param {string} contactName - The name of the contact to be selected.
 * @param {number} index - The index of the contact in the contact list.
 */
function handleContactSelectionEdit(contactName, index) {
    let selectedContactColor = contactsWithColors[index].color;
    let assignedPlaceholder = document.getElementById("edit-assigned-placeholder");

    if (!selectedContacts.includes(contactName)) {
        selectedContacts.push(contactName);
        selectedColors.push(selectedContactColor);
        assignedPlaceholder.innerHTML = /*html*/ `<span id="edit-assigned-placeholder">An</span>`;
        document.getElementById("edit-assigned-container").classList.add("heightAuto");
        document.getElementById(`edit-unchecked-box-${index}`).src = "/img/checked.png";
    }
}

/**
 * Handles the deselection of a contact by updating the UI and the selectedContacts array.
 *
 * @param {string} contactName - The name of the contact to be deselected.
 * @param {number} index - The index of the contact in the contact list.
 */
function handleContactDeselectionEdit(contactName, index) {
    let contactColor = contactsWithColors[index].color;
    let indexOfSelectedContact = selectedContacts.indexOf(contactName);
    let indexOfSelectedColor = selectedColors.indexOf(contactColor);

    document.getElementById(`edit-unchecked-box-${index}`).src = "/img/unchecked.png";

    if (indexOfSelectedContact >= 0) {
        selectedContacts.splice(indexOfSelectedContact, 1);
    }
    if (indexOfSelectedColor >= 0) {
        selectedColors.splice(indexOfSelectedColor, 1);
    }

    if (selectedContacts.length === 0) {
        document.getElementById("edit-assigned-container").classList.remove("heightAuto");
    }
}

/**
 * Sets a colored border for the assigned contacts container when contacts are selected.
 */
function setColorOfAssignedContainerEdit() {
    let selectContactsContainer = document.getElementById("edit-selected-name");
    selectContactsContainer.style.border = "1px solid #90D1ED";
}

/**
 * Removes the colored border from the assigned contacts container.
 */
function removeColorOfBorderAssignedContainerEdit() {
    let selectContactsContainer = document.getElementById("edit-selected-name");
    selectContactsContainer.style.border = "";
}

/**
 * Displays circles representing selected contacts in edit mode.
 * Limits the number of visible circles to a maximum and appends
 * an indicator if more contacts are selected. Each contact circle
 * displays the initials of the contact with a unique background color.
 */
function showCirclesOfSelectedContactsEdit() {
    let circleContainer = document.getElementById("edit-selected-contacts-circle-container");
    circleContainer.innerHTML = "";

    let maxCircles = 6;
    let remainingContacts = selectedContacts.length - maxCircles;

    renderContactCircles(circleContainer, maxCircles);
    renderRemainingContactsIndicator(circleContainer, remainingContacts);
}

/**
 * Renders the contact circles into the container.
 *
 * @param {HTMLElement} container - The container for the circles.
 * @param {number} maxCircles - The maximum number of circles to display.
 */
function renderContactCircles(container, maxCircles) {
    for (let i = 0; i < selectedContacts.length; i++) {
        if (i >= maxCircles) break;

        let contactHTML = generateContactCircleHTML(selectedContacts[i]);
        container.innerHTML += contactHTML;
    }
}

/**
 * Renders the "+X more" indicator if there are additional contacts.
 *
 * @param {HTMLElement} container - The container for the indicator.
 * @param {number} remainingContacts - The number of additional contacts not displayed.
 */
function renderRemainingContactsIndicator(container, remainingContacts) {
    if (remainingContacts > 0) {
        let remainingText = generateRemainingContactsHTML(remainingContacts);
        container.innerHTML += remainingText;
    }
}

/**
 * Generates the HTML string for a contact circle.
 *
 * @param {string} contact - The full name of the contact (e.g., "John Doe").
 * @returns {string} HTML string for a single contact circle.
 */
function generateContactCircleHTML(contact) {
    let choosenContact = contactList.indexOf(contact);
    let [firstName, lastName] = contact.split(" ");
    let firstLetter = firstName.charAt(0).toUpperCase();
    let lastLetter = lastName.charAt(0).toUpperCase();
    let color = colors[choosenContact];

    return /*html*/ `<div class="circle" style="background-color: ${color}">${firstLetter}${lastLetter}</div>`;
}

/**
 * Generates the HTML string for the "+X more" indicator.
 *
 * @param {number} remainingContacts - The number of additional contacts not displayed.
 * @returns {string} HTML string for the "+X more" indicator.
 */
function generateRemainingContactsHTML(remainingContacts) {
    return /*html*/ `<div class="moreCirlce">+${remainingContacts} weitere</div>`;
}

/**
 * Generates the HTML for the contacts dropdown list in the edit view.
 * This function creates a list of contacts with their associated colors,
 * including their initials in a circle and their full name. Each contact
 * has a selectable dropdown item with an unchecked box, and clicking a contact
 * will select it for the task.
 *
 * @returns {string} - The generated HTML string for the contacts dropdown list.
 */
function templateContactsHTMLDropdownListEdit() {
    let dropdownHTML = "";

    let contactsWithColors = combineContactsAndColors(contactList, colors);
    contactsWithColors = sortContactsWithColors(contactsWithColors);

    for (let i = 0; i < contactsWithColors.length; i++) {
        let { contact, color } = contactsWithColors[i];
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="edit-dropdown-list-contact-${i}" 
                 onclick="selectContactEdit('${contact}', ${i}, '${color}'), doNotCloseDropdown(event)">
                <div>
                    <div class="circle" style="background-color: ${color};">
                        ${firstLetter}${lastLetter}
                    </div>
                    <span class="contactsDropdownNameSpan">${contact}</span>
                </div>
                <img src="/img/unchecked.png" alt="unchecked" id="edit-unchecked-box-${i}" class="uncheckedBox">
            </div>`;
    }

    return dropdownHTML;
}

/**
 * Toggles the visibility of the contacts dropdown in the edit view.
 * If the dropdown list is currently hidden (i.e., has the "d-none" class),
 * it will be shown by calling the `showContactsDropDownEdit` function.
 * If the dropdown list is visible, it will be closed by calling
 * the `closeContactsDropDownEdit` function.
 */
function checkIfContactsDropdownIsVisibleEdit() {
    let dropdownList = document.getElementById("edit-dropdown-list");

    if (dropdownList.classList.contains("d-none")) {
        showContactsDropDownEdit();
    } else {
        closeContactsDropDownEdit();
    }
}

/**
 * Adds an event listener to the document when the DOM content has been fully loaded.
 * This listener listens for click events and calls the `clickOutsideOfContactsDropdownEdit` function
 * when the user clicks anywhere on the document.
 *
 * The `clickOutsideOfContactsDropdownEdit` function checks whether the click event occurred
 * outside of the contacts dropdown in the edit view. If so, it will close the contacts dropdown.
 */
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", clickOutsideOfContactsDropdownEdit);
});

/**
 * Handles clicks outside the contacts dropdown in the edit view.
 * Closes the dropdown if the user clicks outside of the dropdown or the contacts input field.
 *
 * @param {MouseEvent} event - The mouse event triggered by the user's click.
 */
function clickOutsideOfContactsDropdownEdit(event) {
    const contactsDropdown = document.getElementById("edit-dropdown-list");
    const contactsInput = document.getElementById("edit-selected-name");

    const clickedInsideDropdown = contactsDropdown && contactsDropdown.contains(event.target);
    const clickedOnContactsInput = contactsInput && contactsInput.contains(event.target);

    if (!clickedInsideDropdown && !clickedOnContactsInput) {
        if (contactsDropdown && !contactsDropdown.classList.contains("d-none")) {
            closeContactsDropDownEdit();
        }
    }
}
