let taskEditId;
let taskEditTitle;
let taskEditDescription;

/**
 * Generates the HTML template for a task.
 *
 * @param {Object} task - The task object containing task details.
 * @param {string} subtasksDisplay - A string representing the subtasks display (e.g., "2/5 Subtasks").
 * @param {number} progressPercentage - The progress percentage of the subtasks.
 * @param {string} priorityImage - The URL of the image representing the task's priority.
 * @returns {string} The HTML string representing the task.
 *
 * This function creates a string of HTML representing a task, including its
 * category, title, description, subtasks display, progress bar, and priority icon.
 */
function getTaskHTMLTemplate(task, subtasksDisplay, progressPercentage, priorityImage) {
    return `
        <span class="task-category">${task.category}</span>
        <h4>${task.title}</h4>
        <p class="task-description">${task.taskDescription}</p>
        
        <div class="task-subtasks-container">
            <div class="task-progress-bar">
                <div class="task-progress" style="width: ${progressPercentage}%"></div>
            </div>
            <p class="task-subtasks">${subtasksDisplay}</p>
        </div>

        <div class="task-footer">
            <img src="${priorityImage}" alt="${task.priority} Priority" class="task-priority-icon">
        </div>
    `;
}

/**
 * Creates a detailed HTML div for displaying task information.
 *
 * @param {HTMLElement} contactIcons - The HTML elements representing contact icons assigned to the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - A brief description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} priority - The priority level of the task.
 * @param {Array<string>} addedSubtasks - An array of strings representing the added subtasks.
 * @param {string} renderedSubtasks - The HTML string for rendering the subtasks.
 * @returns {string} An HTML string representing the task details div.
 */
function createTaskDetailDiv(contactIcons, category, title, description, dueDate, priority, addedSubtasks, renderedSubtasks, taskId) {
    return /*html*/ `
        <div id="taskDetailsOverlay">
        <div class="taskDetailsDiv">
            <div class="categorieAndCloseButton">
                <span class="task-category">${category}</span>
                <div class="closeButtonDiv" onclick="closeTaskDetails()">
                    <img src="/img/board/assets/icons/closeBtn.png" alt="Close Button">
                </div>
            </div>
            <div class="taskDetailsContent">
            <div class="detailSection">
                <h2 class="titleTaskOverlayH2">${title}</h2>
                <span class="descriptionSpan">${description}</span><br>
                <div class="dueDateDiv">Due date: <span>${dueDate}</span></div>
                <div class="taskPriority">
                    <div>Priority:</div>
                    <div class="priorityTextAndIcon">
                        <span>${priority}</span>
                        <img src="${getPriorityImage(priority)}" alt="Priority Icon">
                    </div>
                </div>
                <div class="taskDetailsInfo">
                    <div class="assignedUsersInTaskDetails">
                        <div><span>Assigned To:</span></div>
                        <div class="sectionAssignedUsers">
                        <div class="assignedUser">
                        ${contactIcons.outerHTML}
                           
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="subtaskSection">
                <div><span>Subtasks</span></div>
                <div class="addedSubtasksDiv">${renderedSubtasks}</div>
            </div>
            </div>
            <div class="task-detail-btn-group">
                <button class="btn-edit" id="editButton" onclick="handleEditButtonClick('${taskId}'); checkEditTaskChanges()">                    
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                    </svg>
                    Edit
                </button>
                <div class="deleteEditSeperator"></div>
                <button class="btn-edit" id="deleteButton">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Creates an HTML string for a subtask checkbox element.
 *
 * @param {Object} subtaskObj - An object representing the subtask.
 * @param {string} subtaskObj.subtask - The name or description of the subtask.
 * @param {string} subtaskObj.status - The current status of the subtask ('checked' or 'unchecked').
 * @param {string} taskId - The ID of the parent task to which the subtask belongs.
 * @param {number} index - The index of the subtask in the list.
 * @returns {string} An HTML string representing a checkbox for the subtask.
 */
function createSubtaskHTML(subtaskObj, taskId, index) {
    return `
        <label for="subtask-${index}">
            <input class="input-checkbox" type="checkbox" id="subtask-${index}" 
                ${subtaskObj.status === "checked" ? "checked" : ""} 
                onclick="toggleSubtaskStatus('${taskId}', ${index})"> 
            <span class="custom-checkbox"></span>${subtaskObj.subtask}
        </label>
    `;
}

/**
 * Creates an HTML string for a delete confirmation dialog.
 *
 * @returns {string} An HTML string representing the delete confirmation dialog.
 */
function createDeleteConfirmationHTML() {
    return `
        <div class="confirmationText">Delete task?</div>
        <div class="confirmationButtons">
            <button class="yesButton">Yes</button>
            <button class="noButton">No</button>
        </div>
    `;
}
