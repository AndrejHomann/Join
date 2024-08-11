const BASE_URL = "https://join-projekt-f44bb-default-rtdb.europe-west1.firebasedatabase.app/";

function createTask() {
    let task = {
        title: document.getElementById("title-input").value,
        storyDescrip: document.getElementById("textarea-input").value,
        name: document.getElementById("selected-name").value,
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        subtask: document.getElementById("choose-subtasks").value,
    };

    addTask("/tasks", task);
}

async function addTask(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
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

function fetchContacts() {}

function choosePrio(prio) {
    document.getElementById("prio-high-button").style.background = "";
    document.getElementById("prio-medium-button").style.background = "";
    document.getElementById("prio-low-button").style.background = "";

    document.getElementById(`prio-${prio}-button`).style.background = "red";
    selectedPrio = prio;
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
 * 
function submitTask() {
    let data = {
        title: document.getElementById("title-input").value,
        storyDescrip: document.getElementById("textarea-input").value,
        name: document.getElementById("selected-name").value,
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        subtask: document.getElementById("choose-subtasks").value,
    };
    console.log(data);
} 
 */
