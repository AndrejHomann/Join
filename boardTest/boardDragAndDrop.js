let tasks = document.querySelectorAll(".task");
let columns = document.querySelectorAll(".column");
let placeholder = null;
let longTapTimeout = null;
let isDragging = false;
let isLongTapActive = false;
let startX, startY, task, taskRect;

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
 * Adds the column event listener for drag-and-drop interactions.
 * Reacts to the events `dragover`, `dragleave` and `drop` and calls the corresponding callback functions.
 * calls the corresponding callback functions.
 *
 * @param {NodeList} columns - A list of column elements that should handle drag-and-drop events.
 */
function addDropEventsToColumns(columns) {
    columns.forEach((column) => {
        column.addEventListener("dragover", (event) => handleDragOver(event, column));
        column.addEventListener("dragleave", (event) => handleDragLeave(event, column));
        column.addEventListener("drop", (event) => handleDropEvent(event, column));
    });
}

/**
 * Handles the `dragover` event for a column during a drag-and-drop operation.
 * It prevents the default behavior and adds a placeholder to the target column
 * where the dragged task might be dropped.
 *
 * @param {Event} event - The `dragover` event triggered when a task is dragged over a column.
 * @param {HTMLElement} column - The target column element where the dragged task is being moved.
 */
function handleDragOver(event, column) {
    event.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    if (!draggingTask) return;

    const taskHeight = draggingTask.offsetHeight;
    addPlaceholderToColumn(column, taskHeight);
}

/**
 * Handles the `dragleave` event for a column when a dragged task leaves the column area.
 * It removes the placeholder from the column if the dragged element is no longer inside the column.
 *
 * @param {Event} event - The `dragleave` event triggered when the dragged task leaves a column.
 * @param {HTMLElement} column - The column element from which the dragged task has left.
 */
function handleDragLeave(event, column) {
    const relatedTarget = event.relatedTarget || event.toElement;
    if (!relatedTarget || !column.contains(relatedTarget)) {
        removePlaceholder();
    }
}

/**
 * Handles the `drop` event for a column when a dragged task is dropped onto the column.
 * This function calls the existing `handleDrop` function to handle the task drop and 
 * removes the placeholder after the drop action.
 *
 * @param {Event} event - The `drop` event triggered when a dragged task is dropped onto a column.
 * @param {HTMLElement} column - The column element onto which the task is dropped.
 */
function handleDropEvent(event, column) {
    handleDrop(event, column);
    removePlaceholder();
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

    removePlaceholder();
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
    const tasksContainer = column.querySelector(".tasks-container");

    if (taskElement && placeholder) {
        tasksContainer.insertBefore(taskElement, placeholder);
    } else if (taskElement) {
        tasksContainer.appendChild(taskElement);
    }

    const newStatus = column.getAttribute("data-status");
    updateTaskStatus(taskId, newStatus);
    checkEmptyColumns();
}

/**
 * Adds touch event listeners to all task elements in the board.
 * These event listeners allow for the handling of touch interactions, including the start, 
 * movement, and end of a touch gesture for task dragging and dropping.
 *
 * @fires handleTouchStart - Triggered when the user starts a touch on a task.
 * @fires handleTouchMove - Triggered when the user moves their finger on the task.
 * @fires handleTouchEnd - Triggered when the user ends the touch gesture on a task.
 */
function addTouchListeners() {
    const taskDivs = document.querySelectorAll(".task");
    taskDivs.forEach((task) => {
        task.addEventListener("touchstart", handleTouchStart, { passive: false });
        task.addEventListener("touchmove", handleTouchMove);
        task.addEventListener("touchend", handleTouchEnd);
    });
}

/**
 * Handles the start of a touch event on a task element.
 * This function initializes the touch coordinates, records the initial position of the task,
 * and starts a timeout to detect long taps, which will initiate task dragging.
 *
 * @param {TouchEvent} e - The touch event triggered when the user starts touching a task.
 * @fires startLongTapTimeout - Starts a timeout to detect long taps and initiate dragging.
 */
function handleTouchStart(e) {
    task = e.target.closest(".task");
    if (!task) return;

    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;

    initialTaskPosition = {
        x: task.offsetLeft,
        y: task.offsetTop,
    };

    startLongTapTimeout(task);
}

/**
 * Starts a timeout to detect a long tap on a task element.
 * If the user holds the touch for more than 500ms, it will initiate the drag operation by adding
 * the "dragging" class to the task and changing its z-index for proper visual stacking.
 *
 * @param {Element} task - The task element that the user is interacting with.
 * @memberof module:DragAndDrop
 */
function startLongTapTimeout(task) {
    longTapTimeout = setTimeout(() => {
        isLongTapActive = true;
        isDragging = true;
        task.classList.add("dragging");
        task.style.zIndex = 10;
    }, 500);
}

/**
 * Handles the touch move event to update the position of the task while it's being dragged.
 * It calculates the new position based on touch movement and updates the task's position on the screen.
 * If the long tap is not active, the function will cancel the ongoing timeout to prevent triggering the drag action.
 *
 * @param {TouchEvent} e - The touch event that contains the touch move information.
 * @memberof module:DragAndDrop
 */
function handleTouchMove(e) {
    if (!task) return;

    if (!isLongTapActive) {
        clearTimeout(longTapTimeout);
        return;
    }

    e.preventDefault();

    const { moveX, moveY } = calculateNewTaskPosition(e);
    updateTaskPosition(task, moveX, moveY);
    const targetColumn = findDropTargetColumn(e.changedTouches[0]);
    handlePlaceholder(targetColumn, task.offsetHeight);
}

/**
 * Calculates the new position of the task based on the touch movement.
 * It determines the new X and Y coordinates by comparing the current touch position with the starting touch position,
 * then adds the initial task position to calculate the final position.
 *
 * @param {TouchEvent} e - The touch event that contains the current touch position.
 * @returns {Object} An object containing the new X and Y position of the task.
 * @memberof module:DragAndDrop
 */
function calculateNewTaskPosition(e) {
    let nextX = e.changedTouches[0].clientX;
    let nextY = e.changedTouches[0].clientY;

    return {
        moveX: nextX - startX + initialTaskPosition.x,
        moveY: nextY - startY + initialTaskPosition.y,
    };
}

/**
 * Updates the position of the task element by setting its `left` and `top` CSS properties.
 * The task is positioned absolutely based on the provided X and Y coordinates.
 *
 * @param {HTMLElement} task - The task element whose position is being updated.
 * @param {number} moveX - The new X position to set for the task.
 * @param {number} moveY - The new Y position to set for the task.
 * @memberof module:DragAndDrop
 */
function updateTaskPosition(task, moveX, moveY) {
    task.style.position = "absolute";
    task.style.left = `${moveX}px`;
    task.style.top = `${moveY}px`;
}

/**
 * Manages the placeholder element in the target column based on whether a valid column is found.
 * If a valid target column is provided, a placeholder is added; otherwise, the placeholder is removed.
 *
 * @param {HTMLElement|null} targetColumn - The column where the task is potentially being dropped.
 *                                        If null, the placeholder is removed.
 * @param {number} taskHeight - The height of the task, used to size the placeholder.
 * @memberof module:DragAndDrop
 */
function handlePlaceholder(targetColumn, taskHeight) {
    if (targetColumn) {
        addPlaceholderToColumn(targetColumn, taskHeight);
    } else {
        removePlaceholder();
    }
}

/**
 * Finalizes the touch event for task dragging by resetting the drag state, determining the target column,
 * and placing the task in the appropriate column. It also cleans up any visual feedback and resets relevant state.
 *
 * @param {TouchEvent} e - The touch event that triggered the end of the drag.
 * @memberof module:DragAndDrop
 */
function handleTouchEnd(e) {
    if (!task) return;

    resetTaskDragState();

    const touch = e.changedTouches[0];
    const targetColumn = findDropTargetColumn(touch);

    setColumnHighlight(null);
    handleTaskPlacement(targetColumn);
    cleanupAfterTouchEnd();
}

/**
 * Resets the drag state of the task by clearing the long tap timeout, 
 * removing the dragging class, and resetting the task's z-index and drag flags.
 * This ensures the task's appearance and state are reverted back to normal.
 *
 * @memberof module:DragAndDrop
 */
function resetTaskDragState() {
    clearTimeout(longTapTimeout);
    isLongTapActive = false;
    isDragging = false;
    task.style.zIndex = 0;
    task.classList.remove("dragging");
}

/**
 * Handles the placement of the task by appending it to the appropriate column 
 * and updating its status. If no valid target column is found, the task 
 * will be reset to its initial position.
 * 
 * This function also checks for empty columns and resets the task position 
 * after placing it.
 *
 * @param {Element} targetColumn - The column where the task should be placed.
 * @memberof module:DragAndDrop
 */
function handleTaskPlacement(targetColumn) {
    if (targetColumn) {
        const tasksContainer = targetColumn.querySelector(".tasks-container");
        tasksContainer.appendChild(task);
        const newStatus = targetColumn.getAttribute("data-status");
        updateTaskStatus(task.id, newStatus);
        checkEmptyColumns();

        resetTaskPosition();
    } else {
        resetTaskPosition();
    }
}

/**
 * Resets the position of the task to its initial state by setting the task's 
 * position to "relative" and ensuring its left and top offsets are both 0. 
 * This is used when the task is not placed in a new column or after 
 * completing a drag operation.
 * 
 * @memberof module:DragAndDrop
 */
function resetTaskPosition() {
    task.style.position = "relative";
    task.style.left = "0";
    task.style.top = "0";
}

/**
 * Cleans up after a touch event by resetting the task variable to `null` 
 * and removing any placeholder elements from the DOM. This function 
 * is called after handling the placement of a task.
 * 
 * @memberof module:DragAndDrop
 */
function cleanupAfterTouchEnd() {
    task = null;
    removePlaceholder();
}

/**
 * Highlights the target column by adding the `highlight-drop-zone` 
 * class to it and removes the highlight from all other columns.
 * This is used to visually indicate where the task can be dropped.
 * 
 * @param {HTMLElement} targetColumn - The column element where the task 
 *                                      can potentially be dropped.
 * 
 * @memberof module:DragAndDrop
 */
function setColumnHighlight(targetColumn) {
    const columns = document.querySelectorAll(".board-column");
    columns.forEach((column) => {
        if (column === targetColumn) {
            column.classList.add("highlight-drop-zone");
        } else {
            column.classList.remove("highlight-drop-zone");
        }
    });
}

/**
 * Finds the column element that the touch event is over.
 * The function checks if the touch position is within the boundaries
 * of any column and returns the corresponding column element.
 * 
 * @param {TouchEvent} touch - The touch event object containing the touch 
 *                             coordinates to check against.
 * 
 * @returns {HTMLElement|null} The column element that the touch is over, 
 *                             or `null` if no column is found.
 * 
 * @memberof module:DragAndDrop
 */
function findDropTargetColumn(touch) {
    const columns = document.querySelectorAll(".board-column");
    for (const column of columns) {
        const rect = column.getBoundingClientRect();
        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {
            return column;
        }
    }
    return null;
}

/**
 * Adds a placeholder element to the specified column to indicate where
 * a dragged task would be placed.
 * If the placeholder doesn't exist, it creates one with the specified 
 * height and appends it to the tasks container of the target column.
 * 
 * @param {HTMLElement} targetColumn - The column element where the task 
 *                                     will be dropped.
 * @param {number} taskHeight - The height of the task being dragged, which 
 *                              is used to set the height of the placeholder.
 * 
 * @memberof module:DragAndDrop
 */
function addPlaceholderToColumn(targetColumn, taskHeight) {
    if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.classList.add("task-placeholder");
        placeholder.style.height = taskHeight + "px";
        placeholder.style.width = "252px";
        placeholder.style.marginBottom = "16px";
    }

    const tasksContainer = targetColumn.querySelector(".tasks-container");
    if (tasksContainer && !tasksContainer.contains(placeholder)) {
        tasksContainer.appendChild(placeholder);
    }
}

/**
 * Removes the placeholder element from the DOM if it exists.
 * This is typically called after a task has been placed in a column,
 * to remove any visual indication of the potential drop position.
 * 
 * @memberof module:DragAndDrop
 */
function removePlaceholder() {
    if (placeholder && placeholder.parentElement) {
        placeholder.parentElement.removeChild(placeholder);
    }
    placeholder = null;
}

/**
 * Adds touch event listeners to all task elements to enable drag-and-drop functionality.
 */
addTouchListeners();