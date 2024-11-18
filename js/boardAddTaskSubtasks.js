/**
 * Toggles between adding and closing a subtask in the task board.
 *
 * When a subtask is being added, this function updates the subtask icon container
 * to display the close and check icons for interacting with the subtask. It also
 * adds hover effects to the icons for better user experience.
 *
 * If a subtask is already being reset (determined by `isSubtaskResetting`),
 * the function will exit early and prevent any changes.
 *
 * @returns {void}
 */
function addOrCloseSubtaskBoard() {
    if (isSubtaskResetting) return;

    let subtaskIconContainer = document.getElementById("board-subtask-icon-container");

    subtaskIconContainer.classList.remove("plusIconHover");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="board-close-icon-container" onclick="closeSubtaskDraftBoard()"><img src="/img/addTask/close.png" alt="delete" id="close-subtask"></div>
        <div class="border-subtask-container"></div>
        <div id="board-check-icon-container" onclick="addSubtaskFromBoard()"><img src="/img/addTask/check.png" alt="check" id="check-subtask"></div>`;

    let checkIconContainer = document.getElementById("board-check-icon-container");
    checkIconContainer.classList.add("circleHoverEffect");
    let closeIconContainer = document.getElementById("board-close-icon-container");
    closeIconContainer.classList.add("circleHoverEffect");
}

function addSubtaskFromBoard() {
    let newSubtaskInput = document.getElementById("board-new-subtask-input");
    let subtaskList = document.getElementById("board-generated-subtask-list-container");
    let missingSubtaskMessage = document.getElementById("board-missing-subtask-message");
    let subtaskContainer = document.getElementById("board-new-subtask-container");
    let i = subtasks.length;

    handleSubtaskValidationBoard(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i);
    resetSubtaskIconBoard();
}

/**
 * Closes the subtask draft and resets the input field.
 */
function closeSubtaskDraftBoard() {
    let subtaskDraft = document.getElementById("board-new-subtask-input");
    subtaskDraft.value = ``;
    resetSubtaskIconBoard();
}

/**
 * Validates and handles the submission of a new subtask in the task board.
 *
 * This function checks if the subtask input field is not empty. If the input is valid (not empty),
 * it adds the new subtask to the list, updates the UI to display the subtask, and resets the input field.
 * It also styles the subtask container with a border and hides any error messages.
 *
 * If the input is empty, the function displays an error message and applies an error border to the container.
 *
 * @param {HTMLInputElement} newSubtaskInput - The input field where the user types the subtask.
 * @param {HTMLElement} subtaskList - The container where the list of subtasks is displayed.
 * @param {HTMLElement} subtaskContainer - The container element for the subtask input field.
 * @param {HTMLElement} missingSubtaskMessage - The message element displayed when no subtask is entered.
 * @param {number} i - The index of the subtask being added.
 * @returns {void}
 */
function handleSubtaskValidationBoard(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i) {
    let trimmedInput = newSubtaskInput.value.trim();

    if (trimmedInput !== "") {
        subtasks.push({ subtask: trimmedInput, status: "unchecked" });

        let subtaskHTML = templateSubtasksListHTMLBoard(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;

        newSubtaskInput.value = "";
        subtaskContainer.style.border = "1px solid #90d1ed";
        missingSubtaskMessage.style.display = "none";
    } else {
        subtaskContainer.style.border = "1px solid #ff8190";
        missingSubtaskMessage.style.display = "flex";
    }
}

/**
 * Resets the subtask icon container on the task board.
 *
 * This function resets the subtask icon container to display the plus icon. It replaces the current content
 * of the container with a new plus icon and adds the necessary hover effect and click event listener.
 * It also sets a flag to indicate that the subtask reset operation is in progress and calls the `resetSubtaskClearButton`
 * function after a brief delay to reset any related UI elements.
 *
 * @returns {void}
 */
function resetSubtaskIconBoard() {
    let subtaskIconContainer = document.getElementById("board-subtask-icon-container");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="board-plus-icon-container" class="circleHoverEffect" onclick="addOrCloseSubtaskBoard()">
            <img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" />
        </div>`;

    isSubtaskResetting = true;
    setTimeout(resetSubtaskClearButton, 1);
}

/**
 * Shows the close or delete icon during subtask creation based on input value.
 *
 * This function checks if there is any text entered in the subtask input field. If text is present, it calls
 * the `addOrCloseSubtaskBoard` function to display the close and check icons for interacting with the subtask.
 * If the input field is empty, it resets the subtask icon container by calling the `resetSubtaskIconBoard` function,
 * which restores the default plus icon.
 *
 * @returns {void}
 */
function showCloseOrDeleteIconDuringWritingSubtaskBoard() {
    let subtaskInputBoard = document.getElementById("board-new-subtask-input");

    if (subtaskInputBoard.value) {
        addOrCloseSubtaskBoard();
    } else {
        resetSubtaskIconBoard();
    }
}

/**
 * Generates HTML markup for a subtask list item in the board.
 *
 * This function generates the HTML structure for a single subtask in the list, including the subtask text,
 * an edit icon, and a delete icon. The function also assigns unique IDs to each element to manage the subtasks
 * efficiently by index.
 *
 * @param {number} i - The index of the subtask in the list.
 * @param {string} subtask - The text content of the subtask to be displayed.
 *
 * @returns {string} - The HTML string representing the subtask list item.
 */
function templateSubtasksListHTMLBoard(i, subtask) {
    return /*html*/ `
            <div class="generatedSubtasks" id="board-generated-subtask-container-${i}">
                <li id="generated-subtask-list-item-${i}" class="subtaskListItemStyle">${subtask}</li>
                <div id="generated-subtask-list-icons">
                    <div id="board-icon-container" onclick="editSubtaskBoard(${i})"><img src="/img/addTask/edit.png" alt="edit" /></div>
                    <div class="border-subtask-container"></div>
                    <div id="board-delete-icon-container" onclick="deleteSubtaskBoard(${i})">
                        <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                    </div>
                </div>
            </div>`;
}

/**
 * Edits a subtask in the board by replacing the subtask's text with an editable input field.
 *
 * This function is triggered when a user wants to edit a specific subtask. It updates the subtask container's
 * HTML to allow editing, replaces the current subtask text with an input field pre-filled with the current subtask
 * text, and sets up functionality to save the changes when the user presses the Enter key.
 *
 * @param {number} index - The index of the subtask to be edited in the `subtasks` array.
 */
function editSubtaskBoard(index) {
    let toEditSubtask = document.getElementById(`board-generated-subtask-container-${index}`);
    let currentSubtaskText = subtasks[index].subtask;

    toEditSubtask.classList.add("noHoverEffect");

    toEditSubtask.innerHTML = templateEditSubtasksHTMLBoard(currentSubtaskText, index);

    setupEditSubtaskByEnterKeyBoard(index);
}

/**
 * Generates the HTML structure for editing a subtask in the task board.
 *
 * This function returns the HTML structure required to replace the current subtask's display with an editable
 * input field. It also includes icons for deleting or confirming the edited subtask.
 *
 * @param {string} currentSubtaskText - The current text of the subtask to be edited.
 * @param {number} index - The index of the subtask in the `subtasks` array.
 *
 * @returns {string} The HTML string that represents the editable subtask view.
 */
function templateEditSubtasksHTMLBoard(currentSubtaskText, index) {
    return /*html*/ `
        <div id="edit-subtask-container">
            <input type="text" id="board-edit-subtask-input-${index}" value="${currentSubtaskText}" class="edit-subtask-container-styling">            
            <div id="generated-subtask-list-icons" class="showSubtaskIconsWhileEditing">
                <div id="board-delete-icon-container" onclick="deleteSubtaskBoard(${index})">
                    <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                </div>     
                <div class="border-subtask-container"></div>
                <div id="board-edit-icon-container" onclick="submitSubtaskBoard(${index})">
                    <img src="/img/addTask/check.png" alt="check" id="check-subtask">
                </div>
            </div>
        </div>`;
}

/**
 * Deletes a subtask from the board and updates the subtasks list.
 *
 * This function removes the HTML element representing the subtask at the given index and updates the
 * `subtasks` array by removing the corresponding subtask. It then triggers the update function to
 * reflect the changes in the task board.
 *
 * @param {number} index - The index of the subtask to be deleted from the `subtasks` array.
 */
function deleteSubtaskBoard(index) {
    let newSubtask = document.getElementById(`board-generated-subtask-container-${index}`);
    if (newSubtask) {
        newSubtask.remove();
    }
    subtasks.splice(index, 1);
    updateSubtaskListAfterDeleteBoard();
}

/**
 * Submits the edited subtask and updates the subtask list.
 *
 * This function captures the new subtask text from the input field, validates that it is not empty,
 * and updates the corresponding subtask in the `subtasks` array. After updating, it triggers a function
 * to refresh the displayed list of subtasks.
 *
 * @param {number} index - The index of the subtask to be edited in the `subtasks` array.
 */
function submitSubtaskBoard(index) {
    let editedSubtaskInput = document.getElementById(`board-edit-subtask-input-${index}`).value;

    if (editedSubtaskInput === "") {
        return;
    } else {
        subtasks[index].subtask = editedSubtaskInput;
        updateSubtaskListAfterDeleteBoard();
    }
}

/**
 * Adds a new subtask when the Enter key is pressed.
 *
 * This function listens for the "Enter" key event. When pressed, it prevents the default behavior
 * (which might be form submission or other actions) and calls the `addSubtaskFromBoard` function
 * to add the new subtask.
 *
 * @param {KeyboardEvent} event - The event object associated with the key press.
 */
function addSubtaskByEnterKeyBoard(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtaskFromBoard();
    }
}

/**
 * Sets up an event listener for the Enter key press to save the edited subtask.
 *
 * This function adds a "keydown" event listener to the input field where a subtask is being edited.
 * When the Enter key is pressed, it prevents the default behavior (e.g., form submission) and calls
 * the `addEditedSubtaskByEnterKeyBoard` function to handle saving the edited subtask.
 *
 * @param {number} index - The index of the subtask being edited in the `subtasks` array.
 */
function setupEditSubtaskByEnterKeyBoard(index) {
    let editSubtaskInput = document.getElementById(`board-edit-subtask-input-${index}`);
    editSubtaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEditedSubtaskByEnterKeyBoard(index, event);
        }
    });
}

/**
 * Handles the submission of an edited subtask when the Enter key is pressed.
 *
 * This function is triggered when the Enter key is pressed while editing a subtask.
 * It prevents the default behavior and calls the `submitSubtaskBoard` function
 * to save the changes to the subtask.
 *
 * @param {number} index - The index of the subtask being edited in the `subtasks` array.
 * @param {KeyboardEvent} event - The keyboard event triggered by pressing the Enter key.
 */
function addEditedSubtaskByEnterKeyBoard(index, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtaskBoard(index);
    }
}

/**
 * Updates the displayed list of subtasks after a subtask is deleted.
 *
 * This function clears the current list of subtasks from the DOM and then
 * re-renders all remaining subtasks in the `subtasks` array. It uses the
 * `templateSubtasksListHTMLBoard` function to generate the HTML for each subtask
 * and appends it to the `board-generated-subtask-list-container`.
 */
function updateSubtaskListAfterDeleteBoard() {
    let subtaskList = document.getElementById("board-generated-subtask-list-container");

    subtaskList.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskHTML = templateSubtasksListHTMLBoard(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;
    }
}
