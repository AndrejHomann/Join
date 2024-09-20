const BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/";
let contactList = [];
let selectedPrio = "";
let categoryList = ["Technical Task", "User Story"];
let selectedCategory = null;
let selectedContact = null;
let selectedContacts = [];
let colors = [];
let selectedColors = [];

function createTask() {
    let task = {
        title: document.getElementById("title-input").value,
        taskDescription: document.getElementById("textarea-input").value,
        name: selectedContacts,
        date: document.getElementById("date-input").value,
        priority: selectedPrio,
        subtask: document.getElementById("choose-subtasks").value,
        category: selectedCategory,
        color: selectedColors,
    };
    addTask("/tasks.json", task);
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
    } else {
        console.error("Error adding task:", response.statusText);
    }
}

async function fetchContacts() {
    let response = await fetch(BASE_URL + "/contacts.json");
    let contactsData = await response.json();
    contactList = [];

    for (let id in contactsData) {
        let contact = contactsData[id];
        if (contact.name) {
            contactList.push(contact.name);
        }
    }
}

function checkIfContactsDropdownIsVisible() {
    if (document.getElementById("dropdown-list").classList.contains("d-none")) {
        showContactsDropDown();
    } else {
        closeContactsDropDown();
    }
}

async function showContactsDropDown() {
    await fetchContacts();
    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    assignedPlaceholder.innerHTML = "";

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
    let selectedContactColor = colors[index];

    if (checkBox.src.includes("unchecked.png")) {
        checkBox.src = "/img/checked.png";
        if (!selectedContacts.includes(contactName)) {
            selectedContacts.push(contactName);
            selectedColors.push(selectedContactColor);
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
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i];
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();
        if (!colors[i]) {
            colors[i] = getRandomColor();
        }
        let color = colors[i];

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-contact-${i}" onclick="selectContact('${contact}', ${i}, '${color}')">
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

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function choosePrio(prio) {
    document.getElementById("prio-high-button").classList.remove("prio-high-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");

    document.getElementById("prio-high-button").classList.add("prio-default-text-color");
    document.getElementById("prio-medium-button").classList.add("prio-default-text-color");
    document.getElementById("prio-low-button").classList.add("prio-default-text-color");

    let selectedButton = document.getElementById(`prio-${prio}-button`);
    selectedButton.classList.add(`prio-${prio}-button-bg-color`);
    selectedButton.classList.remove("prio-default-text-color");

    selectedPrio = prio;
    console.log(selectedPrio);
}

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
        showCategoryDropDown();
    }

    document.getElementById("category-dropdown-arrow-container").innerHTML = /*html*/ `<div id="category-dropdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow"></div>`;
    document.getElementById("category-dropdown-list").classList.add("d-none");
}

function selectCategory(categoryName) {
    selectedCategory = categoryName;
    closeCategoryDropDown();
    console.log(selectedCategory);
}
