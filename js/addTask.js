const BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app";
let contactList = [];
let selectedPrio = "medium";
let categoryList = ["Technical Task", "User Story"];
let selectedCategory = null;
let selectedContact = null;
let selectedContacts = [];
let colors = [];
let selectedColors = [];
let subtasks = [];

async function includeHTML() {
    let includeElements = document.querySelectorAll("[includeHTML]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
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
    let response = await fetch(BASE_URL + path, {
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
    resetTaskForm();
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
    if (selectedContacts.length > 0) {
        assignedPlaceholder.innerHTML = "An";
    } else {
        assignedPlaceholder.innerHTML = "";
    }

    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("dropdown-list");
    dropdownList.innerHTML = templateContactsHTMLDropdownList();

    document.getElementById("dropdown-list").classList.remove("d-none");
    document.getElementById("selected-contacts-circle-container").classList.add("d-none");

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
        }
    } else {
        checkBox.src = "/img/unchecked.png";
        let indexOfselectedContacts = selectedContacts.indexOf(contactName);
        let indexOfSelectedColors = selectedColors.indexOf(index);
        if (indexOfselectedContacts >= 0) {
            selectedContacts.splice(indexOfselectedContacts, 1);
            selectedColors.splice(indexOfSelectedColors, 1);
        }
    }
    console.log(selectedContacts);
    console.log(selectedColors);
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
    let subtaskIconContainer = document.getElementById("subtask-icon-container");

    subtaskIconContainer.classList.remove("plusIconHover");

    subtaskIconContainer.innerHTML = /*html*/ `            
        <div id="close-icon-container" onclick="closeSubtaskDraw()"><img src="/img/addTask/close.png" alt="delete" id="close-subtask" /></div>
        <div id="border-subtask-container"></div>
        <div id="check-icon-container" onclick="addSubtask()"><img src="/img/addTask/check.png" alt="check" id="check-subtask" /></div>`;

    let checkIconContainer = document.getElementById("check-icon-container");
    checkIconContainer.classList.add("circleHoverEffect");
    let closeIconContainer = document.getElementById("close-icon-container");
    closeIconContainer.classList.add("circleHoverEffect");
}

let newSubtask = document.getElementById("new-subtask-input");
newSubtask.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("check-icon-container").click();
    }
});

function closeSubtaskDraw() {
    let subtaskDraw = document.getElementById("new-subtask-input");
    subtaskDraw.value = ``;
}

function addSubtask() {
    let newSubtaskInput = document.getElementById("new-subtask-input");
    let subtaskList = document.getElementById("subtask-list");
    let missingSubtaskMessage = document.getElementById("missing-subtask-message");
    let subtaskContainer = document.getElementById("new-subtask-contaier");

    if (newSubtaskInput.value !== "") {
        subtasks.push(newSubtaskInput.value);

        let subtaskHTML = /*html*/ `
            <div class="subtask-item">
                <li>${newSubtaskInput.value}</li>
            </div>`;

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
}

function resetTaskForm() {
    document.getElementById("title-input").value = "";
    document.getElementById("textarea-input").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("new-subtask-input").value = "";

    document.getElementById("subtask-list").innerHTML = "";

    document.getElementById("category-placeholder").innerHTML = "Select task category";
    document.getElementById("assigned-placeholder").innerHTML = "Select contacts to assign";
    document.getElementById("selected-contacts-circle-container").innerHTML = "";

    selectedContacts = [];
    selectedColors = [];
    selectedCategory = null;
    subtasks = [];
    selectedPrio = "medium";

    resetPrio();
    document.getElementById("prio-medium-button").classList.add("prio-medium-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-default-text-color");
    closeContactsDropDown();
    closeCategoryDropDown();
}

function showSuccessMessage() {
    setTimeout(addDisplayFlex, 500);

    setTimeout(hideSuccessMessage, 2500);
}

function addDisplayFlex() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.add("slide-in");
}

function hideSuccessMessage() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.remove("slide-in");
}

function clearFields() {
    document.getElementById("title-input").value = "";
    document.getElementById("textarea-input").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("new-subtask-input").value = "";

    document.getElementById("subtask-list").innerHTML = "";

    document.getElementById("category-placeholder").innerHTML = "Select task category";
    document.getElementById("assigned-placeholder").innerHTML = "Select contacts to assign";
    document.getElementById("selected-contacts-circle-container").innerHTML = "";

    selectedContacts = [];
    selectedColors = [];
    selectedCategory = null;
    subtasks = [];
    selectedPrio = "medium";

    resetPrio();
    document.getElementById("prio-medium-button").classList.add("prio-medium-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-default-text-color");
    closeContactsDropDown();
    closeCategoryDropDown();

    resetRequiredNotifications();
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
    document.getElementById("new-subtask-contaier").style.border = "";

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
