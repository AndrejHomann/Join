const BASE_URL = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app";

let selectedPrio = "medium";

/**
 * Sets the selected priority for the task and updates the button styles accordingly.
 *
 * This function updates the selected priority by adding the corresponding background color
 * to the priority button (`urgent`, `medium`, `low`) and removing the default text color.
 * It resets any previously selected priority button styles before applying the new selection.
 * If the function is called in the context of editing a task, it will target the edit buttons.
 *
 * @param {string} prio - The priority to select. Can be one of `"urgent"`, `"medium"`, or `"low"`.
 *
 */
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

/**
 * Resets the priority button styles to their default state.
 *
 * This function removes the background color and resets the text color of the priority buttons
 * (`urgent`, `medium`, `low`) to their default styles. If the function is called in the context
 * of editing a task, it will target the edit buttons instead of the default ones.
 *
 */
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
