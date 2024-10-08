function validateAllInputs() {
    if (!selectedCategory || !document.getElementById("title-input").value || !document.getElementById("date-input").value) {
        checkIfTitleIsEntered();
        checkIfDateIsSelected();
        checkIfCategoryIsSelected();
        return false;
    }
    return true;
}

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

function clearInputFields() {
    document.getElementById("title-input").value = "";
    document.getElementById("textarea-input").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("new-subtask-input").value = "";
}

function setBackArrays() {
    selectedContacts = [];
    selectedColors = [];
    selectedCategory = null;
    subtasks = [];
    selectedPrio = "medium";
}

function checkIfRequiredFieldsAreEnteredAgain() {
    checkIfTitleIsEntered();
    checkIfDateIsSelected();
    checkIfCategoryIsSelected();
}

function checkIfTitleIsEntered() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");

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

function checkIfDateIsSelected() {
    let missingDateMessage = document.getElementById("missing-date-message");
    let dateInput = document.getElementById("date-input");

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

function checkIfCategoryIsSelected() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    if (!selectedCategory) {
        addCategoryRequiredNotification(categoryOptions, missingCategoryMessage);
    } else {
        resetCategoryRequiredNotification();
    }
}

function addCategoryRequiredNotification(categoryOptions, missingCategoryMessage) {
    categoryOptions.classList.add("validationBorder");
    missingCategoryMessage.classList.add("validationStyle");
    missingCategoryMessage.style.removeProperty("display");
}

function resetRequiredNotifications() {
    resetDateRequiredNotification();
    resetSubtaskRequiredNotification();
    resetTitleRequiredNotification();
    resetCategoryRequiredNotification();
}

function resetDateRequiredNotification() {
    let missingDateMessage = document.getElementById("missing-date-message");
    missingDateMessage.classList.add("d-none");
    missingDateMessage.classList.remove("validationStyle");
    document.getElementById("date-input").style.border = "";
}

function resetTitleRequiredNotification() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");
    titleInput.style.border = "";
    missingTitleMessage.classList.remove("validationStyle");
    missingTitleMessage.classList.add("d-none");
}

function resetCategoryRequiredNotification() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    categoryOptions.classList.remove("validationBorder");
    missingCategoryMessage.classList.remove("validationStyle");
    missingCategoryMessage.classList.add("d-none");
}
