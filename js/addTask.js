let BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app";
let contactList = [];
let selectedPrio = "medium";
let categoryList = ["Technical Task", "User Story"];
let selectedCategory = null;
let selectedContact = null;
let selectedContacts = [];
let colors = [];
let selectedColors = [];
let subtasks = [];
let isSubtaskResetting = false;

async function includeHTML() {
    let includeElements = document.querySelectorAll("[includeHTML]");
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("includeHTML");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

// adding tasks

function createTask() {
    if (!validateAllInputs()) {
        return;
    }

    let task = {
        name: selectedContacts,
        priority: selectedPrio,
        category: selectedCategory,
        color: selectedColors,
        addedSubtasks: subtasks,
        title: document.getElementById("title-input").value,
        taskDescription: document.getElementById("textarea-input").value,
        date: document.getElementById("date-input").value,
        status: "todo",
    };
    addTask("/tasks.json", task);
    removeBorderStyleFromDescriptionContainerAndCategoryContainer();
    checkIfRequiredFieldsAreEnteredAgain();
}

async function addTask(path, data) {
    const response = await fetch(BASE_URL + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        let responseToJson = await response.json();
        console.log(responseToJson);
        showSuccessMessage();
    } else {
        console.error("Error");
    }
    clearFields();
}

// contacts

function checkIfContactsDropdownIsVisible() {
    let dropdownList = document.getElementById("dropdown-list");

    if (dropdownList.classList.contains("d-none")) {
        showContactsDropDown();
    } else {
        closeContactsDropDown();
    }
}

// subtasks

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

function closeSubtaskDraft() {
    let newSubtaskContaier = document.getElementById("new-subtask-container");
    removeBorderStyleToValueContainer(newSubtaskContaier);
    let subtaskDraft = document.getElementById("new-subtask-input");
    subtaskDraft.value = ``;
    resetSubtaskIcon();
}

function addSubtask() {
    let newSubtaskInput = document.getElementById("new-subtask-input");
    let subtaskList = document.getElementById("generated-subtask-list-container");
    let missingSubtaskMessage = document.getElementById("missing-subtask-message");
    let subtaskContainer = document.getElementById("new-subtask-container");
    let i = subtasks.length;

    handleSubtaskValidation(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i);
    resetSubtaskIcon();
}

function handleSubtaskValidation(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i) {
    if (newSubtaskInput.value !== "") {
        subtasks.push(newSubtaskInput.value);

        let subtaskHTML = templateSubtasksListHTML(i, subtasks[i]);
        subtaskList.innerHTML += subtaskHTML;

        newSubtaskInput.value = "";
        subtaskContainer.style.border = "";
        missingSubtaskMessage.classList.remove("validationStyleSubtasks");
        missingSubtaskMessage.style.display = "none";
    } else {
        subtaskContainer.style.border = "1px solid #ff8190";
        missingSubtaskMessage.classList.add("validationStyleSubtasks");
        missingSubtaskMessage.style.removeProperty("display");
    }
}

function addSubtaskByEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask();
    }
}

function showCloseOrDeleteIconDuringWritingSubtask() {
    let subtaskInput = document.getElementById("new-subtask-input");
    let subtaskContainer = document.getElementById("new-subtask-container");

    if (subtaskInput.value) {
        addBorderStyleToValueContainer(subtaskContainer, "#90D1ED");
        addOrCloseSubtask();
    } else {
        removeBorderStyleToValueContainer(subtaskContainer);
        resetSubtaskIcon();
    }
}

function waitingForSubtaskEnterOrDraftEvent() {
    let newSubtaskInput = document.getElementById("new-subtask-input");

    newSubtaskInput.addEventListener("keydown", addSubtaskByEnterKey);
    newSubtaskInput.addEventListener("input", function () {
        resetSubtaskRequiredNotification();
        showCloseOrDeleteIconDuringWritingSubtask();
    });
}

waitingForSubtaskEnterOrDraftEvent();

function resetSubtaskRequiredNotification() {
    let missingSubtaskMessage = document.getElementById("missing-subtask-message");
    missingSubtaskMessage.style.display = "none";
    missingSubtaskMessage.classList.remove("validationStyleSubtasks");
    document.getElementById("new-subtask-container").style.border = "";
}

function resetSubtaskIcon() {
    let subtaskIconContainer = document.getElementById("subtask-icon-container");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="plus-icon-container" class="circleHoverEffect" onclick="addOrCloseSubtask()">
            <img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" />
        </div>`;

    isSubtaskResetting = true;
    setTimeout(resetSubtaskClearButton, 1);
}

function resetSubtaskClearButton() {
    isSubtaskResetting = false;
}

function resetSubtaskList() {
    document.getElementById("generated-subtask-list-container").innerHTML = "";
}

function deleteSubtask(index) {
    let newSubtask = document.getElementById(`added-subtask-${index}`);
    if (newSubtask) {
        newSubtask.remove();
    }
    subtasks.splice(index, 1);
    updateSubtaskListAfterDelete();
}

function updateSubtaskListAfterDelete() {
    let subtaskList = document.getElementById("generated-subtask-list-container");

    subtaskList.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskHTML = templateSubtasksListHTML(i, subtasks[i]);
        subtaskList.innerHTML += subtaskHTML;
    }
}

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

function editSubtask(index) {
    let toEditSubtask = document.getElementById(`generated-subtask-container-${index}`);
    let currentSubtaskText = subtasks[index];

    toEditSubtask.classList.add("noHoverEffect");

    toEditSubtask.innerHTML = templateEditSubtasSubtasksHTML(currentSubtaskText, index);

    setupEditSubtaskInputListener(index);
}

function templateEditSubtasSubtasksHTML(currentSubtaskText, index) {
    return /*html*/ `
        <div id="edit-subtask-container">
            <input type="text" id="edit-subtask-input-${index}" value="${currentSubtaskText}" class="edit-subtask-container-styling">            
            <div id="generated-subtask-list-icons" class="showSubtaskIconsWhileEditing">
                <div id="delete-icon-container" onclick="deleteSubtask(${index})">
                    <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                </div>     
                <div class="border-subtask-container"></div>
                <div id="edit-icon-container" onclick="submitSubtask(${index})">
                    <img src="/img/addTask/check.png" alt="check" id="check-subtask">
                </div>
            </div>
        </div>`;
}

function setupEditSubtaskInputListener(index) {
    let editSubtaskInput = document.getElementById(`edit-subtask-input-${index}`);
    editSubtaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEditedSubtaskByEnterKey(event, index);
        }
    });
}

function addEditedSubtaskByEnterKey(event, index) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtask(index);
    }
}

function submitSubtask(index) {
    let editedSubtaskInput = document.getElementById(`edit-subtask-input-${index}`).value;
    subtasks[index] = editedSubtaskInput;

    updateSubtaskListAfterDelete();
}

// border styling

function addBorderStyleToValueContainer(element, color) {
    element.style.border = `1px solid ${color}`;
}

function removeBorderStyleToValueContainer(element) {
    element.style.border = ``;
}

// date-input

function handleDateInput() {
    let dateInput = document.getElementById("date-input");
    let missingDateMessage = document.getElementById("missing-date-message");

    if (dateInput.value) {
        addBorderStyleToValueContainer(dateInput, "#90D1ED");
        missingDateMessage.style.display = "none";
    } else {
        removeBorderStyleToValueContainer(dateInput);
        checkIfDateIsSelected();
    }
}

let dateInput = document.getElementById("date-input");
dateInput.addEventListener("change", handleDateInput);

// title-input

function handleTitleInput() {
    let titleInput = document.getElementById("title-input");
    let missingTitleMessage = document.getElementById("missing-title-message");

    if (titleInput.value) {
        addBorderStyleToValueContainer(titleInput, "#90D1ED");
        missingTitleMessage.style.display = "none";
    } else {
        removeBorderStyleToValueContainer(titleInput);
        checkIfTitleIsEntered();
    }
}

let titleInput = document.getElementById("title-input");
titleInput.addEventListener("input", handleTitleInput);

// description-input

function handleTextareaInput() {
    let descriptionInput = document.getElementById("textarea-input");

    if (descriptionInput.value) {
        addBorderStyleToValueContainer(descriptionInput, "#90D1ED");
    } else {
        removeBorderStyleFromDescriptionContainer(descriptionInput);
    }
}

function removeBorderStyleFromDescriptionContainer(element) {
    element.style.border = ``;
}

let descriptionInput = document.getElementById("textarea-input");
descriptionInput.addEventListener("input", handleTextareaInput);

function removeBorderStyleFromDescriptionContainerAndCategoryContainer() {
    let descriptionInput = document.getElementById("textarea-input");
    let categoryContainer = document.getElementById("selected-category");

    descriptionInput.style.border = ``;
    categoryContainer.style.border = ``;
}
