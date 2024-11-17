/**
 * Validates all input fields on the task board.
 *
 * This function checks if the following fields are valid:
 * - The title input field.
 * - The date input field.
 * - The category input field.
 *
 * If any of the fields are invalid, the function sets the `isValid` flag to `false`.
 *
 * @returns {boolean} Returns `true` if all input fields are valid, otherwise `false`.
 */
function validateAllInputsBoard() {
    let isValid = true;

    if (!checkIfTitleIsEnteredBoard()) {
        isValid = false;
    }

    if (!checkIfDateIsSelectedBoard()) {
        isValid = false;
    }

    if (!checkIfCategoryIsSelectedBoard()) {
        isValid = false;
    }

    return isValid;
}

/**
 * Checks if the title input field on the task board has been entered.
 *
 * This function verifies whether the title input field contains a value. If the value is present:
 * - Hides the "missing title" message.
 * - Keeps the input border in its default state.
 *
 * If the title input is empty:
 * - Displays the "missing title" message.
 * - Changes the input border to indicate an error.
 *
 * @returns {boolean} Returns `true` if the title input has a value, otherwise `false`.
 */
function checkIfTitleIsEnteredBoard() {
    let missingTitleMessage = document.getElementById("board-missing-title-message");
    let titleInput = document.getElementById("board-title-input");

    let isValid = true;

    if (titleInput.value) {
        missingTitleMessage.style.display = "none";
        isValid = true;
    } else {
        titleInput.style.border = "1px solid #ff8190";
        missingTitleMessage.style.display = "flex";
        isValid = false;
    }
    return isValid;
}

/**
 * Checks if a date has been selected in the task board's date input field.
 *
 * This function verifies whether the date input field contains a value. If the value is present:
 * - Hides the "missing date" message.
 * - Keeps the input border in its default state.
 *
 * If the date input is empty:
 * - Displays the "missing date" message.
 * - Changes the input border to indicate an error.
 *
 * @returns {boolean} Returns `true` if a date is selected, otherwise `false`.
 */
function checkIfDateIsSelectedBoard() {
    let missingDateMessage = document.getElementById("board-missing-date-message");
    let dateInput = document.getElementById("board-date-input");

    let isValid = true;

    if (dateInput.value) {
        missingDateMessage.style.display = "none";
        isValid = true;
    } else {
        missingDateMessage.style.display = "flex";
        dateInput.style.border = "1px solid #ff8190";
        isValid = false;
    }
    return isValid;
}

/**
 * Checks if a category has been selected in the task board's category input field.
 *
 * This function verifies whether a category is selected. If a category is selected:
 * - Hides the "missing category" message.
 * - Sets the category input border to indicate valid selection.
 *
 * If no category is selected:
 * - Displays the "missing category" message.
 * - Changes the category input border to indicate an error.
 *
 * @returns {boolean} Returns `true` if a category is selected, otherwise `false`.
 */
function checkIfCategoryIsSelectedBoard() {
    let missingCategoryMessage = document.getElementById("board-missing-category-message");
    let categoryInput = document.getElementById("board-selected-category");

    let isValid = true;

    if (selectedCategory) {
        missingCategoryMessage.style.display = "none";
        categoryInput.style.border = "1px solid #90d1ed";

        isValid = true;
    } else {
        missingCategoryMessage.style.display = "flex";
        categoryInput.style.border = "1px solid #ff8190";
        isValid = false;
    }
    return isValid;
}

/**
 * Checks for changes in the task inputs on the task board.
 *
 * This function validates the following task fields:
 * - Task title
 * - Task description
 * - Task date
 * - Task subtasks
 *
 * It calls respective check functions for each of these fields to ensure they meet the necessary criteria.
 */
function checkAddTaskChangesInBoard() {
    checkTaskTitleBoard();
    checkTaskDescriptionBoard();
    checkTaskDateBoard();
    checkTaskSubtaskBoard();
}

/**
 * Validates the task title input on the task board.
 *
 * This function sets up event listeners to validate the task title in the input field with ID `board-title-input`.
 * It checks the following:
 * - When the input is clicked inside, it applies a border color and shows a missing title message if needed.
 * - When the input is clicked outside, it updates the border color and hides the missing title message if the input is valid.
 * - When a keystroke occurs inside the input, it ensures the input is valid and updates the UI accordingly.
 *
 * The function uses `setTimeout` to allow the DOM to load before adding the event listeners.
 */
function checkTaskTitleBoard() {
    setTimeout(() => {
        const input = document.getElementById("board-title-input");
        const message = document.getElementById("board-missing-title-message");
        checkTaskOnClickInsideElementBoard(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElementBoard(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElementBoard(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

/**
 * Validates the task description input on the task board.
 *
 * This function sets up event listeners to validate the task description in the input field with ID `board-textarea-input`.
 * It checks the following:
 * - When the input is clicked inside, it applies a border color.
 * - When the input is clicked outside, it resets the border color to its default state.
 * - When a keystroke occurs inside the input, it updates the UI to reflect the validity of the input, ensuring the border color changes accordingly.
 *
 * The function uses `setTimeout` to allow the DOM to load before adding the event listeners.
 */
function checkTaskDescriptionBoard() {
    setTimeout(() => {
        const input = document.getElementById("board-textarea-input");
        checkTaskOnClickInsideElementBoard(input, "", "#90d1ed", "#90d1ed");
        checkTaskOnClickOutsideElementBoard(input, "", "#d1d1d1", "#d1d1d1");
        checkTaskOnKeystrokeInsideElementBoardDescription(input, "#90d1ed");
    }, 100);
}

/**
 * Validates the task date input on the task board.
 *
 * This function sets up event listeners to validate the task date in the input field with ID `board-date-input`.
 * It checks the following:
 * - When the input is clicked inside, it applies a border color and displays an error message if the input is empty.
 * - When the input is clicked outside, it resets the border color and hides the error message if the input is valid.
 * - When a keystroke occurs inside the input, it updates the UI to reflect the validity of the input.
 *
 * The function uses `setTimeout` to allow the DOM to load before adding the event listeners.
 */
function checkTaskDateBoard() {
    setTimeout(() => {
        const input = document.getElementById("board-date-input");
        const message = document.getElementById("board-missing-date-message");
        checkTaskOnClickInsideElementBoard(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElementBoard(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElementBoard(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

/**
 * Handles the click event inside the specified input element on the task board.
 *
 * This function adds an event listener to the input element that triggers when the user clicks inside the input field.
 * It checks whether the input field is empty and applies the appropriate border color and error message visibility.
 *
 * If the input is empty:
 * - The border color is set to `bordercolor1`.
 * - The error message (if provided) is displayed.
 *
 * If the input is not empty:
 * - The border color is set to `bordercolor2`.
 * - The error message (if provided) is hidden.
 *
 * @param {HTMLElement} input - The input element to validate.
 * @param {HTMLElement} message - The error message element to display when validation fails.
 * @param {string} bordercolor1 - The border color when the input is empty.
 * @param {string} bordercolor2 - The border color when the input is not empty.
 */
function checkTaskOnClickInsideElementBoard(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("click", () => {
        if (input.value.trim === "") {
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
 * Handles the blur event when the input element loses focus on the task board.
 *
 * This function adds an event listener to the input element that triggers when the user clicks outside the input field (blur event).
 * It checks whether the input field is empty and applies the appropriate border color and error message visibility.
 *
 * If the input is empty:
 * - The border color is set to `bordercolor1`.
 * - The error message (if provided) is displayed.
 *
 * If the input is not empty:
 * - The border color is set to `bordercolor2`.
 * - The error message (if provided) is hidden.
 *
 * @param {HTMLElement} input - The input element to validate.
 * @param {HTMLElement} message - The error message element to display when validation fails.
 * @param {string} bordercolor1 - The border color when the input is empty.
 * @param {string} bordercolor2 - The border color when the input is not empty.
 */
function checkTaskOnClickOutsideElementBoard(input, message, bordercolor1, bordercolor2) {
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
 * Handles the input event to validate the input element on keystroke in the task board.
 *
 * This function adds an event listener to the input element that triggers when the user types into the input field (input event).
 * It checks whether the input field is empty and applies the appropriate border color and error message visibility.
 *
 * If the input is empty:
 * - The border color is set to `bordercolor1`.
 * - The error message (if provided) is displayed.
 *
 * If the input is not empty:
 * - The border color is set to `bordercolor2`.
 * - The error message (if provided) is hidden.
 *
 * @param {HTMLElement} input - The input element to validate.
 * @param {HTMLElement} message - The error message element to display when validation fails.
 * @param {string} bordercolor1 - The border color when the input is empty.
 * @param {string} bordercolor2 - The border color when the input is not empty.
 */
function checkTaskOnKeystrokeInsideElementBoard(input, message, bordercolor1, bordercolor2) {
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
 * Handles the input event to validate the input element on keystroke in the task description field on the board.
 *
 * This function adds an event listener to the input element that triggers when the user types into the input field (input event).
 * It applies the specified border color to the input element as the user types.
 *
 * @param {HTMLElement} input - The input element (task description field) to validate.
 * @param {string} bordercolor - The border color to apply while the user is typing.
 */
function checkTaskOnKeystrokeInsideElementBoardDescription(input, bordercolor) {
    input.addEventListener("input", () => {
        input.style = `border: 1px solid ${bordercolor1};`;
    });
}

/**
 * Initializes event listeners for the subtask input fields on the board, including click and input actions.
 *
 * This function waits for the DOM to load and ensures that the subtask container and input elements are available.
 * It then calls helper functions to manage the subtask input's behavior when focused or clicked outside.
 *
 * @returns {void}
 */
function checkTaskSubtaskBoard() {
    setTimeout(() => {
        const input1 = document.getElementById("board-new-subtask-container");
        const input2 = document.getElementById("board-new-subtask-input");

        if (input1 && input2) {
            checkTaskOnClickInsideSubtaskElementBoard(input1, input2, "#90d1ed");
            checkTaskOnClickOutsideSubtaskElementBoard(input1, input2, "#d1d1d1");
        }
    }, 100);
}

/**
 * Adds event listeners for when the subtask input is focused or updated inside the task board.
 *
 * This function is responsible for changing the border color of the subtask container when the input field gains focus
 * or when the user starts typing. Additionally, it hides the "missing subtask" message once the user enters text in the input field.
 *
 * @param {HTMLElement} input1 - The element representing the container of the subtask input field.
 * @param {HTMLElement} input2 - The subtask input field element.
 * @param {string} bordercolor - The border color to apply when the input is focused or updated.
 *
 * @returns {void}
 */
function checkTaskOnClickInsideSubtaskElementBoard(input1, input2, bordercolor) {
    input2.addEventListener("focus", () => {
        input1.style.border = `1px solid ${bordercolor}`;
    });

    input2.addEventListener("input", () => {
        if (input2.value.trim() !== "") {
            input1.style.border = `1px solid ${bordercolor}`;
            const missingSubtaskMessage = document.getElementById("board-missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}

/**
 * Adds an event listener to detect when a click occurs outside the subtask container or input field.
 *
 * This function is responsible for resetting the border color of the subtask container to the given color when a click
 * happens outside the subtask input elements. It also resets the subtask icon and hides the "missing subtask" message
 * if the click was outside the input container.
 *
 * @param {HTMLElement} input1 - The element representing the container of the subtask input field.
 * @param {HTMLElement} input2 - The subtask input field element.
 * @param {string} bordercolor - The border color to apply when the click happens outside the input elements.
 *
 * @returns {void}
 */
function checkTaskOnClickOutsideSubtaskElementBoard(input1, input2, bordercolor) {
    document.addEventListener("click", (event) => {
        if (!input1.contains(event.target) && !input2.contains(event.target)) {
            input1.style.border = `1px solid ${bordercolor}`;
            resetSubtaskIconBoard();
            const missingSubtaskMessage = document.getElementById("board-missing-subtask-message");
            if (missingSubtaskMessage) {
                missingSubtaskMessage.style.display = "none";
            }
        }
    });
}
