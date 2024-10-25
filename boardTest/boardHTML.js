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
 * Displays a task creation form in the board.
 */
function createTaskFromBoardDiv() {
    return /*html*/ `
    <div id="task-form-overlay">
    <div class="floating-task-container">
    <div id="h1-container"><h1>Add Task</h1></div>
    <div class="close-add-task-form" onclick="closeAddTaskForm()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.9998 8.40005L2.0998 13.3C1.91647 13.4834 1.68314 13.575 1.3998 13.575C1.11647 13.575 0.883138 13.4834 0.699805 13.3C0.516471 13.1167 0.424805 12.8834 0.424805 12.6C0.424805 12.3167 0.516471 12.0834 0.699805 11.9L5.5998 7.00005L0.699805 2.10005C0.516471 1.91672 0.424805 1.68338 0.424805 1.40005C0.424805 1.11672 0.516471 0.883382 0.699805 0.700049C0.883138 0.516715 1.11647 0.425049 1.3998 0.425049C1.68314 0.425049 1.91647 0.516715 2.0998 0.700049L6.9998 5.60005L11.8998 0.700049C12.0831 0.516715 12.3165 0.425049 12.5998 0.425049C12.8831 0.425049 13.1165 0.516715 13.2998 0.700049C13.4831 0.883382 13.5748 1.11672 13.5748 1.40005C13.5748 1.68338 13.4831 1.91672 13.2998 2.10005L8.3998 7.00005L13.2998 11.9C13.4831 12.0834 13.5748 12.3167 13.5748 12.6C13.5748 12.8834 13.4831 13.1167 13.2998 13.3C13.1165 13.4834 12.8831 13.575 12.5998 13.575C12.3165 13.575 12.0831 13.4834 11.8998 13.3L6.9998 8.40005Z" fill="white"/>
                    </svg>
            </div>
        <div id="content-box-container">
            <div id="content-box-left" class="flex-column">
                <div id="title-container" class="flex-column gap8px">
                    <div class="subtitle">Title<span class="asterisk">*</span></div>
                    <div id="title-input-container"><input type="text" placeholder="Enter a title" id="title-input" /></div>
                    <span id="missing-title-message" class="validationStyle d-none">This field is required</span>
                </div>
                <div id="description-container" class="flex-column gap8px">
                    <div class="subtitle">Description</div>
                    <div id="textarea-container" class="flex-column"><textarea placeholder="Enter a Description" id="textarea-input"></textarea></div>
                </div>
                <div id="assigned-container" class="flex-column gap8px">
                    <div class="subtitle">Assigned to</div>
                    <div id="selected-name" class="select-container" onclick="checkIfContactsDropdownIsVisible();matchTaskAssignedUserToCheckedDropdown()">
                        <span id="assigned-placeholder">Select contacts to assign</span>
                        <div id="contacts-dropwdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>
                    </div>
                    <div id="dropdown-list" class="d-none"></div>
                    <div id="selected-contacts-circle-container"></div>
                </div>
            </div>
            <div id="border-container"></div>
            <div id="content-box-right" class="flex-column">
                <div id="date-container" class="flex-column gap8px">
                    <div class="subtitle">Due date<span class="asterisk">*</span></div>
                    <div id="calender"><input type="date" id="date-input" /></div>
                    <span id="missing-date-message" class="validationStyle d-none">This field is required</span>
                </div>
                <div id="prio-container" class="flex-column gap8px">
                    <div class="subtitle">Prio</div>
                    <div id="choose-prio-container">
                        <button class="choose-prio-button flex-center-align" id="prio-urgent-button" type="button" onclick="choosePrio('urgent')">
                            <span id="prio-urgent" class="flex-center-align">Urgent </span>
                            <svg class="prio-urgent-arrows" id="prio-urgent-arrows" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                        <button class="choose-prio-button flex-center-align prio-medium-button-bg-color" id="prio-medium-button" type="button" onclick="choosePrio('medium')">
                            <span id="prio-medium" class="flex-center-align">Medium </span>
                            <svg class="prio-medium-arrows" id="prio-medium-arrows" width="21" height="8" viewBox="0 0 21 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_228141_4295)">
                                    <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="currentColor" />
                                    <path
                                        d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"
                                        fill="currentColor"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_228141_4295">
                                        <rect width="20" height="7.45098" fill="currentColor" transform="translate(0.248535 0.274414)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button class="choose-prio-button flex-center-align" id="prio-low-button" type="button" onclick="choosePrio('low')">
                            <span id="prio-low" class="flex-center-align"> Low </span>
                            <svg class="prio-low-arrows" id="prio-low-arrows" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="category-container" class="flex-column gap8px">
                    <div class="subtitle">Category<span class="asterisk">*</span></div>
                    <div id="selected-category" class="select-container" onclick="showCategoryDropDown()">
                        <span id="category-placeholder">Select task category</span>
                        <div id="category-dropdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>
                    </div>
                    <span id="missing-category-message" class="validationStyle d-none">This field is required</span>
                    <div id="category-dropdown-list" class="d-none"></div>
                </div>
                <div id="substasks-container" class="flex-column gap8px">
                    <div class="subtitle">Subtasks</div>
                    <div id="subtask-relative-container">
                        <div id="new-subtask-container" onclick="addOrCloseSubtask()">
                            <input type="text" id="new-subtask-input" placeholder="Add new subtask" />
                            <div id="subtask-icon-container">
                                <div id="plus-icon-container" class="circleHoverEffect"><img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" /></div>
                            </div>
                        </div>
                        <span id="missing-subtask-message" class="validationStyleSubtasks d-none">This field is required</span>
                    </div>
                    <div id="new-subtask-list-container"><div id="generated-subtask-list-container"></div></div>
                </div>
            </div>
            
        </div>
        <div id="interactives-buttons-and-required-container">
            <div id="required-container">
                <span id="required-span"><span class="asterisk">*</span>This field is required</span>
            </div>
            <div id="interactives-buttons-container">
                <button id="clear-button" class="flex-center-align" type="button" onclick="clearFields()"><span id="clear-button-font" class="contents">Clear</span> <img src="/img/Vector.png" id="cancel-icon" /></button>
                <button id="create-button" class="flex-center-align" type="button" onclick="createTask(); checkInputFields()"><span id="create-task-button-font" class="contents">Create Task</span><img src="/img/summary/check.png" id="check-icon" /></button>
            </div>
        </div>
    </div>
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
            <div class="task-detail-btn-group">
                <button class="btn-edit" id="editButton" onclick="handleEditButtonClick('${taskId}')">                    
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

function templateSubtasksListEditTaskHTML(subtaskObj, taskId, index) {
    console.log("Subtask Object:", subtaskObj); // Log zur Überprüfung

    return /*html*/ `
        <div class="generatedSubtasks" id="generated-subtask-container-${taskId}-${index}">
            <li id="generated-subtask-list-item-${taskId}-${index}" class="subtaskListItemStyle">
                <input type="text" value="${subtaskObj.subtask}" id="subtask-input-${taskId}-${index}" />
            </li>
            <div id="generated-subtask-list-icons">
                <div id="edit-icon-container" onclick="editSubtask(${taskId}, ${index})">
                    <img src="/img/addTask/edit.png" alt="edit" />
                </div>
                <div class="border-subtask-container"></div>
                <div id="delete-icon-container" onclick="deleteSubtask(${taskId}, ${index})">
                    <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                </div>
            </div>
        </div>
    `;
}

// function templateSubtasksListEditTaskHTML(subtaskObj, taskId, index) {
//     return /*html*/ `
//             <div class="generatedSubtasks" id="generated-subtask-container-${taskId}">
//                 <li id="generated-subtask-list-item-${taskId}" class="subtaskListItemStyle">${subtaskObj}</li>
//                 <div id="generated-subtask-list-icons">     
//                     <div id="edit-icon-container" onclick="editSubtask(${taskId})"><img src="/img/addTask/edit.png" alt="edit" /></div>
//                     <div class="border-subtask-container"></div>
//                     <div id="delete-icon-container" onclick="deleteSubtask(${taskId})">
//                         <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
//                     </div>
//                 </div>
//             </div>`;
// }

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

// async function editTask(title, description, date, category, subtasks) {
//     loadEditTask(title, description, date, category, subtasks);
//     await loadAddTaskScript();
// }

// function loadSubtasks() { }

// function loadPrio() { }

// function loadEditTask(title, description, date, category, subtasks) {
//     loadEditTaskHTML(title, description, date, category, subtasks);
// }

function handleEditButtonClick(taskId) {
    const taskToEdit = tasksArray.find(task => task.id === taskId);

    if (taskToEdit) {
        editTask(taskToEdit);
    } else {
        console.error("Aufgabe nicht gefunden!");
    }
}

// function editTask(task) {
//     loadEditTaskHTML(task.category, task.title, task.taskDescription, task.date, task.priority, task.addedSubtasks, renderEditableSubtasks(task.addedSubtasks, task.id), task.id);
//     loadAddTaskScript();
// }

function editTask(task) {
    const editTask = document.getElementById("editTask");
    if (!editTask) {
        console.error("Edit-Overlay nicht gefunden");
        return;
    }
    editTask.innerHTML = loadEditTaskHTML(task.category, task.title, task.taskDescription, task.date, task.priority, task.addedSubtasks, renderEditableSubtasks(task.addedSubtasks, task.id), task.id);

    const iconsContainer = document.querySelector("#selected-contacts-circle-container");
    if (iconsContainer) {
        appendEditableUserIcons(task, iconsContainer);
    } else {
        console.error("Icons-Container nicht gefunden");
    }
    loadAddTaskScript();
    taskEditId = task.id;
    taskEditTitle = task.title;
    taskEditDescription = task.taskDescription;
}


function loadEditTaskHTML(category, title, description, date, priority, subtasks, renderedSubtasks, taskId) {
    // const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
    // if (!taskDetailsOverlay) return;

    // taskDetailsOverlay.innerHTML = /*html*/ ` 
    return /*html*/` 
    <div id="editTaskOverlay" class="edit-task-overlay">
<div id="content-box-container-edit-task">
   <div class="closeButton">
      <div class="closeButtonDiv" onclick="closeEditTask()">
         <img src="/img/board/assets/icons/closeBtn.png" alt="Close Button">
      </div>
   </div>
   <div id="content-box-left" class="flex-column">
      <div id="title-container" class="flex-column gap8px">
         <div class="subtitle">Title<span class="asterisk">*</span></div>
         <div id="title-input-container">
            <input type="text" placeholder="Enter a title" id="title-input" value="${title}" />
            <span id="missing-title-message" class="validationStyle" style="display: none">This field is required</span>
         </div>
      </div>
      <div id="description-container" class="flex-column gap8px">
         <div class="subtitle">Description</div>
         <div id="textarea-container" class="flex-column"><textarea placeholder="Enter a Description" id="textarea-input">${description}</textarea></div>
      </div>
      <div id="assigned-container" class="flex-column gap8px">
         <div class="subtitle">Assigned to</div>
         <div id="selected-name" class="select-container" onclick="checkIfContactsDropdownIsVisible();matchTaskAssignedUserToCheckedDropdown()">    <!-- added second function by Andrej Homann for board=>task-detail=>edit=>contact-dropwdown=>checked-checkbox-for-assigned-contacts -->
            <span id="assigned-placeholder">Select contacts to assign</span>
            <div id="contacts-dropwdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>
         </div>
         <div id="dropdown-list" class="d-none"></div>
         <div id="selected-contacts-circle-container"></div>
      </div>
   </div>
   <div id="border-container"></div>
   <div id="content-box-right" class="flex-column">
      <div id="date-container" class="flex-column gap8px">
         <div class="subtitle">Due date<span class="asterisk">*</span></div>
         <div id="calender">
            <input type="date" id="date-input" value="${date}" />
            <span id="missing-date-message" class="validationStyle" style="display: none">This field is required</span>
         </div>
      </div>
      <div id="prio-container" class="flex-column gap8px">
         <div class="subtitle">Prio</div>
         <div id="choose-prio-container">
            <button class="choose-prio-button flex-center-align" id="prio-urgent-button" type="button" onclick="choosePrio('urgent')">
               <span id="prio-urgent" class="flex-center-align">Urgent </span>
               <svg class="prio-urgent-arrows" id="prio-urgent-arrows" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"
                     fill="currentColor"
                     />
                  <path
                     d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"
                     fill="currentColor"
                     />
               </svg>
            </button>
            <button class="choose-prio-button flex-center-align prio-medium-button-bg-color" id="prio-medium-button" type="button" onclick="choosePrio('medium')">
               <span id="prio-medium" class="flex-center-align">Medium </span>
               <svg class="prio-medium-arrows" id="prio-medium-arrows" width="21" height="8" viewBox="0 0 21 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_228141_4295)">
                     <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="currentColor" />
                     <path d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z" fill="currentColor" />
                  </g>
                  <defs>
                     <clipPath id="clip0_228141_4295">
                        <rect width="20" height="7.45098" fill="currentColor" transform="translate(0.248535 0.274414)" />
                     </clipPath>
                  </defs>
               </svg>
            </button>
            <button class="choose-prio-button flex-center-align" id="prio-low-button" type="button" onclick="choosePrio('low')">
               <span id="prio-low" class="flex-center-align"> Low </span>
               <svg class="prio-low-arrows" id="prio-low-arrows" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"
                     fill="currentColor"
                     />
                  <path
                     d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z"
                     fill="currentColor"
                     />
               </svg>
            </button>
         </div>
      </div>
      <div id="category-container" class="flex-column gap8px">
         <div class="subtitle">Category<span class="asterisk">*</span></div>
         <div id="selected-category" class="select-container" onclick="checkIfCategoryDropdownIsVisible(), doNotCloseDropdown(event)">
            <span id="category-placeholder">${category}</span>
            <div id="category-dropdown-arrow-container">
               <img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" />
            </div>
         </div>
         <span id="missing-category-message" class="validationStyle" style="display: none">This field is required</span>
         <div id="category-dropdown-list" class="d-none"></div>
      </div>
      <div id="substasks-container" class="flex-column gap8px">
         <div class="subtitle">Subtasks</div>
         <div id="subtask-relative-container">
            <div id="new-subtask-container" onclick="addOrCloseSubtask()">
               <input type="text" id="new-subtask-input" placeholder="Add new subtask" />
               <div id="subtask-icon-container">
                  <div id="plus-icon-container" class="circleHoverEffect"><img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" /></div>
               </div>
            </div>
            <span id="missing-subtask-message" class="validationStyleSubtasks" style="display: none">This field is required</span>
         </div>
         <div id="new-subtask-list-container">
            <div id="generated-subtask-list-container">${renderedSubtasks}</div>
         </div>
      </div>
   </div>
   <div id="ok-edittask-button-container"><div id="ok-edittask-button"><div >Ok</div><img src="/img/addTask/check.png" alt=""></div></div>
</div>
</div>
`;
}