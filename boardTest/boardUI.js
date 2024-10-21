/**
 * Displays all tasks in their respective columns in the DOM.
 * Clears the current tasks from the columns and repopulates them
 * based on the tasks in the tasksArray.
 *
 * @function
 * @returns {void}
 */
function displayTasks() {
    document.querySelector("#toDoColumn .tasks-container").innerHTML = "";
    document.querySelector("#inProgressColumn .tasks-container").innerHTML = "";
    document.querySelector("#awaitFeedbackColumn .tasks-container").innerHTML = "";
    document.querySelector("#doneColumn .tasks-container").innerHTML = "";

    tasksArray.forEach((task) => {
        assignTaskToColumn(task);
    });
    checkEmptyColumns();
    addDragAndDropListeners();
}

/**
 * Checks each task column for empty status and updates the column's
 * feedback message accordingly.
 * Displays a message if there are no tasks in a column.
 *
 * @function
 * @returns {void}
 */
function checkEmptyColumns() {
    const columns = [
        { selector: "#toDoColumn", message: "No tasks To do" },
        { selector: "#inProgressColumn", message: "No tasks In progress" },
        { selector: "#awaitFeedbackColumn", message: "No tasks Awaiting feedback" },
        { selector: "#doneColumn", message: "No tasks Done" },
    ];
    columns.forEach((column) => updateColumnFeedback(column.selector, column.message));
}

/**
 * Updates the feedback message for a specific task column based on its
 * current state. If the column is empty, it displays a feedback message;
 * otherwise, it removes any existing feedback message.
 *
 * @function
 * @param {string} selector - The CSS selector for the column to update.
 * @param {string} message - The message to display when the column is empty.
 * @returns {void}
 */
function updateColumnFeedback(selector, message) {
    const tasksContainer = document.querySelector(`${selector} .tasks-container`);
    if (tasksContainer.children.length === 0 || tasksContainer.querySelector(".task") === null) {
        tasksContainer.innerHTML = `<div class="column-feedback"><p class="no-tasks">${message}</p></div>`;
    } else {
        const placeholder = tasksContainer.querySelector(".column-feedback");
        if (placeholder) {
            placeholder.remove();
        }
    }
}

/**
 * Assigns a task to its corresponding column in the task board by creating
 * a task element and updating its content based on the task's details,
 * including subtasks and their progress.
 *
 * @function
 * @param {Object} task - The task object to assign to a column.
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {Array} task.addedSubtasks - The subtasks associated with the task.
 * @param {string} task.status - The current status of the task.
 * @returns {void}
 */
function assignTaskToColumn(task) {
    const taskDiv = createTaskElement(task);
    const { subtasksDisplay, progressPercentage } = createSubtasksDisplay(task);
    taskDiv.innerHTML = createTaskHTML(task, subtasksDisplay, progressPercentage);

    setCategoryColor(taskDiv.querySelector(".task-category"), task.category);
    insertContactIcons(taskDiv, task);
    addProgressBarIfSubtasks(taskDiv, task, progressPercentage);
    assignTaskToContainer(taskDiv, task.status);
    setTaskAttributes(taskDiv, task);
}

/**
 * Creates a new HTML div element representing a task.
 *
 * @function
 * @param {Object} task - The task object for which to create the element.
 * @returns {HTMLElement} The created div element representing the task.
 */
function createTaskElement(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    return taskDiv;
}

/**
 * Inserts contact icons into the task footer of the specified task element.
 *
 * @function
 * @param {HTMLElement} taskDiv - The HTML element representing the task.
 * @param {Object} task - The task object containing contact information.
 */
function insertContactIcons(taskDiv, task) {
    const contactIcons = createContactIcons(task);
    const taskFooter = taskDiv.querySelector(".task-footer");
    if (taskFooter) {
        taskFooter.insertBefore(contactIcons, taskFooter.firstChild);
    }
}

/**
 * Sets the necessary attributes for the task element, including draggable
 * functionality and an onclick event to open task details.
 *
 * @function
 * @param {HTMLElement} taskDiv - The HTML element representing the task.
 * @param {Object} task - The task object containing task details.
 */
function setTaskAttributes(taskDiv, task) {
    taskDiv.setAttribute("draggable", true);
    taskDiv.setAttribute("onclick", `openTaskDetail('${task.id}')`);
    taskDiv.id = `task-${task.id}`;
}

/**
 * Creates the HTML string for a task element using the provided details.
 *
 * @function
 * @param {Object} task - The task object containing task details.
 * @param {string} subtasksDisplay - A string displaying the subtasks count.
 * @param {number} progressPercentage - The percentage of completed subtasks.
 * @returns {string} The HTML string representation of the task element.
 */
function createTaskHTML(task, subtasksDisplay, progressPercentage) {
    const priorityImage = getPriorityImage(task.priority);
    return getTaskHTMLTemplate(task, subtasksDisplay, progressPercentage, priorityImage);
}

/**
 * Returns the file path for the priority image based on the task's priority level.
 *
 * @function
 * @param {string} priority - The priority level of the task ('low', 'medium', or 'urgent').
 * @returns {string} The file path of the corresponding priority image.
 */
function getPriorityImage(priority) {
    switch (priority) {
        case "low":
            return "/img/lowPrio.png";
        case "medium":
            return "/img/mediumPrio.png";
        case "urgent":
            return "/img/highPrio.png";
        default:
            return "";
    }
}

/**
 * Appends a task element to the appropriate container based on its status.
 *
 * @function
 * @param {HTMLElement} taskDiv - The task element to be added to the container.
 * @param {string} taskStatus - The current status of the task (e.g., 'to do', 'in progress', 'done').
 */
function assignTaskToContainer(taskDiv, taskStatus) {
    const taskContainer = getColumnByStatus(taskStatus);
    if (taskContainer) {
        taskContainer.appendChild(taskDiv);
    }
}

/**
 * Creates a display string for the number of completed and total subtasks,
 * as well as calculates the progress percentage.
 *
 * @function
 * @param {Object} task - The task object containing subtasks.
 * @param {Array} task.addedSubtasks - The array of subtasks associated with the task.
 * @returns {Object} An object containing:
 *   - {string} subtasksDisplay - A string showing the completed and total subtasks (e.g., "2/5 Subtasks").
 *   - {number} progressPercentage - The percentage of completed subtasks.
 */
function createSubtasksDisplay(task) {
    const totalSubtasks = task.addedSubtasks ? task.addedSubtasks.length : 0;
    const completedSubtasks = task.addedSubtasks ? task.addedSubtasks.filter((subtaskObj) => subtaskObj.status === "checked").length : 0;

    const subtasksDisplay = totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks} Subtasks` : "";
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return {
        subtasksDisplay,
        progressPercentage,
    };
}

/**
 * Updates the progress bar display based on the subtasks of a task.
 * If subtasks exist, it sets the width of the progress bar and displays it.
 * If there are no subtasks, it hides the subtasks container.
 *
 * @function
 * @param {HTMLElement} taskDiv - The DOM element representing the task.
 * @param {Object} task - The task object containing subtasks.
 * @param {Array} task.addedSubtasks - The array of subtasks associated with the task.
 */
function addProgressBarIfSubtasks(taskDiv, task) {
    const subtasksContainer = taskDiv.querySelector(".task-subtasks-container");
    const { subtasksDisplay, progressPercentage } = createSubtasksDisplay(task);

    if (task.addedSubtasks && task.addedSubtasks.length > 0) {
        const progressBar = subtasksContainer.querySelector(".task-progress");
        progressBar.style.width = `${progressPercentage}%`;
        subtasksContainer.style.display = "flex";
    } else {
        subtasksContainer.style.display = "none";
    }
}

/**
 * Creates a container of contact icons based on the task's assigned users.
 * Each icon is created using the user's name and associated color.
 *
 * @function
 * @param {Object} task - The task object containing user information.
 * @param {string[]} task.name - An array of user names assigned to the task.
 * @param {string[]} task.color - An array of colors corresponding to each user.
 * @param {string} [size='small'] - The size of the contact icons (default is 'small').
 * @returns {HTMLElement} The container element with user icons.
 */
function createContactIcons(task, size = "small") {
    const iconsContainer = document.createElement("div");
    iconsContainer.className = "contact-icons-container";

    if (Array.isArray(task.name) && Array.isArray(task.color) && task.name.length === task.color.length) {
        task.name.forEach((userName, index) => {
            const userColor = task.color[index];
            const icon = createContactIcon(userName, userColor, size);
            iconsContainer.appendChild(icon);
        });
    }
    return iconsContainer;
}

/**
 * Retrieves the task container element based on the provided task status.
 *
 * @function
 * @param {string} status - The status of the task, which can be one of the following:
 * 'todo', 'in-progress', 'await-feedback', or 'done'.
 * @returns {HTMLElement|null} The corresponding tasks container element or null if the status is invalid.
 */
function getColumnByStatus(status) {
    if (status === "todo") {
        return document.querySelector("#toDoColumn .tasks-container");
    } else if (status === "in-progress") {
        return document.querySelector("#inProgressColumn .tasks-container");
    } else if (status === "await-feedback") {
        return document.querySelector("#awaitFeedbackColumn .tasks-container");
    } else if (status === "done") {
        return document.querySelector("#doneColumn .tasks-container");
    }
    return null;
}

/**
 * Sets the color category class on a given element based on the task category.
 *
 * @function
 * @param {HTMLElement} element - The element to which the category class will be added.
 * @param {string} category - The category of the task, which can be 'User Story', 'Technical Task', or any other category.
 */
function setCategoryColor(element, category) {
    if (category === "User Story") {
        element.classList.add("category-user-story");
    } else if (category === "Technical Task") {
        element.classList.add("category-technical-task");
    } else {
        element.classList.add("category-default");
    }
}

/**
 * Displays the filtered tasks in their respective columns.
 *
 * Clears the task containers in each column and populates them with the provided filtered tasks.
 *
 * @function
 * @param {Array} filteredTasks - An array of tasks to display, where each task is an object containing task details.
 */
function displayFilteredTasks(filteredTasks) {
    document.querySelector("#toDoColumn .tasks-container").innerHTML = "";
    document.querySelector("#inProgressColumn .tasks-container").innerHTML = "";
    document.querySelector("#awaitFeedbackColumn .tasks-container").innerHTML = "";
    document.querySelector("#doneColumn .tasks-container").innerHTML = "";
    filteredTasks.forEach((task) => {
        assignTaskToColumn(task);
    });
    addDragAndDropListeners();
}

/**
 * Creates and displays the details of a task in the task details container.
 *
 * This function populates the task details section with information such as the assigned user icons,
 * task category, title, description, due date, priority, and subtasks.
 * It also sets up the edit and delete buttons for the task.
 *
 * @function
 * @param {Object} task - The task object containing details about the task.
 * @param {string} task.id - The unique identifier for the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.taskDescription - A description of the task.
 * @param {string} task.date - The due date of the task.
 * @param {string} task.priority - The priority level of the task (e.g., low, medium, urgent).
 * @param {Array} task.addedSubtasks - An array of subtasks associated with the task.
 * @param {string} task.category - The category of the task (e.g., User Story, Technical Task).
 */
function createTaskDetail(task) {
    const taskDetails = document.getElementById("taskDetails");
    if (!taskDetails) return;
    const iconsContainer = createUserIconsContainer(task);
    appendUserIcons(task, iconsContainer);

    const assignedUserContainer = document.querySelector(".assignedUser");
    if (assignedUserContainer) {
        assignedUserContainer.appendChild(iconsContainer);
    }
    const taskDetailHTML = createTaskDetailDiv(iconsContainer, task.category, task.title, task.taskDescription, task.date, task.priority, task.addedSubtasks, renderSubtasks(task.addedSubtasks, task.id), task.id);
    taskDetails.innerHTML = taskDetailHTML;
    setCategoryColor(document.querySelector("#taskDetails .task-category"), task.category);
    setupEditAndDeleteButtons(task);
}

/**
 * Creates a container element for user icons associated with a task.
 *
 * This function generates a div element that will hold the user icons
 * representing the individuals assigned to the task.
 *
 * @function
 * @param {Object} task - The task object containing details about the task.
 * @returns {HTMLDivElement} The div element that serves as the container for user icons.
 */
function createUserIconsContainer(task) {
    return document.createElement("div");
}

/**
 * Appends user icons and names to a specified container for a given task.
 *
 * This function iterates over the assigned users of a task, creating
 * contact icons and appending them to the provided container along with
 * the corresponding user names.
 *
 * @function
 * @param {Object} task - The task object containing user details.
 * @param {HTMLDivElement} iconsContainer - The container to which user icons and names will be appended.
 */
function appendUserIcons(task, iconsContainer) {
    task.name.forEach((userName, index) => {
        const userColor = task.color[index];
        const icon = createContactIcon(userName, userColor, "medium");
        const contactDiv = document.createElement("div");
        contactDiv.className = "contact-detail";
        contactDiv.appendChild(icon);
        const nameSpan = document.createElement("span");
        nameSpan.textContent = userName;
        contactDiv.appendChild(nameSpan);
        iconsContainer.appendChild(contactDiv);
    });
}

/**
 * Sets up event handlers for the edit and delete buttons associated with a task.
 *
 * This function retrieves the edit and delete buttons from the DOM and
 * assigns the corresponding event handlers to execute editing or deleting
 * the specified task when the buttons are clicked.
 *
 * @function
 * @param {Object} task - The task object for which the buttons will be set up.
 * @param {string} task.id - The unique identifier of the task to be edited or deleted.
 */
// function setupEditAndDeleteButtons(task) {
//     const editButton = document.getElementById("editButton");
//     const deleteButton = document.getElementById("deleteButton");
//     if (editButton && deleteButton) {
//         //     editButton.onclick = () => editTask(task.id); // // }
//         //     deleteButton.onclick = () => handleDeleteTask(task.id);
//         // if (editButton) {
//         //     editButton.onclick = () => editTask(task);
//         //     loadAddTaskScript(); // Übergibt das gesamte Task-Objekt
//         //     editButton.onclick = () => loadAddTaskScript();
//         // }
//         if (deleteButton) {
//             deleteButton.onclick = () => handleDeleteTask(task.id);
//         }
//     }
//     // }
// }

function setupEditAndDeleteButtons(task) {
    const deleteButton = document.getElementById("deleteButton");

    // Check if the delete button exists before assigning the event
    if (deleteButton) {
        // Remove any existing event listeners to avoid multiple calls
        deleteButton.onclick = null;

        // Assign the new event listener for deleting the task
        deleteButton.onclick = () => handleDeleteTask(task.id);
    }
}

/**
 * Closes the task details view by setting its display style to 'none'.
 *
 * This function hides the task details section from the user interface.
 *
 * @function
 */
function closeTaskDetails() {
    const taskDetails = document.getElementById("taskDetailsOverlay");
    taskDetails.classList.remove("task-details-slideIn");
    taskDetails.classList.add("task-details-slideOut");

    taskDetails.addEventListener(
        "animationend",
        () => {
            taskDetails.style.display = "none";
            taskDetails.classList.remove("task-details-slideOut");
        },
        { once: true }
    );
}

/**
 * Renders the HTML for the subtasks of a given task.
 *
 * @param {Array} subtasks - The array of subtasks associated with the task.
 * @param {string} taskId - The ID of the task to which the subtasks belong.
 * @returns {string} The HTML representation of the subtasks, or a message if no subtasks are present.
 *
 * This function generates HTML for each subtask in the provided array and returns it as a single string.
 * If no subtasks are provided, it returns a message indicating that no subtasks have been added.
 */

function renderSubtasks(subtasks, taskId) {
    if (!subtasks || subtasks.length === 0) return "<p>No subtasks added</p>";

    return subtasks.map((subtaskObj, index) => createSubtaskHTML(subtaskObj, taskId, index)).join("");
}

/**
 * Updates the progress percentage of a given task based on its subtasks.
 *
 * @param {Object} task - The task object containing subtasks.
 * @property {Array} task.addedSubtasks - The list of subtasks associated with the task.
 *
 * This function calculates the progress percentage of the task by determining
 * the total number of subtasks and how many of them are completed (checked).
 * The progress percentage is calculated as a value between 0 and 100.
 */
function updateTaskProgress(task) {
    const totalSubtasks = task.addedSubtasks.length;
    const completedSubtasks = task.addedSubtasks.filter((subtask) => subtask.status === "checked").length;
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
}

/**
 * Displays a confirmation dialog for deleting a task.
 *
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to true if the user confirms the deletion,
 *                              or false if the user cancels.
 *
 * This function creates a modal overlay and a confirmation dialog,
 * appending them to the document body. It uses the provided taskId to identify
 * which task is being confirmed for deletion. The user can then confirm or cancel the action,
 * and the corresponding boolean result is resolved.
 */
function showDeleteConfirmation(taskId) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.classList.add("delete-overlay");

        const confirmationDiv = document.createElement("div");
        confirmationDiv.classList.add("deleteConfirmationDiv");
        confirmationDiv.innerHTML = createDeleteConfirmationHTML();

        document.body.appendChild(overlay);
        document.body.appendChild(confirmationDiv);

        attachConfirmationHandlers(confirmationDiv, resolve);
    });
}
