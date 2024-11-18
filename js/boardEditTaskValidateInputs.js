/**
 * Validates all input fields during task editing. It checks whether the task title and date are properly entered.
 * If any of the fields are invalid, it sets `isValid` to `false` and returns this value.
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
