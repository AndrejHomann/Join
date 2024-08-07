const BASE_URL = "https://console.firebase.google.com/project/join-projekt-f44bb/database/join-projekt-f44bb-default-rtdb/data/~2F";

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

async function addTask(path = "", data = {}) {
    let response = await fetch(BASE_URL + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
}

function choosePrio(prio) {
    document.getElementById("prio-urgent-button").classList.remove("prio-urgent-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");
    selectedPrio = prio;
    title: document.getElementById("title-input").value;
    storyDescrip: document.getElementById("textarea-input").value;
    name: document.getElementById("selected-name").value;
    date: document.getElementById("date-input").value;
    urgency: selectedPrio;
    subtask: document.getElementById("choose-subtasks").value;
}
