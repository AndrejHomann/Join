const BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app";

let selectedPrio = "medium";

function choosePrio(prio) {
    let selectedPioButton = document.getElementById(`prio-${prio}-button`);

    if (document.getElementById(`edit-prio-${prio}-button`)) {
        selectedPrio = "";
        selectedPioButton = document.getElementById(`edit-prio-${prio}-button`);
    }

    resetPrio();
    selectedPioButton.classList.add(`prio-${prio}-button-bg-color`);
    selectedPioButton.classList.remove("prio-default-text-color");

    selectedPrio = prio;
}

function resetPrio() {
    let urgentButton = document.getElementById("prio-urgent-button");
    let mediumButton = document.getElementById("prio-medium-button");
    let lowButton = document.getElementById("prio-low-button");

    if (document.getElementById("edit-prio-urgent-button")) {
        urgentButton = document.getElementById("edit-prio-urgent-button");
        mediumButton = document.getElementById("edit-prio-medium-button");
        lowButton = document.getElementById("edit-prio-low-button");
    }

    urgentButton.classList.remove("prio-urgent-button-bg-color");
    mediumButton.classList.remove("prio-medium-button-bg-color");
    lowButton.classList.remove("prio-low-button-bg-color");

    urgentButton.classList.add("prio-default-text-color");
    mediumButton.classList.add("prio-default-text-color");
    lowButton.classList.add("prio-default-text-color");
}

// function resetPrio() {
//     document.getElementById("prio-urgent-button").classList.remove("prio-urgent-button-bg-color");
//     document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
//     document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");

//     document.getElementById("prio-urgent-button").classList.add("prio-default-text-color");
//     document.getElementById("prio-medium-button").classList.add("prio-default-text-color");
//     document.getElementById("prio-low-button").classList.add("prio-default-text-color");
// }
