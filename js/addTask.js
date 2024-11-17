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
 * Validates and checks for changes in the task creation form fields.
 *
 * This function sequentially calls validation or check functions for the key task fields:
 * - `checkTaskTitle`: Ensures the task title is valid or updated.
 * - `checkTaskDescription`: Verifies the task description is present or updated.
 * - `checkTaskDate`: Validates the task date for correctness or changes.
 * - `checkTaskSubtask`: Checks for changes or validity in the associated subtasks.
 */
function checkAddTaskChanges() {
    checkTaskTitle();
    checkTaskDescription();
    checkTaskDate();
    checkTaskSubtask();
}

/**
 * Validates the task title input field and updates its styling and error message dynamically.
 *
 * This function performs multiple checks on the `title-input` field using the following methods:
 * - `checkTaskOnClickInsideElement`: Validates the input when clicked inside, updating styles for errors and valid states.
 * - `checkTaskOnClickOutsideElement`: Validates the input when clicked outside, updating styles for errors and valid states.
 * - `checkTaskOnKeystrokeInsideElement`: Validates the input dynamically during typing, updating styles for errors and valid states.
 *
 * These checks are performed with a slight delay using `setTimeout` to ensure the elements are properly loaded.
 */
function checkTaskTitle() {
    setTimeout(() => {
        const input = document.getElementById("title-input");
        const message = document.getElementById("missing-title-message");
        checkTaskOnClickInsideElement(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElement(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElement(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

/**
 * Validates the task description input field and dynamically updates its styling.
 *
 * This function performs the following checks on the `textarea-input` field:
 * - `checkTaskOnClickInsideElement`: Applies styles when the input is clicked inside, using the specified colors.
 * - `checkTaskOnClickOutsideElement`: Updates styles when the input loses focus (clicked outside).
 * - `checkTaskOnKeystrokeInsideElement`: Dynamically updates styles during typing inside the input field.
 *
 * These actions are delayed using `setTimeout` to ensure the DOM elements are fully loaded.
 * Note: No error message is provided for this field, as indicated by the empty string passed to the functions.
 */
function checkTaskDescription() {
    setTimeout(() => {
        const input = document.getElementById("textarea-input");
        checkTaskOnClickInsideElement(input, "", "#90d1ed", "#90d1ed");
        checkTaskOnClickOutsideElement(input, "", "#d1d1d1", "#d1d1d1");
        checkTaskOnKeystrokeInsideElement(input, "", "#d1d1d1", "#90d1ed");
    }, 100);
}

/**
 * Validates the task date input field and updates its styling and error message dynamically.
 *
 * This function performs multiple checks on the `date-input` field using the following methods:
 * - `checkTaskOnClickInsideElement`: Validates the input when clicked inside, updating styles and showing/hiding the error message.
 * - `checkTaskOnClickOutsideElement`: Validates the input when clicked outside, updating styles and showing/hiding the error message.
 * - `checkTaskOnKeystrokeInsideElement`: Dynamically validates the input during typing, updating styles and showing/hiding the error message.
 *
 * A delay is introduced with `setTimeout` to ensure that the DOM elements are fully loaded before the checks are performed.
 */
function checkTaskDate() {
    setTimeout(() => {
        const input = document.getElementById("date-input");
        const message = document.getElementById("missing-date-message");
        checkTaskOnClickInsideElement(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElement(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElement(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

/**
 * Adds a click event listener to an input field to validate its content and update styles dynamically.
 *
 * @param {HTMLElement} input - The input element to which the click event listener will be attached.
 * @param {HTMLElement|string} message - The message element to display or hide, or an empty string if no message is used.
 * @param {string} bordercolor1 - The border color to apply when the input is invalid (e.g., empty or incorrect).
 * @param {string} bordercolor2 - The border color to apply when the input is valid.
 *
 * This function:
 * - Checks if the `input`'s trimmed value is empty upon clicking inside the element.
 * - Updates the `input`'s border style to reflect validity or invalidity.
 * - Shows or hides the `message` element (if provided) based on the input's validity.
 */
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

/**
 * Adds a blur event listener to an input field to validate its content and update styles dynamically when focus is lost.
 *
 * @param {HTMLElement} input - The input element to which the blur event listener will be attached.
 * @param {HTMLElement|string} message - The message element to display or hide, or an empty string if no message is used.
 * @param {string} bordercolor1 - The border color to apply when the input is invalid (e.g., empty or incorrect).
 * @param {string} bordercolor2 - The border color to apply when the input is valid.
 *
 * This function:
 * - Checks if the `input`'s value is empty when it loses focus (on blur).
 * - Updates the `input`'s border style to indicate validity or invalidity.
 * - Shows or hides the `message` element (if provided) based on the input's validity.
 */
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

/**
 * Adds an input event listener to dynamically validate the input field as the user types.
 *
 * @param {HTMLElement} input - The input element to which the input event listener will be attached.
 * @param {HTMLElement|string} message - The message element to display or hide, or an empty string if no message is used.
 * @param {string} bordercolor1 - The border color to apply when the input is invalid (e.g., empty or incorrect).
 * @param {string} bordercolor2 - The border color to apply when the input is valid.
 *
 * This function:
 * - Checks if the `input`'s value is empty during user input.
 * - Updates the `input`'s border style dynamically to indicate validity or invalidity.
 * - Shows or hides the `message` element (if provided) based on the input's current state.
 */
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

/**
 * Validates the task subtask input fields and updates their styles dynamically.
 *
 * This function performs the following checks on the subtask input elements:
 * - `checkTaskOnClickInsideSubtaskElement`: Applies styles when the subtask input is clicked inside.
 * - `checkTaskOnClickOutsideSubtaskElement`: Applies styles when the subtask input loses focus (clicked outside).
 *
 * A delay is introduced using `setTimeout` to ensure that the DOM elements are fully loaded before performing the checks.
 *
 * @returns {void}
 */
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

/**
 * Adds event listeners to the subtask input elements to validate and update styles dynamically.
 *
 * @param {HTMLElement} input1 - The container element (e.g., `new-subtask-container`) that will have its border style updated.
 * @param {HTMLElement} input2 - The subtask input element (e.g., `new-subtask-input`) that the user interacts with.
 * @param {string} bordercolor - The border color to apply when the subtask input is focused or has valid input.
 *
 * This function:
 * - Applies the provided `bordercolor` to `input1` when `input2` is focused.
 * - Hides the error message (if present) when `input2` has valid input (non-empty value).
 * - Updates the border style of `input1` when there is input in `input2`.
 */
function checkTaskOnClickInsideSubtaskElement(input1, input2, bordercolor) {
    input2.addEventListener("focus", () => {
        input1.style.border = `1px solid ${bordercolor}`;
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

/**
 * Adds an event listener to detect clicks outside of the subtask input elements and updates styles accordingly.
 *
 * @param {HTMLElement} input1 - The container element (e.g., `new-subtask-container`) whose border style will be updated.
 * @param {HTMLElement} input2 - The subtask input element (e.g., `new-subtask-input`) to check for clicks outside of.
 * @param {string} bordercolor - The border color to apply when clicks are detected outside the subtask elements.
 *
 * This function:
 * - Listens for clicks on the document and checks if the click occurred outside of both `input1` and `input2`.
 * - Resets the border color of `input1` and hides the error message if the click is outside both elements.
 * - Calls `resetSubtaskIcon` to reset any related icon.
 */
function checkTaskOnClickOutsideSubtaskElement(input1, input2, bordercolor) {
    document.addEventListener("click", (event) => {
        if (!input1.contains(event.target) && !input2.contains(event.target)) {
            input1.style.border = `1px solid ${bordercolor}`;
            resetSubtaskIcon();
            const missingSubtaskMessage = document.getElementById("missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}
