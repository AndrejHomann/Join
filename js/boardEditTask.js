/**
 * Handles the click event for the edit button and initiates the task editing process.
 * This function finds the task in the `tasksArray` based on the provided `taskId`.
 * If the task is found, it calls the `editTask` function to allow the user to edit the task.
 * If the task is not found, an error message is logged to the console.
 * @param {string} taskId - The unique ID of the task to be edited.
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
 * This function sets up the editing environment for a task by updating the task's overlay
 * with information such as the task's title, description, date, priority, subtasks, and assigned contacts.
 * It also sets up event listeners for subtask input and configures the UI elements, including
 * the priority button and contacts icons.
 * @param {Object} task - The task object containing the details to be edited.
 * @param {string} taskId - The unique ID of the task being edited.
 */
function editTask(task, taskId) {
    const editTask = document.getElementById("editTask");
    if (!editTask) {
        console.error("Edit-Overlay nicht gefunden");
        return;
    }
    editTask.innerHTML = loadEditTaskHTML(task.title, task.taskDescription, task.date, task.priority, renderEditableSubtasks(task.addedSubtasks), task.id, task);
    setUpEditTaskProperties(task);
    const iconsContainer = document.getElementById("edit-selected-contacts-circle-container");
    if (iconsContainer) {
        appendEditableUserIcons(task, iconsContainer);
        document.getElementById("edit-assigned-container").classList.add("heightAuto");
    } else {
        console.error("Icons-Container nicht gefunden");
    }
}

function setUpEditTaskProperties(task) {
    isCategoryAvailable = false;
    selectedContacts = task.name || [];
    selectedColors = task.color || [];
    highlightPrioButton(task.priority);
    let subtaskInputEdit = document.getElementById("edit-new-subtask-input");
    subtaskInputEdit.addEventListener("input", showCloseOrDeleteIconDuringWritingSubtaskEdit);
    subtaskInputEdit.addEventListener("keydown", addSubtaskByEnterKeyEdit);
}

/**
 * Highlights the priority button corresponding to the given priority.
 * This function resets the styles of all priority buttons and then highlights the
 * button that matches the provided priority by applying the appropriate background color.
 * The selected priority is also stored in the `selectedPrio` variable.
 * @param {string} priority - The priority level to be highlighted. Can be "urgent", "medium", or "low".
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
 * This function validates the inputs, updates the subtasks, and prepares the task data
 * to be sent to the server with the use of functions iterateSubtasks() and getEditTaskValues(). 
 * It sends a PATCH request to update the task in the database with the function updateEditedTask(),
 * and upon success, it triggers the `handleUpdateTask` function to finalize the update process.
 * @async
 * @param {string} taskId - The ID of the task to be updated.
 * @returns {Promise<void>} A promise that resolves once the task update is complete.
 * @throws {Error} If there is an error while updating the task or sending the request.
 */
async function updateTask(taskId) {
    if (!validateAllInputsEdit()) {
        return;
    }
    iterateSubtasks();
    try {
        const taskToUpdate = tasksArray.find((t) => t.id === taskId);
        const { id, ...taskWithoutId } = taskToUpdate;
        const updatedTask = getEditTaskValues(taskWithoutId);
        await updateEditedTask(taskId, updatedTask);
    } catch (error) {
        console.error("Fehler:", error);
    }
    handleUpdateTask();
    wasContactsDropdownOpenInCurrentTask = false;
    selectedContacts = [];
    selectedColors = [];
}

function iterateSubtasks() {
    for (let i = 0; i < subtasks.length; i++) {
        let currentSubtask = subtasks[i];
        subtasks[i] = {
            subtask: typeof currentSubtask === "object" ? currentSubtask.subtask : currentSubtask,
            status: currentSubtask.status === "checked" ? "checked" : "unchecked",
        };
    }
}

function getEditTaskValues(taskWithoutId) {
    const updateTask = {
        ...taskWithoutId,
        title: document.getElementById("edit-title-input").value,
        taskDescription: document.getElementById("edit-textarea-input").value,
        date: document.getElementById("edit-date-input").value,
        priority: selectedPrio,
        name: selectedContacts,
        color: selectedColors,
        addedSubtasks: subtasks,
    };
    return updateTask;
}

async function updateEditedTask(taskId, updatedTask) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error("Fehler beim Aktualisieren der Task-Daten");
    await response.json();
}

/**
 * Handles the update of a task by performing the necessary steps after a task has been updated.
 * This function reloads the task list, closes the task editing view, and closes the task details overlay
 * to finalize the task update process.
 * @returns {void}
 */
function handleUpdateTask() {
    loadTasks();
    closeEditTask();
    closeTaskDetails();
}

/**
 * Checks if any changes have been made to the task during editing.
 * This function invokes individual checks for the task's title, description, date, and subtasks.
 * Each of the helper functions (`checkEditTaskTitle`, `checkEditTaskDescription`,
 * `checkEditTaskDate`, and `checkEditTaskSubtask`) performs specific validation for a task field.
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
 * The function uses `setTimeout` to delay the execution, allowing the DOM to be fully loaded
 * before attaching the event listeners.
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
 * @param {HTMLInputElement} input - The input element to which the click event listener is attached.
 * @param {HTMLElement} message - The message element to be shown or hidden based on the input's value.
 * @param {string} bordercolor1 - The border color to apply when the input value is empty.
 * @param {string} bordercolor2 - The border color to apply when the input has a non-empty value.
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
 * @param {HTMLInputElement} input - The input element to which the blur event listener is attached.
 * @param {HTMLElement} message - The message element to be shown or hidden based on the input's value.
 * @param {string} bordercolor1 - The border color to apply when the input value is empty.
 * @param {string} bordercolor2 - The border color to apply when the input has a non-empty value.
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
 * @param {HTMLInputElement} input - The input element to which the input event listener is attached.
 * @param {HTMLElement} message - The message element to be shown or hidden based on the input's value.
 * @param {string} bordercolor1 - The border color to apply when the input value is empty.
 * @param {string} bordercolor2 - The border color to apply when the input has a non-empty value.
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