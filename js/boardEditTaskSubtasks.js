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
