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
    if (task.name && task.color && task.name.length > 0) {
        task.name.forEach((userName, index) => {
            const userColor = task.color[index];
            createAndAppendUserIcon(userName, userColor, iconsContainer);
        });
    } else {
        showNoUserMessage(iconsContainer);
    }
}

/**
 * Creates a user icon and appends it, along with the user's name, to the given container.
 *
 * This function first creates a contact icon using the `createContactIcon` function. It then creates a
 * `div` element to wrap the icon and the user's name. The wrapped elements are appended to the provided
 * `iconsContainer`.
 *
 * @param {string} userName - The name of the user to display on the icon.
 * @param {string} userColor - The color associated with the user, used to style the icon.
 * @param {HTMLElement} iconsContainer - The DOM element where the user icon and name will be appended.
 */
function createAndAppendUserIcon(userName, userColor, iconsContainer) {
    const icon = createContactIcon(userName, userColor, "medium");
    const contactDiv = document.createElement("div");
    contactDiv.className = "contact-detail";
    contactDiv.appendChild(icon);
    const nameSpan = document.createElement("span");
    nameSpan.textContent = userName;
    contactDiv.appendChild(nameSpan);
    iconsContainer.appendChild(contactDiv);
}

/**
 * Displays a message indicating no users are currently assigned to the task.
 *
 * This function creates and appends a message element to the given container,
 * informing that no user has been assigned to the task.
 *
 * @param {HTMLElement} iconsContainer - The DOM element where the "no user" message will be appended.
 */
function showNoUserMessage(iconsContainer) {
    const noUserMessage = document.createElement("div");
    noUserMessage.className = "no-user-message";
    noUserMessage.textContent = "currently no user assigned";
    iconsContainer.appendChild(noUserMessage);
}

/**
 * Appends editable user icons to a container based on the task's assigned contacts.
 *
 * This function dynamically creates and appends contact icons to the given container
 * based on the list of assigned contacts in the task within the function createVisibleContacts(). It displays a maximum of 6 icons
 * and appends a text element showing the number of remaining contacts if there are more than 6 within the function limitNumberOfVisibleContacts().
 * Additionally, it adjusts the height of the container to fit the icons.
 *
 * @param {Object} task - The task object containing the assigned contact names and colors.
 * @param {Array} task.name - The list of contact names assigned to the task.
 * @param {Array} task.color - The list of corresponding contact colors.
 * @param {HTMLElement} iconsContainer - The DOM element where the contact icons will be appended.
 */
function appendEditableUserIcons(task, iconsContainer) {
    const maxIcons = 6;
    if (iconsContainer.innerHTML === "" && task.name && task.color && task.name.length > 0) {
        const size = "micro";
        createVisibleContacts(task, maxIcons, size, iconsContainer);

        if (task.name.length > maxIcons) {
            const remainingText = limitNumberOfVisibleContacts(task, maxIcons)
            iconsContainer.appendChild(remainingText);
        }
        document.getElementById("edit-assigned-container").classList.add("heightAuto");
    }
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
    const confirmationDiv = document.querySelector(".deleteConfirmationDiv");
    taskDetails.classList.remove("task-details-slideIn");
    taskDetails.classList.add("task-details-slideOut");
    selectedContacts = [];
    selectedColors = [];

    if (confirmationDiv) {
        closeConfirmationDiv(confirmationDiv);
    }

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
 * Adds a click event listener to the task details overlay.
 *
 * This function attaches the `handleOverlayClick` function as an event listener for
 * click events on the task details overlay. If the overlay exists in the DOM, the
 * click event listener is added.
 */
function addOverlayClickListener() {
    const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
    if (taskDetailsOverlay) {
        taskDetailsOverlay.addEventListener("click", handleOverlayClick);
    }
}

/**
 * Handles the click event on the task details overlay.
 *
 * This function checks if the click occurred on the overlay itself. If so:
 * - It closes the task details overlay by calling `closeTaskDetails()`.
 * - It removes the click event listener from the task details overlay using `removeOverlayClickListener()`.
 * - If the confirmation dialog and delete overlay are visible, it closes the confirmation dialog by calling `closeConfirmationDiv()`.
 *
 * @param {Event} event - The click event object.
 */
function handleOverlayClick(event) {
    const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
    const confirmationDiv = document.querySelector(".deleteConfirmationDiv");
    const deleteOverlay = document.querySelector(".delete-overlay");

    if (event.target === taskDetailsOverlay) {
        closeTaskDetails();
        removeOverlayClickListener();

        if (confirmationDiv && deleteOverlay) {
            closeConfirmationDiv(confirmationDiv);
        }
    }
}

/**
 * Removes the click event listener from the task details overlay.
 *
 * This function checks if the task details overlay element exists, and if so, it removes
 * the previously added click event listener that triggers the `handleOverlayClick` function.
 */
function removeOverlayClickListener() {
    const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
    if (taskDetailsOverlay) {
        taskDetailsOverlay.removeEventListener("click", handleOverlayClick);
    }
}

/**
 * Closes the edit task overlay and resets relevant variables.
 *
 * This function hides the task editing overlay and clears any selected contacts and colors. It also
 * resets the state of whether the contacts dropdown was open for the current task.
 */
function closeEditTask() {
    const editTask = document.getElementById("editTaskOverlay");
    editTask.style.display = "none";
    selectedContacts = [];
    selectedColors = [];
    wasContactsDropdownOpenInCurrentTask = false;
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
