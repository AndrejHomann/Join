/**
 *
 * Validates that all required inputs (category, title, and date) are entered.
 * If any required field is missing, corresponding validation checks are triggered.
 *
 * @returns {boolean} Returns false if any required input is missing; otherwise, true.
 */
let isCategoryAvailable = true;

function validateAllInputs() {
    let isValid = true;

    if (!checkIfTitleIsEntered()) {
        isValid = false;
    }

    if (!checkIfDateIsSelected()) {
        isValid = false;
    }

    if (!checkIfCategoryIsSelected()) {
        isValid = false;
    }
    return isValid;
}

/**
 * Checks if the title input field is filled.
 * If not, adds a validation message and border style; otherwise, removes validation styles.
 */
function checkIfTitleIsEntered() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");

    let isValid = true;

    if (!titleInput.value) {
        titleInput.style.border = "1px solid #ff8190";
        // missingTitleMessage.classList.add("validationStyle");
        missingTitleMessage.style.removeProperty("display");
        isValid = false;
    } else {
        titleInput.style.border = "";
        // missingTitleMessage.classList.remove("validationStyle");
        missingTitleMessage.style.display = "none";
        addBorderStyleToValueContainer(titleInput, "#90D1ED");
        return isValid;
    }
}

/**
 * Checks if a date is selected in the date input field.
 * If no date is selected, adds a validation message and border style; otherwise, removes validation styles.
 */
function checkIfDateIsSelected() {
    let missingDateMessage = document.getElementById("missing-date-message");
    let dateInput = document.getElementById("date-input");

    let isValid = true;

    if (!dateInput.value) {
        dateInput.style.border = "1px solid #ff8190";
        // missingDateMessage.classList.add("validationStyle");
        missingDateMessage.style.removeProperty("display");
        isValid = false;
    } else {
        dateInput.style.border = "";
        // missingDateMessage.classList.remove("validationStyle");
        missingDateMessage.style.display = "none";
        return isValid;
    }
}

/**
 * Checks if a category is selected in the category dropdown.
 * If no category is selected, adds a validation message and styles; otherwise, removes validation styles.
 */
function checkIfCategoryIsSelected() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryInput = document.getElementById("selected-category");

    let isValid = true;

    if (!selectedCategory) {
        missingCategoryMessage.style.display = "flex";
        categoryInput.style.border = "1px solid #ff8190";
        // addCategoryRequiredNotification(categoryOptions, missingCategoryMessage);
        // missingCategoryMessage.style.display = "none";
        isValid = false;
    } else {
        // missingCategoryMessage.style.display = "flex";
        // categoryInput.style.border = "1px solid #ff8190";
        resetCategoryRequiredNotification();
        missingCategoryMessage.style.display = "none";

        return isValid;
    }
}

/**
 * Re-checks if the required fields (title, date, category) are filled after they have been previously marked as incomplete.
 */
function checkIfRequiredFieldsAreEnteredAgain() {
    checkIfTitleIsEntered();
    checkIfDateIsSelected();
    checkIfCategoryIsSelected();
}

/**
 * Adds a validation border and message for the category dropdown when no category is selected.
 *
 * @param {HTMLElement} categoryOptions - The container for the selected category.
 * @param {HTMLElement} missingCategoryMessage - The element displaying the validation message for the missing category.
 */
function addCategoryRequiredNotification(categoryOptions, missingCategoryMessage) {
    categoryOptions.classList.add("validationBorder");
    missingCategoryMessage.classList.add("validationStyle");
    missingCategoryMessage.style.removeProperty("display");
}

/**
 * Clears all input fields and resets the task creation form to its default state.
 * This includes resetting dropdowns, clearing assigned contacts, priority, and removing any validation messages.
 */
function clearFields() {
    clearInputFields();
    setBackArrays();
    resetSubtaskIcon();
    resetSubtaskList();

    document.getElementById("category-placeholder").innerHTML = "Select task category";
    document.getElementById("assigned-placeholder").innerHTML = "Select contacts to assign";
    document.getElementById("selected-contacts-circle-container").innerHTML = "";

    resetPrio();
    document.getElementById("prio-medium-button").classList.add("prio-medium-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-default-text-color");
    closeContactsDropDown();
    closeCategoryDropDown();

    resetRequiredNotifications();
    removeBorderStyleFromDescriptionContainerAndCategoryContainer();
}

/**
 * Clears the values of the input fields for title, description, date, and subtasks.
 */
function clearInputFields() {
    document.getElementById("title-input").value = "";
    document.getElementById("textarea-input").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("new-subtask-input").value = "";
}

/**
 * Resets the internal arrays used for managing selected contacts, colors, categories, subtasks, and priority.
 */
function setBackArrays() {
    selectedContacts = [];
    selectedColors = [];
    selectedCategory = null;
    subtasks = [];
    selectedPrio = "medium";
}

/**
 * Resets all required field validation messages (title, date, category, subtasks).
 */
function resetRequiredNotifications() {
    resetDateRequiredNotification();
    resetTitleRequiredNotification();
    resetCategoryRequiredNotification();
    // resetSubtaskRequiredNotification();
}

/**
 * Resets the validation message and border for the date input field.
 */
function resetDateRequiredNotification() {
    let missingDateMessage = document.getElementById("missing-date-message");
    // missingDateMessage.classList.add("d-none");
    missingDateMessage.style.display = "none";
    document.getElementById("date-input").style.border = "";
}

/**
 * Resets the validation message and border for the title input field.
 */
function resetTitleRequiredNotification() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");
    titleInput.style.border = "";
    missingTitleMessage.style.display = "none";
}

/**
 * Resets the validation message and border for the category dropdown.
 */
function resetCategoryRequiredNotification() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    categoryOptions.style.border = "";
    missingCategoryMessage.style.display = "none";
}
