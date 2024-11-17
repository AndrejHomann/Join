/**
 * Renders the editable subtasks for the current task and stores the subtasks in the `subtasks` array.
 *
 * This function generates the HTML for the editable subtasks based on the provided `subtasksFromCurrentTask` array.
 * It also updates the global `subtasks` array with the subtasks' content and status.
 * If no subtasks are provided, it returns an empty string. If there are subtasks, it creates HTML for each subtask
 * and adds it to the page.
 *
 * @param {Array} subtasksFromCurrentTask - An array of subtasks for the current task, where each subtask is an object
 *                                          containing `subtask` (string) and `status` (string).
 *                                          Example: `[ { subtask: "Task 1", status: "unchecked" }, { subtask: "Task 2", status: "checked" } ]`
 * @returns {string} HTML string to render the editable subtasks list.
 *
 */
function renderEditableSubtasks(subtasksFromCurrentTask) {
    subtasksFromCurrentTask = subtasksFromCurrentTask || [];

    if (subtasksFromCurrentTask.length === 0) {
        return "";
    } else {
        subtasks = [];

        let subtasksHTML = "";
        for (let i = 0; i < subtasksFromCurrentTask.length; i++) {
            subtasksHTML += templateSubtasksListHTMLEdit(i, subtasksFromCurrentTask[i].subtask);

            let loadedSubtask = subtasksFromCurrentTask[i].subtask;
            let loadedStatus = subtasksFromCurrentTask[i].status;

            subtasks.push({ subtask: loadedSubtask, status: loadedStatus });
        }
        return subtasksHTML;
    }
}

/**
 * Updates the displayed list of subtasks after a subtask has been deleted from the board.
 *
 * This function re-renders the list of subtasks on the page by updating the inner HTML of the
 * `generated-subtask-list-container`. It iterates over the global `subtasks` array and uses the
 * `templateSubtasksListHTML` function to create the HTML for each subtask. The newly generated
 * HTML is then inserted into the container to reflect the current state of subtasks after deletion.
 *
 */
function updateSubtaskListAfterDeleteFromBoard() {
    let subtaskList = document.getElementById("generated-subtask-list-container");

    subtaskList.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskHTML = templateSubtasksListHTML(i, subtasks[i]);
        subtaskList.innerHTML += subtaskHTML;
    }
}

/**
 * Handles the click event for the edit button and initiates the task editing process.
 *
 * This function finds the task in the `tasksArray` based on the provided `taskId`.
 * If the task is found, it calls the `editTask` function to allow the user to edit the task.
 * If the task is not found, an error message is logged to the console.
 *
 * @param {string} taskId - The unique ID of the task to be edited.
 *
 */
function handleEditButtonClick(taskId) {
    const taskToEdit = tasksArray.find((task) => task.id === taskId);

    if (taskToEdit) {
        editTask(taskToEdit);
    } else {
        console.error("Aufgabe nicht gefunden!");
    }
}

/**
 * Initiates the task editing process by populating the edit overlay with the task's details.
 *
 * This function sets up the editing environment for a task by updating the task's overlay
 * with information such as the task's title, description, date, priority, subtasks, and assigned contacts.
 * It also sets up event listeners for subtask input and configures the UI elements, including
 * the priority button and contacts icons.
 *
 * @param {Object} task - The task object containing the details to be edited.
 * @param {string} taskId - The unique ID of the task being edited.
 *
 */
function editTask(task, taskId) {
    const editTask = document.getElementById("editTask");
    if (!editTask) {
        console.error("Edit-Overlay nicht gefunden");
        return;
    }

    editTask.innerHTML = loadEditTaskHTML(task.title, task.taskDescription, task.date, task.priority, renderEditableSubtasks(task.addedSubtasks), task.id, task);

    isCategoryAvailable = false;

    selectedContacts = task.name || [];
    selectedColors = task.color || [];

    highlightPrioButton(task.priority);

    let subtaskInputEdit = document.getElementById("edit-new-subtask-input");
    subtaskInputEdit.addEventListener("input", showCloseOrDeleteIconDuringWritingSubtaskEdit);
    subtaskInputEdit.addEventListener("keydown", addSubtaskByEnterKeyEdit);

    const iconsContainer = document.getElementById("edit-selected-contacts-circle-container");
    if (iconsContainer) {
        appendEditableUserIcons(task, iconsContainer);
        document.getElementById("edit-assigned-container").classList.add("heightAuto");
    } else {
        console.error("Icons-Container nicht gefunden");
    }
}

/**
 * Highlights the priority button corresponding to the given priority.
 *
 * This function resets the styles of all priority buttons and then highlights the
 * button that matches the provided priority by applying the appropriate background color.
 * The selected priority is also stored in the `selectedPrio` variable.
 *
 * @param {string} priority - The priority level to be highlighted. Can be "urgent", "medium", or "low".
 *
 */
function highlightPrioButton(priority) {
    resetPrio();

    const selectedButton = document.getElementById(`edit-prio-${priority}-button`);
    if (selectedButton) {
        selectedButton.classList.add(`prio-${priority}-button-bg-color`);
        selectedPrio = priority;
    }
}

/**
 * Updates a task in the database by sending the updated task data to the server.
 *
 * This function validates the inputs, updates the subtasks, and prepares the task data
 * to be sent to the server. It sends a PATCH request to update the task in the database,
 * and upon success, it triggers the `handleUpdateTask` function to finalize the update process.
 *
 * @async
 * @param {string} taskId - The ID of the task to be updated.
 *
 * @returns {Promise<void>} A promise that resolves once the task update is complete.
 *
 * @throws {Error} If there is an error while updating the task or sending the request.
 *
 */
async function updateTask(taskId) {
    if (!validateAllInputsEdit()) {
        return;
    }

    for (let i = 0; i < subtasks.length; i++) {
        let currentSubtask = subtasks[i];

        subtasks[i] = {
            subtask: typeof currentSubtask === "object" ? currentSubtask.subtask : currentSubtask,
            status: currentSubtask.status === "checked" ? "checked" : "unchecked",
        };
    }

    try {
        const taskToUpdate = tasksArray.find((t) => t.id === taskId);
        const { id, ...taskWithoutId } = taskToUpdate;

        const updatedTask = {
            ...taskWithoutId,
            title: document.getElementById("edit-title-input").value,
            taskDescription: document.getElementById("edit-textarea-input").value,
            date: document.getElementById("edit-date-input").value,
            priority: selectedPrio,
            name: selectedContacts,
            color: selectedColors,
            addedSubtasks: subtasks,
        };

        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) throw new Error("Fehler beim Aktualisieren der Task-Daten");

        await response.json();
    } catch (error) {
        console.error("Fehler:", error);
    }
    handleUpdateTask();
    wasContactsDropdownOpenInCurrentTask = false;
    selectedContacts = [];
    selectedColors = [];
}

/**
 * Handles the update of a task by performing the necessary steps after a task has been updated.
 *
 * This function reloads the task list, closes the task editing view, and closes the task details overlay
 * to finalize the task update process.
 *
 * @returns {void}
 *
 */
function handleUpdateTask() {
    loadTasks();
    closeEditTask();
    closeTaskDetails();
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
 * Checks if any changes have been made to the task during editing.
 * This function invokes individual checks for the task's title, description, date, and subtasks.
 * Each of the helper functions (`checkEditTaskTitle`, `checkEditTaskDescription`,
 * `checkEditTaskDate`, and `checkEditTaskSubtask`) performs specific validation for a task field.
 *
 */
function checkEditTaskChanges() {
    checkEditTaskTitle();
    checkEditTaskDescription();
    checkEditTaskDate();
    checkEditTaskSubtask();
}

/**
 * Validates the task title input field by setting up event listeners for user interactions.
 * The function checks the title field for changes when clicked inside, clicked outside,
 * or when a keystroke occurs, and adjusts the field's border color based on validity.
 *
 */
function checkEditTaskTitle() {
    setTimeout(() => {
        const input = document.getElementById("edit-title-input");
        const message = document.getElementById("edit-missing-title-message");
        checkEditTaskOnClickInsideElement(input, message, "#ff8190", "#90d1ed");
        checkEditTaskOnClickOutsideElement(input, message, "#ff8190", "#d1d1d1");
        checkEditTaskOnKeystrokeInsideElement(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

/**
 * Validates and monitors changes to the task date input field.
 * This function sets up event listeners and validation for the "edit date" input field,
 * including checks when the user clicks inside or outside the field, or types inside it.
 * It modifies the input field's border color and displays a message based on the validation status.
 *
 * The function uses `setTimeout` to delay the execution, allowing the DOM to be fully loaded
 * before attaching the event listeners.
 *
 */
function checkEditTaskDate() {
    setTimeout(() => {
        const input = document.getElementById("edit-date-input");
        const message = document.getElementById("edit-missing-date-message");
        checkEditTaskOnClickInsideElement(input, message, "#ff8190", "#90d1ed");
        checkEditTaskOnClickOutsideElement(input, message, "#ff8190", "#d1d1d1");
        checkEditTaskOnKeystrokeInsideElement(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

/**
 * Sets up an event listener for the "click" event on the given input element to validate its value.
 * If the input value is empty, the input's border is highlighted with a specified color and
 * an associated message (if provided) is displayed. If the input value is not empty, the border
 * color changes and the message (if present) is hidden.
 *
 * @param {HTMLInputElement} input - The input element to which the click event listener is attached.
 * @param {HTMLElement} message - The message element to be shown or hidden based on the input's value.
 * @param {string} bordercolor1 - The border color to apply when the input value is empty.
 * @param {string} bordercolor2 - The border color to apply when the input has a non-empty value.
 *
 */
function checkEditTaskOnClickInsideElement(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("click", () => {
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
 * Sets up an event listener for the "blur" event (when the input loses focus) to validate its value.
 * If the input value is empty, the input's border is highlighted with a specified color and
 * an associated message (if provided) is displayed. If the input value is not empty, the border
 * color changes and the message (if present) is hidden.
 *
 * @param {HTMLInputElement} input - The input element to which the blur event listener is attached.
 * @param {HTMLElement} message - The message element to be shown or hidden based on the input's value.
 * @param {string} bordercolor1 - The border color to apply when the input value is empty.
 * @param {string} bordercolor2 - The border color to apply when the input has a non-empty value.
 *
 */
function checkEditTaskOnClickOutsideElement(input, message, bordercolor1, bordercolor2) {
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
 * Sets up an event listener for the "input" event (when the user types or modifies the input value)
 * to validate the input field as the user types.
 * If the input value is empty, the input's border is highlighted with a specified color and
 * an associated message (if provided) is displayed. If the input value is not empty, the border
 * color changes and the message (if present) is hidden.
 *
 * @param {HTMLInputElement} input - The input element to which the input event listener is attached.
 * @param {HTMLElement} message - The message element to be shown or hidden based on the input's value.
 * @param {string} bordercolor1 - The border color to apply when the input value is empty.
 * @param {string} bordercolor2 - The border color to apply when the input has a non-empty value.
 *
 */
function checkEditTaskOnKeystrokeInsideElement(input, message, bordercolor1, bordercolor2) {
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
 * Validates and monitors changes to the task description input field (textarea).
 * This function sets up event listeners for the "edit description" textarea, including checks when
 * the user clicks inside or outside the field, or types inside it. It modifies the textarea's border
 * color based on the input's state, but does not show a validation message (since the message is empty).
 *
 * The function uses `setTimeout` to delay the execution, allowing the DOM to be fully loaded
 * before attaching the event listeners.
 */
function checkEditTaskDescription() {
    setTimeout(() => {
        const input = document.getElementById("edit-textarea-input");
        checkEditTaskOnClickInsideElement(input, "", "#90d1ed", "#90d1ed");
        checkEditTaskOnClickOutsideElement(input, "", "#d1d1d1", "#d1d1d1");
        checkEditTaskOnKeystrokeInsideElementDescription(input, "#90d1ed");
    }, 100);
}

/**
 * Sets up an event listener for the "input" event on the given input element (textarea).
 * This listener modifies the input's border color each time the user types or modifies the value
 * of the textarea, based on the provided `bordercolor`.
 *
 * @param {HTMLTextAreaElement} input - The textarea element to which the input event listener is attached.
 * @param {string} bordercolor - The border color to apply to the textarea while typing.
 */
function checkEditTaskOnKeystrokeInsideElementDescription(input, bordercolor) {
    input.addEventListener("input", () => {
        input.style = `border: 1px solid ${bordercolor};`;
    });
}

/**
 * Validates and monitors changes to the subtask input fields in the task editing interface.
 * This function sets up event listeners for the "edit subtask" container and input field.
 * It checks interactions when the user clicks inside or outside the subtask input fields,
 * and updates the border color based on the user's actions.
 *
 * The function uses `setTimeout` to delay the execution, allowing the DOM to be fully loaded
 * before attaching the event listeners.
 */
function checkEditTaskSubtask() {
    setTimeout(() => {
        const input1 = document.getElementById("edit-new-subtask-container");
        const input2 = document.getElementById("edit-new-subtask-input");

        if (input1 && input2) {
            checkTaskOnClickInsideElementEditSubtask(input1, input2, "#90d1ed");
            checkTaskOnClickOutsideElementEditSubtask(input1, input2, "#d1d1d1");
        }
    }, 100);
}

/**
 * Sets up event listeners to handle interactions with the subtask input field during task editing.
 * When the input field gains focus or when the user types in it, this function updates the border
 * color of the subtask container (`input1`) and hides the "missing subtask" message if the input value is non-empty.
 *
 * @param {HTMLElement} input1 - The element (container) whose border will be updated based on the input's state.
 * @param {HTMLInputElement} input2 - The input field (for the subtask) that the user interacts with.
 * @param {string} bordercolor - The color to apply to the border of `input1` when it is focused or typed in.
 */
function checkTaskOnClickInsideElementEditSubtask(input1, input2, bordercolor) {
    input2.addEventListener("focus", () => {
        input1.style.border = `1px solid ${bordercolor}`;
    });

    input2.addEventListener("input", () => {
        if (input2.value.trim() !== "") {
            input1.style.border = `1px solid ${bordercolor}`;
            const missingSubtaskMessage = document.getElementById("edit-missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}

/**
 * Sets up an event listener for clicks outside the subtask container and input field during task editing.
 * When a click is detected outside of the subtask input field or its container, the function resets
 * the border color of the subtask container, clears the input value, hides the "missing subtask" message,
 * and calls a function to reset the subtask icon.
 *
 * @param {HTMLElement} input1 - The element (container) whose border will be reset when a click outside occurs.
 * @param {HTMLInputElement} input2 - The input field for the subtask that is being edited.
 * @param {string} bordercolor - The color to apply to the border of `input1` when a click outside is detected.
 */
function checkTaskOnClickOutsideElementEditSubtask(input1, input2, bordercolor) {
    document.addEventListener("click", (event) => {
        if (!input1.contains(event.target) && !input2.contains(event.target)) {
            input1.style.border = `1px solid ${bordercolor}`;

            const inputField = document.getElementById("edit-new-subtask-input");
            if (inputField) {
                inputField.value = "";
            }

            resetSubtaskIconEdit();
            const missingSubtaskMessage = document.getElementById("edit-missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}

/**
 * Resets the "missing subtask" notification and border style for the subtask container during task editing.
 * This function hides the "missing subtask" message (if visible) and removes any border styling
 * from the subtask container.
 */
function resetSubtaskRequiredNotificationEdit() {
    let missingSubtaskMessage = document.getElementById("edit-missing-subtask-message");
    missingSubtaskMessage.style.display = "none";
    document.getElementById("edit-new-subtask-container").style.border = "";
}

/**
 * Validates all input fields during task editing. It checks whether the task title and date are properly entered.
 * If any of the fields are invalid, it sets `isValid` to `false` and returns this value.
 *
 * @returns {boolean} - Returns `true` if all required fields (title and date) are valid, otherwise returns `false`.
 */
function validateAllInputsEdit() {
    let isValid = true;

    if (!checkIfTitleIsEnteredEdit()) {
        isValid = false;
    }

    if (!checkIfDateIsSelectedEdit()) {
        isValid = false;
    }

    return isValid;
}

/**
 * Validates if the task title is entered during task editing.
 * If the title is not entered, it displays a "missing title" message and highlights the input field with a red border.
 * If the title is entered, the message is hidden, and the input field's border is reset.
 *
 * @returns {boolean} - Returns `true` if the title is entered, otherwise returns `false`.
 */
function checkIfTitleIsEnteredEdit() {
    let missingTitleMessage = document.getElementById("edit-missing-title-message");
    let titleInput = document.getElementById("edit-title-input");

    let isValid = true;

    if (titleInput.value) {
        missingTitleMessage.style.display = "none";
        isValid = true;
    } else {
        titleInput.style.border = "1px solid #ff8190";
        missingTitleMessage.style.display = "flex";
        missingTitleMessage.classList.add("validationStyle");
        isValid = false;
    }
    return isValid;
}

/**
 * Validates if a date is selected during task editing.
 * If no date is selected, it displays a "missing date" message and highlights the input field with a red border.
 * If a date is selected, the message is hidden, and the input field's border is reset.
 *
 * @returns {boolean} - Returns `true` if the date is selected, otherwise returns `false`.
 */
function checkIfDateIsSelectedEdit() {
    let missingDateMessage = document.getElementById("edit-missing-date-message");
    let dateInput = document.getElementById("edit-date-input");

    let isValid = true;

    if (dateInput.value) {
        missingDateMessage.style.display = "none";
        isValid = true;
    } else {
        missingDateMessage.style.display = "flex";
        missingDateMessage.classList.add("validationStyle");
        dateInput.style.border = "1px solid #ff8190";
        isValid = false;
    }
    return isValid;
}

/**
 * Toggles the subtask icon display and interactions during task editing.
 * This function updates the subtask icon container to display the "close" and "check" icons,
 * and adds hover effects to these icons. It is used for either adding or closing a subtask while editing a task.
 *
 * If a subtask is being edited, it replaces the existing icon with a close icon (to cancel) and a check icon (to save).
 * If a subtask is not being reset (based on the `isSubtaskResetting` flag), it performs this update.
 */
function addOrCloseSubtaskEdit() {
    if (isSubtaskResetting) return;

    let subtaskIconContainer = document.getElementById("edit-subtask-icon-container");

    subtaskIconContainer.classList.remove("plusIconHover");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="edit-close-icon-container" onclick="closeSubtaskDraftEdit()"><img src="/img/addTask/close.png" alt="delete" id="close-subtask"></div>
        <div class="border-subtask-container"></div>
        <div id="edit-check-icon-container" onclick="addSubtaskFromEdit()"><img src="/img/addTask/check.png" alt="check" id="check-subtask"></div>`;

    let checkIconContainer = document.getElementById("edit-check-icon-container");
    checkIconContainer.classList.add("circleHoverEffect");
    let closeIconContainer = document.getElementById("edit-close-icon-container");
    closeIconContainer.classList.add("circleHoverEffect");
}

/**
 * Closes the subtask draft while editing a task by clearing the input field and resetting the subtask icons.
 * This function is typically called when the user decides to cancel editing a subtask.
 */
function closeSubtaskDraftEdit() {
    let subtaskDraft = document.getElementById("edit-new-subtask-input");
    subtaskDraft.value = ``;
    resetSubtaskIconEdit();
}

/**
 * Displays the "close" or "check" icon while writing a subtask during task editing.
 * If the subtask input field is not empty, it shows the "close" and "check" icons for canceling or saving the subtask.
 * If the input field is empty, it resets the subtask icons to their initial state.
 */
function showCloseOrDeleteIconDuringWritingSubtaskEdit() {
    let subtaskInputEdit = document.getElementById("edit-new-subtask-input");

    if (subtaskInputEdit.value) {
        addOrCloseSubtaskEdit();
    } else {
        resetSubtaskIconEdit();
    }
}

/**
 * Adds a new subtask from the task editing form.
 * This function handles the subtask input validation, adds the subtask to the list of subtasks,
 * and resets the subtask icon container. It is typically called when the user clicks the "check" icon after entering a new subtask.
 */
function addSubtaskFromEdit() {
    let newSubtaskInput = document.getElementById("edit-new-subtask-input");
    let subtaskListEdit = document.getElementById("edit-generated-subtask-list-container");
    let missingSubtaskMessage = document.getElementById("edit-missing-subtask-message");
    let subtaskContainer = document.getElementById("edit-new-subtask-container");
    let i = subtasks.length;

    handleSubtaskValidationEdit(newSubtaskInput, subtaskListEdit, subtaskContainer, missingSubtaskMessage, i);
    resetSubtaskIconEdit();
}

/**
 * Adds an event listener for the "Enter" key press on the subtask input field during task editing.
 * When the "Enter" key is pressed, the event is prevented, and the `addSubtaskFromEdit` function is called to add the subtask.
 * This ensures that pressing "Enter" will trigger the subtask addition process.
 */
document.addEventListener("DOMContentLoaded", function () {
    let newSubtaskInput = document.getElementById("edit-new-subtask-input");
    if (newSubtaskInput) {
        newSubtaskInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                addSubtaskFromEdit();
            }
        });
    }
});

/**
 * Handles the validation and addition of a new subtask during task editing.
 * It validates the input, adds the subtask to the list, updates the UI to reflect the new subtask,
 * and resets or shows validation messages based on whether the input is valid.
 *
 * @param {HTMLInputElement} newSubtaskInput - The input element where the new subtask text is entered.
 * @param {HTMLElement} subtaskListEdit - The container element where the subtasks are listed.
 * @param {HTMLElement} subtaskContainer - The container element that holds the subtask input field.
 * @param {HTMLElement} missingSubtaskMessage - The element that displays a message when no subtask is entered.
 * @param {number} i - The current index in the `subtasks` array, used to generate unique subtask HTML.
 */
function handleSubtaskValidationEdit(newSubtaskInput, subtaskListEdit, subtaskContainer, missingSubtaskMessage, i) {
    let trimmedInput = newSubtaskInput.value.trim();

    if (trimmedInput !== "") {
        subtasks.push({ subtask: trimmedInput, status: "unchecked" });

        let subtaskHTMLList = templateSubtasksListHTMLEdit(i, subtasks[i].subtask);
        subtaskListEdit.innerHTML += subtaskHTMLList;

        newSubtaskInput.value = "";
        subtaskContainer.style.border = "1px solid #90d1ed";
        missingSubtaskMessage.style.display = "none";
    } else {
        subtaskContainer.style.border = "1px solid  #ff8190";
        missingSubtaskMessage.style.display = "flex";
    }
}

/**
 * Generates the HTML structure for a single subtask in the task editing form.
 * This HTML template includes the subtask text, edit and delete icons, and the container for the subtask.
 * The function is used to render each subtask in the list of subtasks.
 *
 * @param {number} i - The index of the subtask in the `subtasks` array, used to generate unique IDs for each subtask.
 * @param {string} subtask - The text/content of the subtask to be displayed in the list.
 *
 * @returns {string} - The HTML structure as a string for the subtask, which includes:
 *   - A container div with a unique ID based on the subtask index.
 *   - A list item (`<li>`) displaying the subtask text.
 *   - Icons for editing and deleting the subtask, each with click handlers.
 */
function templateSubtasksListHTMLEdit(i, subtask) {
    return /*html*/ `
            <div class="generatedSubtasks" id="edit-generated-subtask-container-${i}">
                <li id="edit-generated-subtask-list-item-${i}" class="subtaskListItemStyle">${subtask}</li>
                <div id="edit-generated-subtask-list-icons">
                    <div id="edit-edit-icon-container" onclick="editSubtaskEdit(${i})"><img src="/img/addTask/edit.png" alt="edit" /></div>
                    <div class="border-subtask-container"></div>
                    <div id="edit-delete-icon-container" onclick="deleteSubtaskEdit(${i})">
                        <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                    </div>
                </div>
            </div>`;
}

/**
 * Initiates the process of editing a specific subtask in the task editing form.
 * This function replaces the current subtask content with an editable input field, allowing the user
 * to modify the subtask text. It also sets up event listeners for editing the subtask via the Enter key.
 *
 * @param {number} index - The index of the subtask in the `subtasks` array that is being edited.
 *   This is used to identify the subtask element and its associated data.
 *
 * @returns {void} - This function doesn't return anything. It modifies the DOM to replace the
 *   current subtask with an editable input field and sets up the necessary event listeners.
 */
function editSubtaskEdit(index) {
    let toEditSubtask = document.getElementById(`edit-generated-subtask-container-${index}`);
    let currentSubtaskText = subtasks[index].subtask;

    toEditSubtask.classList.add("noHoverEffect");

    toEditSubtask.innerHTML = templateEditSubtasksHTMLEdit(currentSubtaskText, index);

    setupEditSubtaskByEnterKeyEdit(index);
}

/**
 * Generates the HTML structure for editing a subtask in the task editing form.
 * This function creates an input field populated with the current subtask text and includes
 * icons for deleting or submitting the edit. The generated HTML allows the user to modify
 * the subtask text and submit or delete the changes.
 *
 * @param {string} currentSubtaskText - The current text of the subtask that the user will edit.
 *   This is used to pre-fill the input field when editing.
 * @param {number} index - The index of the subtask in the `subtasks` array, used to generate
 *   unique IDs for the editable subtask and its associated buttons.
 *
 * @returns {string} - The HTML string representing the editable subtask interface, which includes:
 *   - An input field pre-filled with the current subtask text.
 *   - Icons for submitting or deleting the edited subtask.
 */
function templateEditSubtasksHTMLEdit(currentSubtaskText, index) {
    return /*html*/ `
        <div id="edit-subtask-container">
            <input type="text" id="edit-edit-subtask-input-${index}" value="${currentSubtaskText}" class="edit-subtask-container-styling">            
            <div id="edit-generated-subtask-list-icons" class="showSubtaskIconsWhileEditing">
                <div id="edit-delete-icon-container" onclick="deleteSubtaskEdit(${index})">
                    <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                </div>     
                <div class="border-subtask-container"></div>
                <div id="submit-edit-icon-container" onclick="submitSubtaskEdit(${index})">
                    <img src="/img/addTask/check.png" alt="check" id="check-subtask">
                </div>
            </div>
        </div>`;
}

/**
 * Deletes a subtask from the task editing form and the `subtasks` array.
 * This function removes the HTML element representing the subtask and updates
 * the internal `subtasks` array by removing the subtask at the specified index.
 * Afterward, it calls `updateSpecificSubtaskEdit` to ensure the UI is refreshed.
 *
 * @param {number} index - The index of the subtask in the `subtasks` array that should be deleted.
 *   This index is used to identify the subtask both in the DOM and the `subtasks` array.
 *
 * @returns {void} - This function doesn't return a value. It modifies the DOM by removing
 *   the subtask element and updates the `subtasks` array.
 */
function deleteSubtaskEdit(index) {
    let newSubtask = document.getElementById(`edit-generated-subtask-container-${index}`);
    if (newSubtask) {
        newSubtask.remove();
    }
    subtasks.splice(index, 1);
    updateSpecificSubtaskEdit();
}

/**
 * Submits the edited subtask and updates the internal `subtasks` array.
 * This function checks if the input field for the edited subtask is empty.
 * If not, it updates the subtask in the `subtasks` array with the new value
 * and calls `updateSpecificSubtaskEdit` to refresh the UI with the updated subtask.
 *
 * @param {number} index - The index of the subtask in the `subtasks` array that is being edited.
 *   This index is used to identify the specific subtask to update in the array.
 *
 * @returns {void} - This function doesn't return a value. It modifies the `subtasks` array
 *   and updates the UI based on the changes made.
 */
function submitSubtaskEdit(index) {
    let editedSubtaskInput = document.getElementById(`edit-edit-subtask-input-${index}`).value;

    if (editedSubtaskInput === "") {
        return;
    } else {
        subtasks[index].subtask = editedSubtaskInput;
        updateSpecificSubtaskEdit();
    }
}

/**
 * Handles the "Enter" key press to add a subtask while editing.
 * This function listens for the "Enter" key event and prevents the default form submission behavior.
 * If the "Enter" key is pressed, it triggers the `addSubtaskFromEdit` function to add the new subtask.
 *
 * @param {KeyboardEvent} event - The KeyboardEvent object that represents the "Enter" key press.
 *   This event contains information about the key pressed and the target element.
 *
 * @returns {void} - This function doesn't return a value. It prevents the default event behavior
 *   and calls `addSubtaskFromEdit` to add the subtask.
 */
function addSubtaskByEnterKeyEdit(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtaskFromEdit();
    }
}

/**
 * Sets up an event listener to handle the "Enter" key press for editing a subtask.
 * This function adds a keydown event listener to the specified input field. When the "Enter" key
 * is pressed, it prevents the default behavior and calls `addEditedSubtaskByEnterKeyEdit` to handle
 * the submission of the edited subtask.
 *
 * @param {number} index - The index of the subtask being edited. This is used to identify the specific
 *   subtask input field to attach the event listener.
 *
 * @returns {void} - This function does not return a value. It adds an event listener to the input element
 *   and triggers the corresponding subtask edit functionality when the "Enter" key is pressed.
 */
function setupEditSubtaskByEnterKeyEdit(index) {
    let editSubtaskInput = document.getElementById(`edit-edit-subtask-input-${index}`);
    editSubtaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEditedSubtaskByEnterKeyEdit(index, event);
        }
    });
}

/**
 * Handles the "Enter" key press to submit an edited subtask.
 * This function is triggered when the "Enter" key is pressed while editing a subtask.
 * It prevents the default behavior and calls the `submitSubtaskEdit` function to save the edited subtask.
 *
 * @param {number} index - The index of the subtask being edited. This is used to identify the specific subtask
 *   and apply the changes to it.
 * @param {KeyboardEvent} event - The KeyboardEvent object that represents the "Enter" key press.
 *   It contains information about the key pressed and the target element.
 *
 * @returns {void} - This function does not return a value. It prevents the default event behavior
 *   and triggers the submission of the edited subtask by calling `submitSubtaskEdit`.
 */
function addEditedSubtaskByEnterKeyEdit(index, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtaskEdit(index);
    }
}

/**
 * Updates the list of subtasks in the edit mode by regenerating the HTML for each subtask.
 * This function clears the current list of subtasks in the DOM and repopulates it with updated subtask data.
 *
 * @returns {void} - This function does not return any value. It updates the subtask list in the DOM
 *   by regenerating the HTML for each subtask.
 */
function updateSpecificSubtaskEdit() {
    let subtaskList = document.getElementById("edit-generated-subtask-list-container");

    subtaskList.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskHTML = templateSubtasksListHTMLEdit(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;
    }
}

/**
 * Resets the subtask icon container in the edit mode, replacing it with the default "add" icon.
 * This function clears the current icons (e.g., check and close icons) and adds the "plus" icon back
 * to allow the user to add a new subtask. It also sets a flag to indicate that the subtask is being reset.
 *
 * @returns {void} - This function does not return any value. It performs a DOM update to reset the subtask icon.
 */
function resetSubtaskIconEdit() {
    let subtaskIconContainer = document.getElementById("edit-subtask-icon-container");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="edit-plus-icon-container" class="circleHoverEffect" onclick="addOrCloseSubtaskEdit()">
            <img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" />
        </div>`;

    isSubtaskResetting = true;
    setTimeout(resetSubtaskClearButton, 1);
}

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
 * Displays circles representing the selected contacts in the edit view.
 * Each circle contains the initials of a contact, and the circle's color is determined
 * by the contact's associated color. The function limits the number of visible circles
 * to a maximum of 6, and shows a label indicating how many more contacts are selected
 * if there are more than 6.
 *
 * @returns {void} - This function updates the DOM by rendering circles for selected contacts.
 */
function showCirclesOfSelectedContactsEdit() {
    let circleContainer = document.getElementById("edit-selected-contacts-circle-container");
    circleContainer.innerHTML = "";

    let maxCircles = 6;
    let remainingContacts = selectedContacts.length - maxCircles;

    for (let i = 0; i < selectedContacts.length; i++) {
        let contact = selectedContacts[i];
        let choosenContact = contactList.indexOf(contact);
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();
        let color = colors[choosenContact];

        if (i >= maxCircles) {
            break;
        }

        let contactHTML = /*html*/ `<div class="circle" style="background-color: ${color}">${firstLetter}${lastLetter}</div>`;
        circleContainer.innerHTML += contactHTML;
    }

    if (remainingContacts > 0) {
        let remainingText = /*html*/ `<div class="moreCirlce">+${remainingContacts} weitere</div>`;
        circleContainer.innerHTML += remainingText;
    }
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

/**
 * Generates the HTML for the task editing interface with pre-filled data for title, description,
 * date, priority, subtasks, and task ID.
 *
 * @param {string} title - The title of the task to be edited.
 * @param {string} description - The description of the task to be edited.
 * @param {string} date - The due date of the task (in YYYY-MM-DD format).
 * @param {string} priority - The priority of the task. Possible values: "urgent", "medium", "low".
 * @param {string} taskAddedSubtasks - HTML representation of the subtasks to be pre-filled in the task edit form.
 * @param {string} taskId - The unique identifier of the task being edited.
 *
 * @returns {string} - The HTML markup string for the task editing interface.
 */
function loadEditTaskHTML(title, description, date, priority, taskAddedSubtasks, taskId) {
    const urgentClass = priority === "urgent" ? "prio-urgent-button-bg-color" : "";
    const mediumClass = priority === "medium" ? "prio-medium-button-bg-color" : "";
    const lowClass = priority === "low" ? "prio-low-button-bg-color" : "";
    return /*html*/ `
    <div id="editTaskOverlay" class="edit-task-overlay">
        <div id="content-box-container-edit-task">
            <div class="closeButton">
                <div class="closeButtonDiv" onclick="closeEditTask()">
                    <img src="/img/board/assets/icons/closeBtn.png" alt="Close Button" />
                </div>
            </div>
            <div id="content-box-left" class="flex-column">
                <div id="title-container" class="flex-column gap8px">
                    <div class="subtitle">Title<span class="asterisk">*</span></div>
                    <div id="title-input-container">
                        <input type="text" placeholder="Enter a title" id="edit-title-input" value="${title}" />
                        <span id="edit-missing-title-message" class="validationStyle" style="display: none">This field is required</span>
                    </div>
                </div>
                <div id="description-container" class="flex-column gap8px">
                    <div class="subtitle">Description</div>
                    <div id="textarea-container" class="flex-column"><textarea placeholder="Enter a Description" id="edit-textarea-input">${description}</textarea></div>
                </div>
                <div id="edit-assigned-container" class="flex-column gap8px">
                    <div class="subtitle">Assigned to</div>
                    <div id="edit-selected-name" class="select-container"  onclick="checkIfContactsDropdownIsVisibleEdit()">   
                        <span id="edit-assigned-placeholder">Select contacts to assign</span>
                        <div id="edit-contacts-dropwdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>
                    </div>
                    <div id="edit-dropdown-list" class="d-none"></div>
                    <div id="edit-selected-contacts-circle-container"></div>
                </div>
            </div>
            <div id="edit-content-box-right" class="flex-column">
                <div id="date-container" class="flex-column gap8px">
                    <div class="subtitle">Due date<span class="asterisk">*</span></div>
                    <div id="calender">
                        <input type="date" id="edit-date-input" value="${date}" />
                        <span id="edit-missing-date-message" class="validationStyle" style="display: none">This field is required</span>
                    </div>
                </div>
                <div id="prio-container" class="flex-column gap8px">
                    <div class="subtitle">Prio</div>
                    <div id="choose-prio-container">
                        <button class="choose-prio-button flex-center-align" id="edit-prio-urgent-button" type="button" onclick="choosePrio('urgent')">
                            <span id="prio-urgent" class="flex-center-align">Urgent </span>
                            <svg class="prio-urgent-arrows" id="prio-urgent-arrows" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                        <button class="choose-prio-button flex-center-align prio-medium-button-bg-color" id="edit-prio-medium-button" type="button" onclick="choosePrio('medium')">
                            <span id="prio-medium" class="flex-center-align">Medium </span>
                            <svg class="prio-medium-arrows" id="prio-medium-arrows" width="21" height="8" viewBox="0 0 21 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_228141_4295)">
                                    <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="currentColor" />
                                    <path
                                        d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"
                                        fill="currentColor"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_228141_4295">
                                        <rect width="20" height="7.45098" fill="currentColor" transform="translate(0.248535 0.274414)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button class="choose-prio-button flex-center-align" id="edit-prio-low-button" type="button" onclick="choosePrio('low')">
                            <span id="prio-low" class="flex-center-align"> Low </span>
                            <svg class="prio-low-arrows" id="prio-low-arrows" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="edit-substasks-container" class="flex-column gap8px">
                    <div class="subtitle">Subtasks</div>
                    <div id="subtask-relative-container">
                        <div id="edit-new-subtask-container" onclick="addOrCloseSubtaskEdit()">
                            <input type="text" id="edit-new-subtask-input" placeholder="Add new subtask" class="subtaskInputsEdit"/>
                            <div id="edit-subtask-icon-container">
                                <div id="edit-plus-icon-container" class="circleHoverEffect"><img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" /></div>
                            </div>
                        </div>
                        <span id="edit-missing-subtask-message" class="validationStyleSubtasks" style="display: none">Please add a subtask 🙂</span>
                    </div>
                    <div id="new-subtask-list-edit-container">
                        <div id="edit-generated-subtask-list-container">${taskAddedSubtasks}</div>
                    </div>
                </div>
            </div>
            <div id="ok-edittask-button-container">
                <div id="ok-edittask-button" onclick="updateTask('${taskId}')">
                    <div id="ok-submit-container"><span>Ok</span></div>
                    <div id="check-submit-container"><img src="/img/board/assets/icons/check.png" alt="" /></div>
                </div>
            </div>
        </div>
    </div>
    `;
}
