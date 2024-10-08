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

async function showContactsDropDown() {
    await fetchContacts();

    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    if (selectedContacts.length >= 0) {
        assignedPlaceholder.innerHTML = "An";
    }

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

// user Action Add task

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
