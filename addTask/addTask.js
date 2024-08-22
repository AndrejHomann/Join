const BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/";
let selectedPrio = null;
let contactNames = [];

function createTask() {
    let task = {
        title: document.getElementById("title-input").value,
        storyDescrip: document.getElementById("textarea-input").value,
        name: document.getElementById("selected-name").value,
        date: document.getElementById("date-input").value,
        priority: selectedPrio,
        subtask: document.getElementById("choose-subtasks").value,
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

function choosePrio(prio) {
    document.getElementById("prio-high-button").classList.remove("prio-high-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");
    document.getElementById(`prio-${prio}-button`).classList.add(`prio-${prio}-button-bg-color`);
    selectedPrio = prio;
}

async function fetchContacts() {
    let response = await fetch(BASE_URL + "/contacts.json");
    let contactsData = await response.json();
    contactNames = [];

    for (let id in contactsData) {
        let contact = contactsData[id];
        if (contact.name) {
            contactNames.push(contact.name);
        }
    }
    console.log(contactNames);
    showDropDown();
}

function showDropDown() {
    let dropdownList = document.getElementById("dropdown-list");

    // Inhalte leeren, um vorhandene Elemente zu entfernen
    dropdownList.innerHTML = "";

    for (let i = 0; i < contactNames.length; i++) {
        let names = document.createElement("div"); // Erstellen eines div für jeden Namen
        names.textContent = contactNames[i]; // Namen als Textinhalt hinzufügen
        dropdownList.appendChild(names);
    }
}

/**
 * 
 * 
 * 
 * async function includeHTML() {
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
 */
