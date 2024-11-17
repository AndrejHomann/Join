/**
 * Clears the input fields and resets all related elements on the task board.
 *
 * This function:
 * - Clears input fields on the board using `clearInputFieldsBoard`.
 * - Resets the arrays used for storing task data via `setBackArrays`.
 * - Resets placeholder text for the category and assigned contacts dropdowns.
 * - Clears the container for selected contacts' circle icons.
 * - Resets the task priority button to its default state.
 * - Closes the contacts dropdown and resets the subtask list.
 * - Resets any required notification messages and subtask-related icons.
 *
 * @returns {void}
 */
function clearFieldsBoard() {
    clearInputFieldsBoard();
    setBackArrays();

    document.getElementById("board-category-placeholder").innerHTML = "Select task category";
    document.getElementById("board-assigned-placeholder").innerHTML = "Select contacts to assign";
    document.getElementById("board-selected-contacts-circle-container").innerHTML = "";

    resetPrioBoard();
    document.getElementById("board-prio-medium-button").classList.add("prio-medium-button-bg-color");
    document.getElementById("board-prio-medium-button").classList.remove("prio-default-text-color");
    closeContactsDropDownBoard();
    resetSubtaskListBoard();
    resetRequiredNotificationsBoard();
    resetSubtaskIconBoard();
    resetSubtaskRequiredNotificationBoard();
}

/**
 * Resets the required notification messages on the task board.
 *
 * This function:
 * - Resets the date, title, and category required notifications by calling their respective reset functions.
 *
 * @returns {void}
 */
function resetRequiredNotificationsBoard() {
    resetDateRequiredNotificationBoard();
    resetTitleRequiredNotificationBoard();
    resetCategoryRequiredNotificationBoard();
}

/**
 * Resets the required notification for the date input field on the task board.
 *
 * This function:
 * - Hides the missing date message by setting its display style to "none".
 * - Resets the border style of the date input field to its default state.
 *
 * @returns {void}
 */
function resetDateRequiredNotificationBoard() {
    let missingDateMessage = document.getElementById("board-missing-date-message");
    missingDateMessage.style.display = "none";
    document.getElementById("board-date-input").style.border = "";
}

/**
 * Resets the required notification for the title input field on the task board.
 *
 * This function:
 * - Resets the border style of the title input field to its default state.
 * - Hides the missing title message by setting its display style to "none".
 *
 * @returns {void}
 */
function resetTitleRequiredNotificationBoard() {
    let missingTitleMessage = document.getElementById("board-missing-title-message");
    let titleInput = document.getElementById("board-title-input");
    titleInput.style.border = "";
    missingTitleMessage.style.display = "none";
}

/**
 * Resets the required notification for the category input field on the task board.
 *
 * This function:
 * - Resets the border style of the category input field to its default state.
 * - Hides the missing category message by setting its display style to "none".
 *
 * @returns {void}
 */
function resetCategoryRequiredNotificationBoard() {
    let missingCategoryMessage = document.getElementById("board-missing-category-message");
    let categoryInput = document.getElementById("board-selected-category");
    categoryInput.style.border = "";

    missingCategoryMessage.style.display = "none";
}

/**
 * Resets the required notification for the subtask input field on the task board.
 *
 * This function:
 * - Hides the missing subtask message by setting its display style to "none".
 * - Resets the border style of the subtask input container to its default state.
 *
 * @returns {void}
 */
function resetSubtaskRequiredNotificationBoard() {
    let missingSubtaskMessage = document.getElementById("board-missing-subtask-message");
    missingSubtaskMessage.style.display = "none";
    document.getElementById("board-new-subtask-container").style.border = "";
}

/**
 * Clears the input fields on the task board.
 *
 * This function resets the following fields to their empty state:
 * - The title input field (`board-title-input`).
 * - The description textarea input field (`board-textarea-input`).
 * - The date input field (`board-date-input`).
 * - The new subtask input field (`board-new-subtask-input`).
 *
 * @returns {void}
 */
function clearInputFieldsBoard() {
    document.getElementById("board-title-input").value = "";
    document.getElementById("board-textarea-input").value = "";
    document.getElementById("board-date-input").value = "";
    document.getElementById("board-new-subtask-input").value = "";
}

/**
 * Resets the subtask list displayed on the task board.
 *
 * This function clears the content of the container that holds the generated subtasks.
 * It effectively removes any existing subtasks from the view by setting the container's innerHTML to an empty string.
 */
function resetSubtaskListBoard() {
    document.getElementById("board-generated-subtask-list-container").innerHTML = "";
}
