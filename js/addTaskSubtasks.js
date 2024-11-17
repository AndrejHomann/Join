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

/**
 * Updates the subtask action icon dynamically based on user input in the subtask input field.
 *
 * This function checks whether the `new-subtask-input` field contains a value:
 * - If the field has content, it triggers the `addOrCloseSubtask` function to handle adding or closing the subtask.
 * - If the field is empty, it resets the subtask icon to its default state by calling `resetSubtaskIcon`.
 */
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

/**
 * Adds an event listener to handle "Enter" key presses in the subtask input field.
 *
 * This function waits for the DOM content to load and checks for the presence of the
 * `new-subtask-input` field. If the field exists, it listens for `keydown` events.
 * - If the "Enter" key is pressed, the default behavior is prevented, and the `addSubtask`
 *   function is called to handle the addition of a new subtask.
 */
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
