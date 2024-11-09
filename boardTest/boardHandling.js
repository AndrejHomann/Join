/**
 * Adds drag-and-drop event listeners to task elements and board columns.
 *
 * This function selects all task elements and board columns in the DOM and
 * applies drag and drop event handlers to enable moving tasks between columns.
 * It organizes the task management interface, enhancing user interaction
 * by allowing drag-and-drop functionality.
 */
function addDragAndDropListeners() {
    const taskDivs = document.querySelectorAll(".task");
    const columns = document.querySelectorAll(".board-column");

    addDragEventsToTasks(taskDivs);
    addDropEventsToColumns(columns);
}

/**
 * Adds drag event listeners to each task element.
 *
 * This function enables drag-and-drop functionality for the given task elements by
 * adding event listeners for the `dragstart` and `dragend` events. When a task is
 * dragged, it calls the `handleDragStart` function to handle the drag initiation,
 * and when the drag ends, it calls `handleDragEnd` to reset the task's state.
 *
 * @param {NodeList} taskDivs - A NodeList of task elements to which drag events
 * will be added.
 */
function addDragEventsToTasks(taskDivs) {
    taskDivs.forEach((task) => {
        task.addEventListener("dragstart", (event) => {
            handleDragStart(event, task);
        });
        task.addEventListener("dragend", () => {
            handleDragEnd(task);
        });
    });
}

/**
 * Adds drop event listeners to each column element.
 *
 * This function enables drop functionality for the specified columns by
 * adding event listeners for the `dragover` and `drop` events. When a task
 * is dragged over a column, it prevents the default behavior to allow drops,
 * and when a task is dropped, it calls the `handleDrop` function to manage
 * the task placement.
 *
 * @param {NodeList} columns - A NodeList of column elements to which drop
 * events will be added.
 */
function addDropEventsToColumns(columns) {
    columns.forEach((column) => {
        column.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        column.addEventListener("drop", (event) => {
            handleDrop(event, column);
        });
    });
}

/**
 * Handles the start of a drag event for a task element.
 *
 * This function sets the drag data and applies visual effects to the task
 * being dragged. It updates the `dataTransfer` object with the task's ID
 * and adds a 'dragging' class to apply styling changes, such as rotation.
 *
 * @param {DragEvent} event - The drag event triggered by the user.
 * @param {HTMLElement} task - The task element being dragged.
 */
function handleDragStart(event, task) {
    event.dataTransfer.setData("text/plain", task.id);
    task.classList.add("dragging");
    task.style.transform = "rotate(-5deg)";
}

/**
 * Handles the end of a drag event for a task element.
 *
 * This function removes the visual effects applied during the drag,
 * including the 'dragging' class and any transformations.
 *
 * @param {HTMLElement} task - The task element that was dragged.
 */
function handleDragEnd(task) {
    task.classList.remove("dragging");
    task.style.transform = "rotate(0deg)";
}

/**
 * Handles the drop event for a task being moved between columns.
 *
 * This function retrieves the task ID from the dragged data,
 * appends the task element to the new column, updates the task's status,
 * and checks for empty columns.
 *
 * @param {DragEvent} event - The drag event triggered on drop.
 * @param {HTMLElement} column - The column element where the task is dropped.
 */
function handleDrop(event, column) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const taskElement = document.getElementById(taskId);
    const newStatus = column.getAttribute("data-status");

    console.log(`TaskID: ${taskId}, Neuer Status: ${newStatus}`);

    const tasksContainer = column.querySelector(".tasks-container");
    tasksContainer.appendChild(taskElement);

    updateTaskStatus(taskId, newStatus);
    checkEmptyColumns();
}

/**
 * Displays the task creation form by adding a 'show' class to the container.
 *
 * This function targets the 'addTaskFromBoard' element and applies the 'show'
 * class to make the task creation form visible to the user.
 */
function showTaskForm() {
    console.log("showTaskForm() wurde aufgerufen");
    const taskContainer = document.getElementById("addTaskFromBoard");
    taskContainer.classList.add("show");
}

/**
 * Closes the task creation form by sliding it out and hiding it.
 *
 * This function adds a 'slide-out' class to the task form container,
 * which triggers a CSS animation. After a delay of 500 milliseconds,
 * it sets the display style of the task form and overlay to 'none',
 * effectively hiding them from the user interface.
 */
function closeAddTaskForm() {
    const taskForm = document.querySelector(".floating-task-container");
    const overlay = document.getElementById("task-form-overlay");
    taskForm.classList.add("slide-out");

    setTimeout(() => {
        taskForm.style.display = "none";
        overlay.style.display = "none";
    }, 500);
}





/**
 * Adds an event listener to the search button.
 * When the button is clicked, it triggers the `searchTasks` function
 * to filter and display tasks based on the user's input in the search field.
 */
document.querySelector(".search").addEventListener("click", searchTasks);

/**
 * Adds an event listener to the search input field to handle user input.
 * When the input field is cleared (value is empty), all tasks are displayed.
 */
document.getElementById("search-input-id").addEventListener("input", function () {
    if (this.value === "") {
        displayAllTasks();
    } else if (this.value !== "") {
        searchTasks();
    }
});

/**
 * Searches for tasks based on user input and filters the displayed tasks accordingly.
 *
 * This function retrieves the search input from the user, converts it to lowercase,
 * and checks if the input is empty. If it is, it displays all tasks. If not, it filters
 * the `tasksArray` to find tasks whose title, description, or category includes the search
 * input. The filtered tasks are then displayed using `displayFilteredTasks()`.
 * If no tasks match the search criteria, it invokes `showNoResultsMessage()`.
 */
// const searchInput = document.getElementById("search-input-id");
// searchInput.addEventListener("input", () => {
//     searchTasks(searchInput);
// });

function searchTasks() {
    const searchInputValue = document.getElementById("search-input-id").value.toLowerCase();
    if (searchInputValue === "") {
        displayAllTasks();
        return;
    }
    const filteredTasks = tasksArray.filter((task) => {
        return task.title.toLowerCase().includes(searchInputValue) || task.taskDescription.toLowerCase().includes(searchInputValue) || task.category.toLowerCase().includes(searchInputValue);
    });
    displayFilteredTasks(filteredTasks);
    if (filteredTasks.length === 0) {
        showNoResultsMessage();
    }
}

/**
 * Displays a message overlay indicating that no search results were found.
 *
 * This function creates an overlay element and a message container, which contains
 * a message informing the user that no matches were found. An "OK" button is included
 * to allow the user to close the message. The overlay is appended to the body of the document.
 */
function showNoResultsMessage() {
    const overlay = document.createElement("div");
    overlay.classList.add("message-overlay");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("no-results-message");
    messageContainer.innerHTML = `
        <p>Sorry, no matches found</p>
        <button class="ok-button" onclick="closeNoResultsMessage()">OK</button>
    `;
    overlay.appendChild(messageContainer);
    document.body.appendChild(overlay);
}

/**
 * Closes the no results message overlay and resets the search input.
 *
 * This function removes the message overlay from the document, clears the search input field,
 * and displays all tasks again. It ensures that the user can start a new search
 * without any previous filters applied.
 */
function closeNoResultsMessage() {
    const overlay = document.querySelector(".message-overlay");
    if (overlay) {
        overlay.remove();
    }
    document.getElementById("search-input-id").value = "";
    displayAllTasks();
}

/**
 * Displays all tasks in the task board.
 *
 * This function calls `displayFilteredTasks` with the complete tasks array,
 * ensuring that all tasks are visible to the user.
 */
function displayAllTasks() {
    displayFilteredTasks(tasksArray);
}











/**
 * Opens the details of a specific task based on the provided task ID.
 *
 * @param {string} taskId - The ID of the task whose details are to be displayed.
 * @returns {void} - Does not return a value.
 *
 * This function searches for the task in the tasksArray using the taskId.
 * If the task is found, it creates the task detail view and displays it.
 */
function openTaskDetail(taskId) {
    const task = tasksArray.find((t) => t.id === taskId);
    if (!task) return;

    createTaskDetail(task);

    const taskDetails = document.getElementById("taskDetailsOverlay");
    if (taskDetails) {
        taskDetails.style.display = "flex";
        taskDetails.classList.remove("task-details-slideOut");
        taskDetails.classList.add("task-details-slideIn");
        addOverlayClickListener();
    }
}

// async function loadAddTaskScript() {
//     const scripts = [
//         { id: "addTaskScript", src: "/js/addTask.js" },
//         { id: "addTaskCategoryFunctions", src: "/js/addTaskCategoryFunctions.js" },
//         { id: "addTaskContactsAndUserActionsFunctions", src: "/js/addTaskContactsAndUserActionsFunctions.js" },
//         { id: "addTaskValidationAndClearingFunctions", src: "/js/addTaskValidationAndClearingFunctions.js" },
//     ];

//     return Promise.all(
//         scripts.map((scriptInfo) => {
//             return new Promise((resolve, reject) => {
//                 if (!document.getElementById(scriptInfo.id)) {
//                     let script = document.createElement("script");
//                     script.src = scriptInfo.src;
//                     script.id = scriptInfo.id;
//                     script.onload = function () {
//                         resolve();
//                     };
//                     script.onerror = function () {
//                         reject(new Error(`Failed to load script: ${scriptInfo.src}`));
//                     };
//                     document.body.appendChild(script);
//                 } else {
//                     resolve();
//                 }
//             });
//         })
//     );
// }

/**
 * Attaches event handlers to the confirmation buttons in the confirmation dialog.
 *
 * @param {HTMLElement} confirmationDiv - The confirmation dialog element containing the buttons.
 * @param {function} resolve - A function that resolves the promise returned by showDeleteConfirmation.
 *
 * This function sets up click event listeners for the "Yes" and "No" buttons in the
 * confirmation dialog. When a button is clicked, it resolves the promise with
 * either true or false and closes the confirmation dialog.
 */
function attachConfirmationHandlers(confirmationDiv, resolve) {
    confirmationDiv.querySelector(".yesButton").addEventListener("click", () => {
        resolve(true);
        closeConfirmationDiv(confirmationDiv);
    });
    confirmationDiv.querySelector(".noButton").addEventListener("click", () => {
        resolve(false);
        closeConfirmationDiv(confirmationDiv);
    });
}

/**
 * Closes and removes the confirmation dialog and its overlay from the DOM.
 *
 * @param {HTMLElement} confirmationDiv - The confirmation dialog element to be closed.
 *
 * This function removes the confirmation dialog and its associated overlay
 * from the DOM, effectively closing the confirmation interface.
 */
function closeConfirmationDiv(confirmationDiv) {
    confirmationDiv.remove();
    document.querySelector(".delete-overlay").remove();
}

function closeBoardAddTaskIfNeeded() {
    closeAddTaskForm();
    loadTasks();
}

// function validateRequiredFields() {
//     let isValid = true;

//     const titleInputContainer = document.getElementById("title-input-container");
//     const titleInput = document.getElementById("edit-title-input");
//     const titleMessage = titleInputContainer.querySelector(".error-message");

//     if (titleInput.value.trim() === "") {
//         titleMessage.style.display = "block";
//         titleInputContainer.classList.add("error");
//         isValid = false;
//     } else {
//         titleMessage.style.display = "none";
//         titleInputContainer.classList.remove("error");
//     }

//     const dateContainer = document.getElementById("calender");
//     const dateInput = document.getElementById("edit-date-input");
//     const dateMessage = dateContainer.querySelector(".error-message");

//     if (!dateInput.value) {
//         dateMessage.style.display = "block";
//         dateContainer.classList.add("error");
//         isValid = false;
//     } else {
//         dateMessage.style.display = "none";
//         dateContainer.classList.remove("error");
//     }

//     const categoryPlaceholder = document.getElementById("category-placeholder").innerText;
//     if (!categoryPlaceholder || categoryPlaceholder === "Select task category") {
//         isValid = false;
//     }
//     return isValid;
// }
