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

function createTask() {
    if (!selectedCategory || !document.getElementById("title-input").value || !document.getElementById("date-input").value) {
        checkIfCategoryIsSelected();
        checkIfTitleIsEntered();
        checkIfDateIsSelected();
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

// Contacts

async function fetchContacts() {
    let response = await fetch(BASE_URL + "/contacts.json");
    let contactsData = await response.json();
    contactList = [];
    colors = [];

    for (let id in contactsData) {
        let contact = contactsData[id];
        if (contact.name) {
            contactList.push(contact.name);
            colors.push(contact.color);
        }
    }
}

function checkIfContactsDropdownIsVisible() {
    let dropdownList = document.getElementById("dropdown-list");

    if (dropdownList.classList.contains("d-none")) {
        showContactsDropDown();
    } else {
        closeContactsDropDown();
    }
}

async function showContactsDropDown() {
    await fetchContacts();

    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    if (selectedContacts.length >= 0) {
        assignedPlaceholder.innerHTML = "An";
    }
    // else {
    //     assignedPlaceholder.innerHTML = "";
    // }

    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("dropdown-list");
    dropdownList.innerHTML = templateContactsHTMLDropdownList();

    document.getElementById("dropdown-list").classList.remove("d-none");
    document.getElementById("selected-contacts-circle-container").classList.add("d-none");

    setColorOfAssignedContainer();
    showCheckedContactsAfterDropdownClosing();
}

function showCheckedContactsAfterDropdownClosing() {
    for (let i = 0; i < contactList.length; i++) {
        let contactName = contactList[i];
        let checkBox = document.getElementById(`unchecked-box-${i}`);

        if (selectedContacts.includes(contactName)) {
            checkBox.src = "/img/checked.png";
        } else {
            checkBox.src = "/img/unchecked.png";
        }
    }
}

function closeContactsDropDown() {
    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    assignedPlaceholder.innerHTML = /*html*/ `<span id="assigned-placeholder">Select contacts to assign</span>`;

    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<div id="contacts-dropwdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>`;
    document.getElementById("dropdown-list").classList.add("d-none");
    document.getElementById("selected-contacts-circle-container").classList.remove("d-none");

    removeColorOfBorderAssignedContainer();
    showCirclesOfSelectedContacts();
}

function selectContact(contactName, index) {
    let checkBox = document.getElementById(`unchecked-box-${index}`);
    let assignedPlaceholder = document.getElementById("assigned-placeholder");

    let selectedContactColor = colors[index];

    if (checkBox.src.includes("unchecked.png")) {
        checkBox.src = "/img/checked.png";
        if (!selectedContacts.includes(contactName)) {
            selectedContacts.push(contactName);
            selectedColors.push(selectedContactColor);
            assignedPlaceholder.innerHTML = /*html*/ `<span id="assigned-placeholder">An</span>`;
            document.getElementById("assigned-container").classList.add("heightAuto");
        }
    } else {
        checkBox.src = "/img/unchecked.png";
        let indexOfselectedContacts = selectedContacts.indexOf(contactName);
        let indexOfSelectedColors = selectedColors.indexOf(index);
        if (indexOfselectedContacts >= 0) {
            selectedContacts.splice(indexOfselectedContacts, 1);
            selectedColors.splice(indexOfSelectedColors, 1);
            document.getElementById("assigned-container").classList.remove("heightAuto");
        }
    }
}

function setColorOfAssignedContainer() {
    let selectContactsContainer = document.getElementById("selected-name");
    selectContactsContainer.style.border = "1px solid #90D1ED";
}

function removeColorOfBorderAssignedContainer() {
    let selectContactsContainer = document.getElementById("selected-name");
    selectContactsContainer.style.border = "";
}

function showCirclesOfSelectedContacts() {
    let circleContainer = document.getElementById("selected-contacts-circle-container");
    circleContainer.innerHTML = "";

    for (let i = 0; i < selectedContacts.length; i++) {
        let contact = selectedContacts[i];
        let choosenContact = contactList.indexOf(contact);
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();
        let color = colors[choosenContact];

        let contactHTML = /*html*/ `<div class="circle" style="background-color: ${color}">${firstLetter}${lastLetter}</div>`;
        circleContainer.innerHTML += contactHTML;
    }
}

function templateContactsHTMLDropdownList() {
    let dropdownHTML = "";

    sortContactsByFirstName(contactList);

    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i];
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();
        let color = colors[i];

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-contact-${i}" onclick="selectContact('${contact}', ${i}, '${color}'), doNotCloseDropdown(event)" > 
            <div>  
                <div class="circle" style="background-color: ${color};">
                    ${firstLetter}${lastLetter}
                </div>
                <span>${contact}</span>
            </div>    
                <img src="/img/unchecked.png" alt="unchecked" id="unchecked-box-${i}" class="uncheckedBox">
            </div>`;
    }
    return dropdownHTML;
}

function sortContactsByFirstName(contactList) {
    contactList.sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
}

// Prio

function choosePrio(prio) {
    let selectedPioButton = document.getElementById(`prio-${prio}-button`);

    if (selectedPrio === prio) {
        resetPrio();
        selectedPrio = "";
        console.log("No priority selected");
    } else {
        resetPrio();

        selectedPioButton.classList.add(`prio-${prio}-button-bg-color`);
        selectedPioButton.classList.remove("prio-default-text-color");

        selectedPrio = prio;
        console.log(selectedPrio);
    }
}

function resetPrio() {
    document.getElementById("prio-urgent-button").classList.remove("prio-urgent-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");

    document.getElementById("prio-urgent-button").classList.add("prio-default-text-color");
    document.getElementById("prio-medium-button").classList.add("prio-default-text-color");
    document.getElementById("prio-low-button").classList.add("prio-default-text-color");
}

// Category

function checkIfCategoryDropdownIsVisible() {
    if (document.getElementById("category-dropdown-list").classList.contains("d-none")) {
        showCategoryDropDown();
    } else {
        closeCategoryDropDown();
    }
}

function showCategoryDropDown() {
    document.getElementById("category-placeholder").innerHTML = /*html*/ `Select task category`;
    document.getElementById("category-dropdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("category-dropdown-list");
    dropdownList.innerHTML = templateCategoryHTMLDropdownList(categoryList);

    document.getElementById("category-dropdown-list").classList.remove("d-none");
    selectedCategory = null;
}

function templateCategoryHTMLDropdownList(categories) {
    let dropdownHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-category-${i}" onclick="selectCategory('${category}', ${i})">
                <span>${category}</span>
            </div>`;
    }
    return dropdownHTML;
}

function closeCategoryDropDown() {
    let categoryPlaceholder = document.getElementById("category-placeholder");

    if (selectedCategory) {
        categoryPlaceholder.innerHTML = selectedCategory;
    } else {
        categoryPlaceholder.innerHTML = /*html*/ `Select task category`;
        selectedCategory = null;
    }

    document.getElementById("category-dropdown-arrow-container").innerHTML = /*html*/ `<div id="category-dropdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow"></div>`;
    document.getElementById("category-dropdown-list").classList.add("d-none");
}

function selectCategory(categoryName) {
    selectedCategory = categoryName;
    closeCategoryDropDown();
    console.log(selectedCategory);
}

// Subtasks

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

    if (newSubtaskInput.value !== "") {
        subtasks.push(newSubtaskInput.value);

        let subtaskHTML = templateCategoryHTMLSubtasksList(i, subtasks[i]);

        subtaskList.innerHTML += subtaskHTML;

        newSubtaskInput.value = "";
        subtaskContainer.style.border = "";
        missingSubtaskMessage.classList.add("d-none");
        missingSubtaskMessage.classList.remove("validationStyleSubtasks");
    } else {
        subtaskContainer.style.border = "1px solid #ff8190";
        missingSubtaskMessage.classList.remove("d-none");
        missingSubtaskMessage.classList.add("validationStyleSubtasks");
    }
    resetSubtaskIcon();
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
        removeBorderStyleToValueContainerToValueContainer(subtaskContainer);
        resetSubtaskIcon();
    }
}

function waitingForSubtaskEnterOrDraftEvent() {
    let newSubtaskInput = document.getElementById("new-subtask-input");

    newSubtaskInput.addEventListener("keydown", addSubtaskByEnterKey);
    newSubtaskInput.addEventListener("input", showCloseOrDeleteIconDuringWritingSubtask);
}

waitingForSubtaskEnterOrDraftEvent();

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
        let subtaskHTML = templateCategoryHTMLSubtasksList(i, subtasks[i]);
        subtaskList.innerHTML += subtaskHTML;
    }
}

function templateCategoryHTMLSubtasksList(i, subtask) {
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

    toEditSubtask.innerHTML = /*html*/ `
                            <div id="edit-subtask-container" >
                                    <input type="text" id="edit-subtask-input-${index}" value="${currentSubtaskText}" class="edit-subtask-container-styling">            
                                    <div id="generated-subtask-list-icons" class="showSubtaskIconsWhileEditing">
                                            <div id="delete-icon-container" onclick="deleteSubtask(${index})"><img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" /></div>     
                                            <div class="border-subtask-container"></div>
                                            <div id="edit-icon-container" onclick="submitSubtask(${index})"><img src="/img/addTask/check.png" alt="check" id="check-subtask"></div>
                                    </div>
                            </div>`;

    let editSubtaskInput = document.getElementById(`edit-subtask-input-${index}`);
    editSubtaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            // submitSubtask(index);
            // addSubtaskByEnterKey(event);
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

// User Action Add task

function showSuccessMessage() {
    setTimeout(successMessageSlidingIn, 500);

    setTimeout(hideSuccessMessage, 2500);
}

function successMessageSlidingIn() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.add("slideInFromButton");
}

function hideSuccessMessage() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.remove("slideInFromButton");
}

// Styling

function addBorderStyleToValueContainer(element, color) {
    element.style.border = `1px solid ${color}`;
}

function removeBorderStyleToValueContainerToValueContainer(element) {
    element.style.border = ``;
}

// Clearing fields

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
    checkIfCategoryIsSelected();
    checkIfTitleIsEntered();
    checkIfDateIsSelected();
}

function checkIfCategoryIsSelected() {
    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    if (!selectedCategory) {
        categoryOptions.classList.add("validationBorder");
        missingCategoryMessage.classList.add("validationStyle");
        missingCategoryMessage.classList.remove("d-none");
    } else {
        categoryOptions.classList.remove("validationBorder");
        missingCategoryMessage.classList.remove("validationStyle");
        missingCategoryMessage.classList.add("d-none");
    }
}

function checkIfTitleIsEntered() {
    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");

    if (!titleInput.value) {
        titleInput.style.border = "1px solid #ff8190";
        missingTitleMessage.classList.add("validationStyle");
        missingTitleMessage.classList.remove("d-none");
    } else {
        titleInput.style.border = "";
        missingTitleMessage.classList.remove("validationStyle");
        missingTitleMessage.classList.add("d-none");
    }
}

function checkIfDateIsSelected() {
    let missingDateMessage = document.getElementById("missing-date-message");
    let dateInput = document.getElementById("date-input");

    if (!dateInput.value) {
        dateInput.style.border = "1px solid #ff8190";
        missingDateMessage.classList.add("validationStyle");
        missingDateMessage.classList.remove("d-none");
    } else {
        dateInput.style.border = "";
        missingDateMessage.classList.remove("validationStyle");
        missingDateMessage.classList.add("d-none");
    }
}

function resetRequiredNotifications() {
    let missingDateMessage = document.getElementById("missing-date-message");
    missingDateMessage.classList.add("d-none");
    missingDateMessage.classList.remove("validationStyle");
    document.getElementById("date-input").style.border = "";

    let missingSubtaskMessage = document.getElementById("missing-subtask-message");
    missingSubtaskMessage.classList.add("d-none");
    missingSubtaskMessage.classList.remove("validationStyleSubtasks");
    document.getElementById("new-subtask-container").style.border = "";

    let missingTitleMessage = document.getElementById("missing-title-message");
    let titleInput = document.getElementById("title-input");
    titleInput.style.border = "";
    missingTitleMessage.classList.remove("validationStyle");
    missingTitleMessage.classList.add("d-none");

    let missingCategoryMessage = document.getElementById("missing-category-message");
    let categoryOptions = document.getElementById("selected-category");
    categoryOptions.classList.remove("validationBorder");
    missingCategoryMessage.classList.remove("validationStyle");
    missingCategoryMessage.classList.add("d-none");
}

// Close dropdown

function doNotCloseDropdown(event) {
    event.stopPropagation();
}

function clickOutsideOfDropdown(event) {
    let contactsDropdown = document.getElementById("dropdown-list");
    let categoryDropdown = document.getElementById("category-dropdown-list");

    let clickedInsideContacts = contactsDropdown.contains(event.target);
    let clickedInsideCategory = categoryDropdown.contains(event.target);

    if (!clickedInsideContacts && !clickedInsideCategory) {
        if (!contactsDropdown.classList.contains("d-none")) {
            closeContactsDropDown();
        }

        if (!categoryDropdown.classList.contains("d-none")) {
            closeCategoryDropDown();
        }
    }
}

document.addEventListener("click", clickOutsideOfDropdown);

// date-input

function addBorderStyleToValueContainer(element, color) {
    element.style.border = `1px solid ${color}`;
}

function removeBorderStyleToValueContainer(element) {
    element.style.border = "";
}

function handleDateInput() {
    let dateInput = document.getElementById("date-input");

    if (dateInput.value) {
        addBorderStyleToValueContainer(dateInput, "#90D1ED");
    } else {
        removeBorderStyleToValueContainerToValueContainer(dateInput);
    }
}
let dateInput = document.getElementById("date-input");
dateInput.addEventListener("input", handleDateInput);

// title-input

function handleTitleInput() {
    let titleInput = document.getElementById("title-input");

    if (titleInput.value) {
        addBorderStyleToValueContainer(titleInput, "#90D1ED");
    } else {
        removeBorderStyleToValueContainerToValueContainer(titleInput);
    }
}

let titleInput = document.getElementById("title-input");
titleInput.addEventListener("input", handleTitleInput);

// description-input

function handleTextareaInput() {
    let textareaInput = document.getElementById("textarea-input");

    if (textareaInput.value) {
        addBorderStyleToValueContainer(textareaInput, "#90D1ED");
    } else {
        removeBorderStyleToValueContainer(textareaInput);
    }
}

// let textareaInput = document.getElementById("textarea-input");
// textareaInput.addEventListener("input", handleTextareaInput);

// function handleAssignedContainer() {
//     let assignedPlaceholder = document.getElementById("selected-name");
//     let dropdownList = document.getElementById("dropdown-list");

//     if (!dropdownList.classList.contains("d-none")) {
//         addBorderStyleToValueContainer(assignedPlaceholder, "#90D1ED");
//     } else {
//         removeBorderStyleToValueContainer(assignedPlaceholder);
//     }
// }

// document.getElementById("selected-name").addEventListener("click", handleAssignedContainer);
