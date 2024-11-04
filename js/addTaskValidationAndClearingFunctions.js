/**
 *
 * Validates that all required inputs (category, title, and date) are entered.
 * If any required field is missing, corresponding validation checks are triggered.
 *
 * @returns {boolean} Returns false if any required input is missing; otherwise, true.
 */

let isCategoryAvailable = true;

// function validateAllInputs() {
//     let titleInput;
//     let dateInput;

//     if (document.getElementById("title-input") && document.getElementById("date-input")) {
//         titleInput = document.getElementById("title-input").value;
//         dateInput = document.getElementById("date-input").value;
//     } else {
//         titleInput = document.getElementById("edit-title-input").value;
//         dateInput = document.getElementById("edit-date-input").value;
//     }

//     let isValid = true;

//     if (!selectedCategory || !titleInput || !dateInput) {
//         checkIfTitleIsEntered();
//         checkIfDateIsSelected();
//         if (isCategoryAvailable === true) {
//             checkIfCategoryIsSelected();
//         }
//         isValid = false;
//     }
//     return isValid;
// }
function validateAllInputs() {
    let titleInput;
    let dateInput;

    // Überprüfen, ob wir die normalen oder die Edit-Input-Felder verwenden
    if (document.getElementById("title-input") && document.getElementById("date-input")) {
        titleInput = document.getElementById("title-input").value;
        dateInput = document.getElementById("date-input").value;
    } else {
        titleInput = document.getElementById("edit-title-input").value;
        dateInput = document.getElementById("edit-date-input").value;
    }

    let isValid = true;

    // Überprüfen, ob der Titel eingegeben wurde
    if (!titleInput) {
        checkIfTitleIsEntered();
        isValid = false;
    }

    // Überprüfen, ob ein Datum ausgewählt wurde
    if (!dateInput) {
        checkIfDateIsSelected();
        isValid = false;
    }

    // Überprüfen, ob eine Kategorie ausgewählt wurde, falls erforderlich
    if (!selectedCategory && isCategoryAvailable) {
        checkIfCategoryIsSelected();
        isValid = false;
    }

    return isValid;
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
 * Re-checks if the required fields (title, date, category) are filled after they have been previously marked as incomplete.
 */
function checkIfRequiredFieldsAreEnteredAgain() {
    checkIfTitleIsEntered();
    checkIfDateIsSelected();
    checkIfCategoryIsSelected();
}

/**
 * Checks if the title input field is filled.
 * If not, adds a validation message and border style; otherwise, removes validation styles.
 */
function checkIfTitleIsEntered() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");

    if (document.getElementById("edit-title-input")) {
        titleInput = document.getElementById("edit-title-input");
    }

    if (!titleInput.value) {
        titleInput.style.border = "1px solid #ff8190";
        missingTitleMessage.classList.add("validationStyle");
        missingTitleMessage.style.removeProperty("display");
    } else {
        titleInput.style.border = "";
        missingTitleMessage.classList.remove("validationStyle");
        missingTitleMessage.style.display = "none";
        addBorderStyleToValueContainer(titleInput, "#90D1ED");
    }
}

/**
 * Checks if a date is selected in the date input field.
 * If no date is selected, adds a validation message and border style; otherwise, removes validation styles.
 */
// function checkIfDateIsSelected() {
//     let missingDateMessage = document.getElementById("missing-date-message");
//     let dateInput = document.getElementById("date-input");

//     if (!dateInput.value) {
//         dateInput.style.border = "1px solid #ff8190";
//         missingDateMessage.classList.add("validationStyle");
//         missingDateMessage.style.removeProperty("display");
//     } else {
//         dateInput.style.border = "";
//         missingDateMessage.classList.remove("validationStyle");
//         missingDateMessage.style.display = "none";
//     }
// }
function checkIfDateIsSelected() {
    let missingDateMessage = document.getElementById("missing-date-message");
    let dateInput = document.getElementById("date-input");

    if (document.getElementById("edit-date-input")) {
        dateInput = document.getElementById("edit-date-input");
    }

    if (!dateInput.value) {
        dateInput.style.border = "1px solid #ff8190";
        missingDateMessage.classList.add("validationStyle");
        missingDateMessage.style.removeProperty("display");
    } else {
        dateInput.style.border = "";
        missingDateMessage.classList.remove("validationStyle");
        missingDateMessage.style.display = "none";
    }
}

/**
 * Checks if a category is selected in the category dropdown.
 * If no category is selected, adds a validation message and styles; otherwise, removes validation styles.
 */
function checkIfCategoryIsSelected() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    if (!selectedCategory) {
        addCategoryRequiredNotification(categoryOptions, missingCategoryMessage);
    } else {
        resetCategoryRequiredNotification();
    }
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
 * Resets all required field validation messages (title, date, category, subtasks).
 */
function resetRequiredNotifications() {
    resetDateRequiredNotification();
    resetSubtaskRequiredNotification();
    resetTitleRequiredNotification();
    resetCategoryRequiredNotification();
}

/**
 * Resets the validation message and border for the date input field.
 */
function resetDateRequiredNotification() {
    let missingDateMessage = document.getElementById("missing-date-message");
    missingDateMessage.classList.add("d-none");
    missingDateMessage.classList.remove("validationStyle");
    document.getElementById("date-input").style.border = "";
}

/**
 * Resets the validation message and border for the title input field.
 */
function resetTitleRequiredNotification() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");
    titleInput.style.border = "";
    missingTitleMessage.classList.remove("validationStyle");
    missingTitleMessage.classList.add("d-none");
}

/**
 * Resets the validation message and border for the category dropdown.
 */
function resetCategoryRequiredNotification() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    categoryOptions.classList.remove("validationBorder");
    missingCategoryMessage.classList.remove("validationStyle");
    missingCategoryMessage.classList.add("d-none");
}
