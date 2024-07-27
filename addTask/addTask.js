let tasks = [];
let participants = [];
let name, sureName, lastName;
let selectedPrio = "";
const BASE_URL = "https://join-249-default-rtdb.europe-west1.firebasedatabase.app/";

async function addTask(event) {
    let response = await fetch(url + ".json");
    let responseToJson = await response.json();
    event.preventDefault();
    tasks.push({
        title: document.getElementById("title-input").value,
        storyDescrip: document.getElementById("textarea-input").value,
        name: document.getElementById("selected-name").value,
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        subtask: document.getElementById("choose-subtasks").value,
    });
    console.log(tasks);
}

function choosePrio(prio) {
    document.getElementById("prio-urgent-button").classList.remove("prio-urgent-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");
    selectedPrio = prio;
}

async function postNewTasks() {}
