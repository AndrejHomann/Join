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