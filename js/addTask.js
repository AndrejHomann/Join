/**
 * Base URL for the Firebase Realtime Database.
 * @type {string}
 */
// let BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * List of contacts.
 * @type {Array}
 */
let contactList = [];

/**
 * Selected priority for the task.
 * @type {string}
 */
// let selectedPrio = "medium";

/**
 * List of available categories.
 * @type {Array<string>}
 */
let categoryList = ["Technical Task", "User Story"];

/**
 * Selected category for the task.
 * @type {string|null}
 */
let selectedCategory = null;

/**
 * Currently selected contact.
 * @type {string|null}
 */
let selectedContact = null;

/**
 * List of selected contacts.
 * @type {Array<string>}
 */
let selectedContacts = [];

/**
 * List of colors for selected contacts.
 * @type {Array<string>}
 */
let colors = [];

/**
 * List of selected colors.
 * @type {Array<string>}
 */
let selectedColors = [];

/**
 * List of subtasks.
 * @type {Array<string>}
 */
let subtasks = [];

/**
 * Flag to indicate if the subtask list is resetting.
 * @type {boolean}
 */
let isSubtaskResetting = false;

/**
 * Includes HTML content by replacing elements with the 'includeHTML' attribute.
 * Loads the external file and injects its content into the element.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[includeHTML]");
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("includeHTML");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

/**
 * Creates a new task by validating inputs and gathering form data.
 * Sends the task to the server and clears form fields.
 */
function createTask() {
    if (!validateAllInputs()) {
        return;
    }

    let task = {
        name: selectedContacts,
        priority: selectedPrio,
        category: selectedCategory,
        color: selectedColors,
        addedSubtasks: subtasks,
        title: document.getElementById("title-input").value,
        taskDescription: document.getElementById("textarea-input").value,
        date: document.getElementById("date-input").value,
        status: "todo",
    };
    addTask("/tasks.json", task);
    checkIfRequiredFieldsAreEnteredAgain();
    clearFields();
}

/**
 * Sends a POST request to add a new task to the database.
 *
 * @param {string} path - The path in the database where the task is stored.
 * @param {Object} data - The task data to be stored.
 */
async function addTask(path, data) {
    const response = await fetch(BASE_URL + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        let responseToJson = await response.json();
        console.log(responseToJson);
        showSuccessMessage();
    } else {
        console.error("Error");
    }
}

/**
 * Toggles the visibility of the contacts dropdown.
 */
function checkIfContactsDropdownIsVisible() {
    let dropdownList = document.getElementById("dropdown-list");

    if (dropdownList.classList.contains("d-none")) {
        showContactsDropDown();
    } else {
        closeContactsDropDown();
    }
}

/**
 * Adds a new subtask or closes the subtask input based on the current state.
 */
function addOrCloseSubtask() {
    if (isSubtaskResetting) return;

    let subtaskIconContainer = document.getElementById("subtask-icon-container");

    subtaskIconContainer.classList.remove("plusIconHover");

    subtaskIconContainer.innerHTML = /*html*/ `
    <div id="close-icon-container" onclick="closeSubtaskDraft()"><img src="/img/addTask/close.png" alt="delete" id="close-subtask"></div>
    <div class="border-subtask-container"></div>
    <div id="check-icon-container" onclick="addSubtask()"><img src="/img/addTask/check.png" alt="check" id="check-subtask"></div>`;

    let checkIconContainer = document.getElementById("check-icon-container");
    checkIconContainer.classList.add("circleHoverEffect");
    let closeIconContainer = document.getElementById("close-icon-container");
    closeIconContainer.classList.add("circleHoverEffect");
}

/**
 * Adds a new subtask to the list after validating the input.
 */
function addSubtask() {
    let newSubtaskInput = document.getElementById("new-subtask-input");
    let subtaskList = document.getElementById("generated-subtask-list-container");
    let missingSubtaskMessage = document.getElementById("missing-subtask-message");
    let subtaskContainer = document.getElementById("new-subtask-container");
    let i = subtasks.length;

    handleSubtaskValidation(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i);
    resetSubtaskIcon();
}

/**
 * Closes the subtask draft and resets the input field.
 */
function closeSubtaskDraft() {
    let subtaskDraft = document.getElementById("new-subtask-input");
    subtaskDraft.value = ``;
    resetSubtaskIcon();
}

/**
 * Validates the subtask input and updates the UI accordingly.
 *
 * @param {HTMLElement} newSubtaskInput - The input field for the new subtask.
 * @param {HTMLElement} subtaskList - The container for the list of subtasks.
 * @param {HTMLElement} subtaskContainer - The container for the subtask input field.
 * @param {HTMLElement} missingSubtaskMessage - The message shown if the input is empty.
 * @param {number} i - The index of the new subtask.
 */
function handleSubtaskValidation(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i) {
    let trimmedInput = newSubtaskInput.value.trim();

    if (trimmedInput !== "") {
        subtasks.push({ subtask: trimmedInput, status: "unchecked" });

        let subtaskHTML = templateSubtasksListHTML(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;

        newSubtaskInput.value = "";
        subtaskContainer.style.border = "";
        missingSubtaskMessage.style.display = "none";
    } else {
        subtaskContainer.style.border = "1px solid #ff8190";
        missingSubtaskMessage.style.display = "flex";
    }
}

/**
 * Toggles between showing the close/delete icon and resetting the subtask input based on the input value.
 */
document.addEventListener("DOMContentLoaded", () => {
    let subtaskInput = document.getElementById("new-subtask-input");

    if (subtaskInput) {
        subtaskInput.addEventListener("input", showCloseOrDeleteIconDuringWritingSubtask);
    }
});

function showCloseOrDeleteIconDuringWritingSubtask() {
    let subtaskInput = document.getElementById("new-subtask-input");

    if (subtaskInput.value) {
        addOrCloseSubtask();
    } else {
        resetSubtaskIcon();
    }
}

/**
 * Resets the subtask icon to the default state.
 */
function resetSubtaskIcon() {
    let subtaskIconContainer = document.getElementById("subtask-icon-container");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="plus-icon-container" class="circleHoverEffect" onclick="addOrCloseSubtask()">
            <img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" />
        </div>`;

    isSubtaskResetting = true;
    setTimeout(resetSubtaskClearButton, 1);
}

/**
 * Resets the flag indicating if the subtask clear button is resetting.
 */
function resetSubtaskClearButton() {
    isSubtaskResetting = false;
}

/**
 * Clears the content of the subtask list container.
 */
function resetSubtaskList() {
    document.getElementById("generated-subtask-list-container").innerHTML = "";
}

/**
 * Deletes a subtask by index from both the DOM and the subtasks array.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
    let newSubtask = document.getElementById(`generated-subtask-container-${index}`);
    if (newSubtask) {
        newSubtask.remove();
    }
    subtasks.splice(index, 1);
    updateSpecificSubtask();
}

/**
 * Updates the subtask list container in the DOM after a subtask is deleted.
 */
function updateSpecificSubtask() {
    let subtaskList = document.getElementById("generated-subtask-list-container");

    subtaskList.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskHTML = templateSubtasksListHTML(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;
    }
}

/**
 * Generates the HTML for a subtask item.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} subtask - The subtask content.
 * @returns {string} - The HTML for the subtask list item.
 */
function templateSubtasksListHTML(i, subtask) {
    return /*html*/ `
            <div class="generatedSubtasks" id="generated-subtask-container-${i}">
                <li id="generated-subtask-list-item-${i}" class="subtaskListItemStyle">${subtask}</li>
                <div id="generated-subtask-list-icons">
                    <div id="edit-icon-container" onclick="editSubtask(${i})"><img src="/img/addTask/edit.png" alt="edit" /></div>
                    <div class="border-subtask-container"></div>
                    <div id="delete-icon-container" onclick="deleteSubtask(${i})">
                        <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                    </div>
                </div>
            </div>`;
}

/**
 * Enables the editing of a subtask by replacing the subtask's HTML with input fields.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    let toEditSubtask = document.getElementById(`generated-subtask-container-${index}`);
    let currentSubtaskText = subtasks[index].subtask;

    toEditSubtask.classList.add("noHoverEffect");

    toEditSubtask.innerHTML = templateEditSubtasksHTML(currentSubtaskText, index);

    setupEditSubtaskByEnterKey(index);
}

/**
 * Submits the edited subtask and updates the subtasks array and DOM.
 *
 * @param {number} index - The index of the subtask being edited.
 */
function submitSubtask(index) {
    let editedSubtaskInput = document.getElementById(`edit-subtask-input-${index}`).value;
    if (editedSubtaskInput === "") {
        return;
    } else {
        subtasks[index].subtask = editedSubtaskInput;

        updateSpecificSubtask();
    }
}

/**
 * Generates the HTML for the subtask editing view.
 *
 * @param {string} currentSubtaskText - The current text of the subtask.
 * @param {number} index - The index of the subtask being edited.
 * @returns {string} - The HTML for the subtask edit view.
 */
function templateEditSubtasksHTML(currentSubtaskText, index) {
    return /*html*/ `
        <div id="edit-subtask-container">
            <input type="text" id="edit-subtask-input-${index}" value="${currentSubtaskText}" class="edit-subtask-container-styling">            
            <div id="generated-subtask-list-icons" class="showSubtaskIconsWhileEditing">
                <div id="delete-icon-container" onclick="deleteSubtask(${index})">
                    <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                </div>     
                <div class="border-subtask-container"></div>
                <div id="submit-icon-container" onclick="submitSubtask(${index})">
                    <img src="/img/addTask/check.png" alt="check" id="check-subtask">
                </div>
            </div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", function () {
    let newSubtaskInput = document.getElementById("new-subtask-input");
    if (newSubtaskInput) {
        newSubtaskInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                addSubtask();
            }
        });
    }
});

/**
 * Sets up an event listener for the subtask input field to allow submission via Enter key.
 *
 * @param {number} index - The index of the subtask being edited.
 */
function setupEditSubtaskByEnterKey(index) {
    let editSubtaskInput = document.getElementById(`edit-subtask-input-${index}`);
    editSubtaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEditedSubtaskByEnterKey(event, index);
        }
    });
}

/**
 * Handles the submission of the edited subtask via Enter key.
 *
 * @param {Event} event - The keyboard event.
 * @param {number} index - The index of the subtask being edited.
 */
function addEditedSubtaskByEnterKey(event, index) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtask(index);
    }
}

function checkAddTaskChanges() {
    checkTaskTitle();
    checkTaskDescription();
    checkTaskDate();
    checkTaskSubtask();
}

function checkTaskTitle() {
    setTimeout(() => {
        const input = document.getElementById("title-input");
        const message = document.getElementById("missing-title-message");
        checkTaskOnClickInsideElement(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElement(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElement(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

function checkTaskDescription() {
    setTimeout(() => {
        const input = document.getElementById("textarea-input");
        checkTaskOnClickInsideElement(input, "", "#90d1ed", "#90d1ed");
        checkTaskOnClickOutsideElement(input, "", "#d1d1d1", "#d1d1d1");
        checkTaskOnKeystrokeInsideElement(input, "", "#d1d1d1", "#90d1ed");
    }, 100);
}

function checkTaskDate() {
    setTimeout(() => {
        const input = document.getElementById("date-input");
        const message = document.getElementById("missing-date-message");
        checkTaskOnClickInsideElement(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElement(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElement(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

function checkTaskOnClickInsideElement(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("click", () => {
        if (input.trim === "") {
            input.style = `border: 1px solid ${bordercolor1};`;
            if (message != "") {
                message.style.display = "flex";
            }
        } else {
            input.style = `border: 1px solid ${bordercolor2};`;
            if (message != "") {
                message.style.display = "none";
            }
        }
    });
}

function checkTaskOnClickOutsideElement(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("blur", () => {
        if (input.value === "") {
            input.style = `border: 1px solid ${bordercolor1};`;
            if (message != "") {
                message.style.display = "flex";
            }
        } else {
            input.style = `border: 1px solid ${bordercolor2};`;
            if (message != "") {
                message.style.display = "none";
            }
        }
    });
}

function checkTaskOnKeystrokeInsideElement(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("input", () => {
        if (input.value === "") {
            input.style = `border: 1px solid ${bordercolor1};`;
            if (message != "") {
                message.style.display = "flex";
            }
        } else {
            input.style = `border: 1px solid ${bordercolor2};`;
            if (message != "") {
                message.style.display = "none";
            }
        }
    });
}

function checkTaskSubtask() {
    setTimeout(() => {
        const input1 = document.getElementById("new-subtask-container");
        const input2 = document.getElementById("new-subtask-input");

        if (input1 && input2) {
            checkTaskOnClickInsideSubtaskElement(input1, input2, "#90d1ed");
            checkTaskOnClickOutsideSubtaskElement(input1, input2, "#d1d1d1");
        }
    }, 100);
}

function checkTaskOnClickInsideSubtaskElement(input1, input2, bordercolor) {
    input2.addEventListener("focus", () => {
        input1.style.border = `1px solid ${bordercolor}`;
        console.log("Input focused - border blue");
    });

    input2.addEventListener("input", () => {
        if (input2.value.trim() !== "") {
            input1.style.border = `1px solid ${bordercolor}`;
            const missingSubtaskMessage = document.getElementById("missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}

function checkTaskOnClickOutsideSubtaskElement(input1, input2, bordercolor) {
    document.addEventListener("click", (event) => {
        if (!input1.contains(event.target) && !input2.contains(event.target)) {
            input1.style.border = `1px solid ${bordercolor}`;
            console.log("Clicked outside subtask area - border gray");
            resetSubtaskIcon();
            const missingSubtaskMessage = document.getElementById("missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}
