// const BASE_URL = 'https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app';

let tasksArray = [];

/**
 * Event listener that triggers when the DOM content is fully loaded.
 * It calls the functions to load tasks and include HTML components.
 *
 * @event
 * @type {EventListener}
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    includeHTML();
});

/**
 * Asynchronously loads tasks from the server and updates the tasks array.
 * It fetches task data from the specified BASE_URL and transforms it
 * into an array format. If successful, it calls the `displayTasks`
 * function to render the tasks. In case of an error, it logs the error to the console.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the tasks have been loaded and displayed.
 */
async function loadTasks() {
    try {
        const response = await fetch(`${BASE_URL}/tasks.json`);
        const data = await response.json();
        tasksArray = Object.keys(data).map((key) => {
            return {
                id: key,
                ...data[key],
            };
        });
        displayTasks();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

/**
 * Asynchronously updates the status of a task in the tasks array and on the server.
 * It finds the task by its ID, updates its status, and sends a PATCH request
 * to update the task status in the database. If the task is not found or if
 * there's an error during the fetch operation, it logs an appropriate message to the console.
 *
 * @async
 * @function
 * @param {string} taskId - The ID of the task to be updated.
 * @param {string} newStatus - The new status to set for the task (e.g., "in-progress", "done").
 * @returns {Promise<void>} A promise that resolves when the task status has been updated.
 */
async function updateTaskStatus(taskId, newStatus) {
    const taskIndex = tasksArray.findIndex((t) => `task-${t.id}` === taskId);
    const task = tasksArray[taskIndex];

    if (task) {
        task.status = newStatus;
        try {
            const response = await fetch(`${BASE_URL}/tasks/${task.id}.json`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                console.error("Fehler beim Aktualisieren der Aufgabe.");
            }
        } catch (error) {
            console.error("Netzwerkfehler beim Aktualisieren der Aufgabe:", error);
        }
    } else {
        console.error("Aufgabe nicht gefunden!");
    }
}

/**
 * Asynchronously toggles the status of a subtask for a given task and updates
 * the subtask status on the server. It finds the task by its ID, toggles the
 * status of the specified subtask, and sends a PATCH request to update
 * the subtask status in the database. Additionally, it updates the task's
 * progress and displays the updated tasks. If the task is not found or if
 * there's an error during the fetch operation, it logs an appropriate message to the console.
 *
 * @async
 * @function
 * @param {string} taskId - The ID of the task that contains the subtask.
 * @param {number} subtaskIndex - The index of the subtask to toggle.
 * @returns {Promise<void>} A promise that resolves when the subtask status has been updated.
 */
async function toggleSubtaskStatus(taskId, subtaskIndex) {
    const task = tasksArray.find((t) => t.id === taskId);
    if (!task || !task.addedSubtasks) return;

    const subtask = toggleSubtask(task.addedSubtasks, subtaskIndex);

    try {
        await updateSubtaskOnServer(taskId, subtaskIndex, subtask.status);
        updateTaskProgress(task);
        displayTasks();
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Subtask:", error);
    }
}

/**
 * Toggles the status of a subtask in the provided array of subtasks.
 * If the subtask is currently marked as "unchecked", it changes the status to "checked",
 * and vice versa.
 *
 * @function
 * @param {Array<Object>} addedSubtasks - The array of subtasks to modify.
 * @param {number} index - The index of the subtask to toggle.
 * @returns {Object} The updated subtask with its new status.
 */
function toggleSubtask(addedSubtasks, index) {
    const subtask = addedSubtasks[index];
    subtask.status = subtask.status === "unchecked" ? "checked" : "unchecked";
    return subtask;
}

/**
 * Updates the status of a subtask on the server by sending a PATCH request.
 *
 * @async
 * @function
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @param {number} subtaskIndex - The index of the subtask to update.
 * @param {string} status - The new status of the subtask ("checked" or "unchecked").
 * @returns {Promise<Response>} A promise that resolves to the response from the server.
 */
async function updateSubtaskOnServer(taskId, subtaskIndex, status) {
    return fetch(`${BASE_URL}/tasks/${taskId}/addedSubtasks/${subtaskIndex}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: status,
        }),
    });
}

/**
 * Handles the deletion of a task after user confirmation.
 *
 * @async
 * @function
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A promise that resolves when the task is confirmed for deletion.
 */
async function handleDeleteTask(taskId) {
    const confirmDelete = await showDeleteConfirmation(taskId);
    if (!confirmDelete) return;

    deleteTask(taskId);
}

/**
 * Deletes a task from the server and updates the local state.
 *
 * @async
 * @function
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A promise that resolves when the task is deleted from the server.
 */
async function deleteTask(taskId) {
    const url = `${BASE_URL}/tasks/${taskId}.json`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });

        if (response.ok) {
            handleTaskDeletion(taskId);
        } else {
            console.error("Failed to delete task");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

/**
 * Handles the deletion of a task by updating the DOM and closing any open task details.
 *
 * @function
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {void}
 */
function handleTaskDeletion(taskId) {
    removeTaskFromDOM(taskId);
    closeTaskDetails();
    checkEmptyColumns();
}

/**
 * Removes a task element from the DOM based on its task ID.
 *
 * @function
 * @param {string} taskId - The ID of the task to be removed from the DOM.
 * @returns {void}
 */
function removeTaskFromDOM(taskId) {
    const taskElement = document.querySelector(`#task-${taskId}`);
    if (taskElement) {
        taskElement.remove();
    }
}

/**
 * Checks the input fields for the title and date and displays corresponding error messages.
 *
 * - If both the title and the date are missing, both error messages are displayed.
 * - If only the title is missing, only the title error message is displayed.
 * - If only the date is missing, only the date error message is displayed.
 * - If both fields are filled in, no error messages are displayed.
 *
 * @function checkInputFields
 */
function checkInputFields() {
    const titleInput = document.getElementById("edit-title-input");
    const dateInput = document.getElementById("date-input");
    const categoryInput = document.getElementById("selected-category");
    const subtaskInput = document.getElementById("new-subtask-input");

    const missingTitleMessage = document.getElementById("missing-title-message");
    const missingDateMessage = document.getElementById("missing-date-message");
    const missingCategoryMessage = document.getElementById("missing-category-message");
    const missingSubtaskMessage = document.getElementById("missing-subtask-message");

    if (titleInput.value === "" && dateInput.value === "" && categoryInput.value === "" && subtaskInput.value === "") {
        missingTitleMessage.style.display = "flex";
        missingDateMessage.style.display = "flex";
        missingCategoryMessage.style.display = "flex";
        missingSubtaskMessage.style.display = "flex";
    } else {
        if (titleInput.value === "") {
            missingTitleMessage.style.display = "flex";
        } else {
            missingTitleMessage.style.display = "none";
        }

        if (dateInput.value === "") {
            missingDateMessage.style.display = "flex";
        } else {
            missingDateMessage.style.display = "none";
        }

        if (categoryInput.value === "") {
            missingCategoryMessage.style.display = "flex";
        } else {
            missingCategoryMessage.style.display = "none";
        }

        if (subtaskInput.value === "") {
            missingSubtaskMessage.style.display = "flex";
        } else {
            missingSubtaskMessage.style.display = "none";
        }
    }
}
