/**
 * Creates and displays a task creation form in the board.
 *
 * This function sets the inner HTML of the 'addTaskFromBoard' element
 * to a task creation form generated by the `createTaskFromBoardDiv` function.
 */
function createTaskFromBoard() {
    const createTask = document.getElementById("addTaskFromBoard");
    createTask.innerHTML = createTaskFromBoardDiv();
    createTask.classList.add("board-mode");
    selectedContacts = [];
    selectedColors = [];
    subtasks = [];
    wasContactsDropdownOpenInCurrentTask = true;
    checkAddTaskChangesInBoard();
    let subtaskInputBoard = document.getElementById("board-new-subtask-input");
    subtaskInputBoard.addEventListener("input", showCloseOrDeleteIconDuringWritingSubtaskBoard);
    subtaskInputBoard.addEventListener("keydown", addSubtaskByEnterKeyBoard);
}

function addTaskFromBoard() {
    if (!validateAllInputsBoard()) {
        return;
    }

    let task = {
        name: selectedContacts,
        priority: selectedPrio,
        category: selectedCategory,
        color: selectedColors,
        addedSubtasks: subtasks,
        title: document.getElementById("board-title-input").value,
        taskDescription: document.getElementById("board-textarea-input").value,
        date: document.getElementById("board-date-input").value,
        status: "todo",
    };
    addTask("/tasks.json", task);
    clearFieldsBoard();
}

function clearFieldsBoard() {
    clearInputFieldsBoard();
    setBackArrays();

    document.getElementById("board-category-placeholder").innerHTML = "Select task category";
    document.getElementById("assigned-placeholder").innerHTML = "Select contacts to assign";
    document.getElementById("selected-contacts-circle-container").innerHTML = "";

    resetPrioBoard();
    document.getElementById("board-prio-medium-button").classList.add("prio-medium-button-bg-color");
    document.getElementById("board-prio-medium-button").classList.remove("prio-default-text-color");
    closeContactsDropDown();
    // closeCategoryDropDown();
    // boardAddTaskCloseCategoryDropDown();
    // resetSubtaskIconBoard();
    resetSubtaskListBoard();
    resetRequiredNotificationsBoard();
}

function resetRequiredNotificationsBoard() {
    resetDateRequiredNotificationBoard();
    resetTitleRequiredNotificationBoard();
    resetCategoryRequiredNotificationBoard();
}

function resetDateRequiredNotificationBoard() {
    let missingDateMessage = document.getElementById("board-missing-date-message");
    missingDateMessage.style.display = "none";
    document.getElementById("board-date-input").style.border = "";
}

function resetTitleRequiredNotificationBoard() {
    let missingTitleMessage = document.getElementById("board-missing-title-message");
    let titleInput = document.getElementById("board-title-input");
    titleInput.style.border = "";
    missingTitleMessage.style.display = "none";
}

function resetCategoryRequiredNotificationBoard() {
    let missingCategoryMessage = document.getElementById("board-missing-category-message");
    let categoryInput = document.getElementById("board-selected-category");
    categoryInput.style.border = "";

    missingCategoryMessage.style.display = "none";
}

function clearInputFieldsBoard() {
    document.getElementById("board-title-input").value = "";
    document.getElementById("board-textarea-input").value = "";
    document.getElementById("board-date-input").value = "";
    document.getElementById("board-new-subtask-input").value = "";
}

function validateAllInputsBoard() {
    let isValid = true;

    if (!checkIfTitleIsEnteredBoard()) {
        isValid = false;
    }

    if (!checkIfDateIsSelectedBoard()) {
        isValid = false;
    }

    if (!checkIfCategoryIsSelectedBoard()) {
        isValid = false;
    }

    return isValid;
}

function checkIfTitleIsEnteredBoard() {
    let missingTitleMessage = document.getElementById("board-missing-title-message");
    let titleInput = document.getElementById("board-title-input");

    let isValid = true;

    if (titleInput.value) {
        missingTitleMessage.style.display = "none";
        isValid = true;
    } else {
        titleInput.style.border = "1px solid #ff8190";
        missingTitleMessage.style.display = "flex";
        isValid = false;
    }
    return isValid;
}

function checkIfDateIsSelectedBoard() {
    let missingDateMessage = document.getElementById("board-missing-date-message");
    let dateInput = document.getElementById("board-date-input");

    let isValid = true;

    if (dateInput.value) {
        missingDateMessage.style.display = "none";
        isValid = true;
    } else {
        missingDateMessage.style.display = "flex";
        dateInput.style.border = "1px solid #ff8190";
        isValid = false;
    }
    return isValid;
}

function checkIfCategoryIsSelectedBoard() {
    let missingCategoryMessage = document.getElementById("board-missing-category-message");
    let categoryInput = document.getElementById("board-selected-category");

    let isValid = true;

    if (selectedCategory) {
        missingCategoryMessage.style.display = "none";
        categoryInput.style.border = "1px solid #90d1ed";

        isValid = true;
    } else {
        missingCategoryMessage.style.display = "flex";
        categoryInput.style.border = "1px solid #ff8190";
        isValid = false;
    }
    return isValid;
}

function resetSubtaskListBoard() {
    document.getElementById("board-generated-subtask-list-container").innerHTML = "";
}

function checkAddTaskChangesInBoard() {
    checkTaskTitleBoard();
    checkTaskDescriptionBoard();
    checkTaskDateBoard();
    // checkTaskCategory();
    checkTaskSubtaskBoard();
}

function checkTaskTitleBoard() {
    setTimeout(() => {
        const input = document.getElementById("board-title-input");
        // const message = document.getElementById("missing-title-message");
        const message = document.getElementById("board-missing-title-message");
        checkTaskOnClickInsideElementBoard(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElementBoard(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElementBoard(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

function checkTaskDescriptionBoard() {
    setTimeout(() => {
        const input = document.getElementById("board-textarea-input");
        checkTaskOnClickInsideElementBoard(input, "", "#90d1ed", "#90d1ed");
        checkTaskOnClickOutsideElementBoard(input, "", "#d1d1d1", "#d1d1d1");
        checkTaskOnKeystrokeInsideElementBoard(input, "", "#d1d1d1", "#90d1ed");
    }, 100);
}

function checkTaskDateBoard() {
    setTimeout(() => {
        const input = document.getElementById("board-date-input");
        const message = document.getElementById("board-missing-date-message");
        checkTaskOnClickInsideElementBoard(input, message, "#ff8190", "#90d1ed");
        checkTaskOnClickOutsideElementBoard(input, message, "#ff8190", "#d1d1d1");
        checkTaskOnKeystrokeInsideElementBoard(input, message, "#ff8190", "#90d1ed");
    }, 100);
}

function checkTaskOnClickInsideElementBoard(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("click", () => {
        if (input.trim === "") {
            input.style = `border: 1px solid ${bordercolor1};`;
            if (message != "") {
                message.style.display = "flex";
            }
        } else {
            input.style = `border: 1px solid ${bordercolor2};`;
            if (message != "") {
                message.style.display = "none";
            }
        }
    });
}

function checkTaskOnClickOutsideElementBoard(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("blur", () => {
        if (input.value === "") {
            input.style = `border: 1px solid ${bordercolor1};`;
            if (message != "") {
                message.style.display = "flex";
            }
        } else {
            input.style = `border: 1px solid ${bordercolor2};`;
            if (message != "") {
                message.style.display = "none";
            }
        }
    });
}

function checkTaskOnKeystrokeInsideElementBoard(input, message, bordercolor1, bordercolor2) {
    input.addEventListener("input", () => {
        if (input.value === "") {
            input.style = `border: 1px solid ${bordercolor1};`;
            if (message != "") {
                message.style.display = "flex";
            }
        } else {
            input.style = `border: 1px solid ${bordercolor2};`;
            if (message != "") {
                message.style.display = "none";
            }
        }
    });
}

function checkTaskSubtaskBoard() {
    setTimeout(() => {
        const input1 = document.getElementById("board-new-subtask-container");
        const input2 = document.getElementById("board-new-subtask-input");
        checkTaskOnClickInsideSubtaskElement(input1, input2, "#90d1ed");
        checkTaskOnClickOutsideSubtaskElement(input1, input2, "#d1d1d1");
        // checkEditTaskOnKeystrokeInsideSubtaskElement(input1, input2,'blue');
    }, 100);
}

function checkTaskOnClickInsideSubtaskElementBoard(input1, input2, bordercolor) {
    input1.addEventListener("click", () => {
        input1.style = `border: 1px solid ${bordercolor};`;
    });
    input2.addEventListener("click", () => {
        input1.style = `border: 1px solid ${bordercolor};`;
    });
}

function checkTaskOnClickOutsideSubtaskElementBoard(input1, input2, bordercolor) {
    input1.addEventListener("blur", () => {
        input1.style = `border: 1px solid ${bordercolor};`;
    });
    input2.addEventListener("blur", () => {
        input1.style = `border: 1px solid ${bordercolor};`;
    });
}

function choosePrioBoard(prio) {
    let selectedPioButton = document.getElementById(`board-prio-${prio}-button`);

    resetPrioBoard();

    selectedPioButton.classList.add(`prio-${prio}-button-bg-color`);
    selectedPioButton.classList.remove("prio-default-text-color");

    selectedPrio = prio;
}

function resetPrioBoard() {
    let urgentButton = document.getElementById("board-prio-urgent-button");
    let mediumButton = document.getElementById("board-prio-medium-button");
    let lowButton = document.getElementById("board-prio-low-button");

    urgentButton.classList.remove("prio-urgent-button-bg-color");
    mediumButton.classList.remove("prio-medium-button-bg-color");
    lowButton.classList.remove("prio-low-button-bg-color");

    urgentButton.classList.add("prio-default-text-color");
    mediumButton.classList.add("prio-default-text-color");
    lowButton.classList.add("prio-default-text-color");
}

function addOrCloseSubtaskBoard() {
    if (isSubtaskResetting) return;

    let subtaskIconContainer = document.getElementById("board-subtask-icon-container");

    subtaskIconContainer.classList.remove("plusIconHover");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="board-close-icon-container" onclick="closeSubtaskDraftBoard()"><img src="/img/addTask/close.png" alt="delete" id="close-subtask"></div>
        <div class="border-subtask-container"></div>
        <div id="board-check-icon-container" onclick="addSubtaskFromBoard()"><img src="/img/addTask/check.png" alt="check" id="check-subtask"></div>`;

    let checkIconContainer = document.getElementById("board-check-icon-container");
    checkIconContainer.classList.add("circleHoverEffect");
    let closeIconContainer = document.getElementById("board-close-icon-container");
    closeIconContainer.classList.add("circleHoverEffect");
}

function addSubtaskFromBoard() {
    let newSubtaskInput = document.getElementById("board-new-subtask-input");
    let subtaskList = document.getElementById("board-generated-subtask-list-container");
    let missingSubtaskMessage = document.getElementById("board-missing-subtask-message");
    let subtaskContainer = document.getElementById("board-new-subtask-container");
    let i = subtasks.length;

    handleSubtaskValidationBoard(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i);
    resetSubtaskIconBoard();
}

/**
 * Closes the subtask draft and resets the input field.
 */
function closeSubtaskDraftBoard() {
    // let newSubtaskContaier = document.getElementById("board-new-subtask-container");
    // removeBorderStyleToValueContainer(newSubtaskContaier);
    let subtaskDraft = document.getElementById("board-new-subtask-input");
    subtaskDraft.value = ``;
    resetSubtaskIconBoard();
}

function handleSubtaskValidationBoard(newSubtaskInput, subtaskList, subtaskContainer, missingSubtaskMessage, i) {
    let trimmedInput = newSubtaskInput.value.trim();

    if (trimmedInput !== "") {
        subtasks.push({ subtask: trimmedInput, status: "unchecked" });

        let subtaskHTML = templateSubtasksListHTMLBoard(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;

        newSubtaskInput.value = "";
        subtaskContainer.style.border = "";
        missingSubtaskMessage.style.display = "none";
    } else {
        subtaskContainer.style.border = "1px solid #ff8190";
        missingSubtaskMessage.style.display = "flex";
    }
}

function resetSubtaskIconBoard() {
    let subtaskIconContainer = document.getElementById("board-subtask-icon-container");

    subtaskIconContainer.innerHTML = /*html*/ `
        <div id="board-plus-icon-container" class="circleHoverEffect" onclick="addOrCloseSubtaskBoard()">
            <img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" />
        </div>`;

    isSubtaskResetting = true;
    setTimeout(resetSubtaskClearButton, 1);
}

function showCloseOrDeleteIconDuringWritingSubtaskBoard() {
    let subtaskInputBoard = document.getElementById("board-new-subtask-input");

    if (subtaskInputBoard.value) {
        addOrCloseSubtaskBoard();
    } else {
        resetSubtaskIconBoard();
    }
}

function templateSubtasksListHTMLBoard(i, subtask) {
    return /*html*/ `
            <div class="generatedSubtasks" id="board-generated-subtask-container-${i}">
                <li id="generated-subtask-list-item-${i}" class="subtaskListItemStyle">${subtask}</li>
                <div id="generated-subtask-list-icons">
                    <div id="board-icon-container" onclick="editSubtaskBoard(${i})"><img src="/img/addTask/edit.png" alt="edit" /></div>
                    <div class="border-subtask-container"></div>
                    <div id="board-delete-icon-container" onclick="deleteSubtaskBoard(${i})">
                        <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                    </div>
                </div>
            </div>`;
}

function editSubtaskBoard(index) {
    let toEditSubtask = document.getElementById(`board-generated-subtask-container-${index}`);
    let currentSubtaskText = subtasks[index].subtask;

    toEditSubtask.classList.add("noHoverEffect");

    toEditSubtask.innerHTML = templateEditSubtasksHTMLBoard(currentSubtaskText, index);

    setupEditSubtaskByEnterKeyBoard(index);
}

function templateEditSubtasksHTMLBoard(currentSubtaskText, index) {
    return /*html*/ `
        <div id="edit-subtask-container">
            <input type="text" id="board-edit-subtask-input-${index}" value="${currentSubtaskText}" class="edit-subtask-container-styling">            
            <div id="generated-subtask-list-icons" class="showSubtaskIconsWhileEditing">
                <div id="board-delete-icon-container" onclick="deleteSubtaskBoard(${index})">
                    <img src="/img/addTask/delete.png" alt="delete" id="delete-subtask-icon" />
                </div>     
                <div class="border-subtask-container"></div>
                <div id="board-edit-icon-container" onclick="submitSubtaskBoard(${index})">
                    <img src="/img/addTask/check.png" alt="check" id="check-subtask">
                </div>
            </div>
        </div>`;
}

function deleteSubtaskBoard(index) {
    let newSubtask = document.getElementById(`board-generated-subtask-container-${index}`);
    if (newSubtask) {
        newSubtask.remove();
    }
    subtasks.splice(index, 1);
    updateSubtaskListAfterDeleteBoard();
}

function submitSubtaskBoard(index) {
    let editedSubtaskInput = document.getElementById(`board-edit-subtask-input-${index}`).value;

    if (editedSubtaskInput === "") {
        return;
    } else {
        subtasks[index].subtask = editedSubtaskInput;
        updateSubtaskListAfterDeleteBoard();
    }
}

function addSubtaskByEnterKeyBoard(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtaskFromBoard();
    }
}

function setupEditSubtaskByEnterKeyBoard(index) {
    let editSubtaskInput = document.getElementById(`board-edit-subtask-input-${index}`);
    editSubtaskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEditedSubtaskByEnterKeyBoard(index, event);
        }
    });
}

function addEditedSubtaskByEnterKeyBoard(index, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtaskBoard(index);
    }
}

function updateSubtaskListAfterDeleteBoard() {
    let subtaskList = document.getElementById("board-generated-subtask-list-container");

    subtaskList.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskHTML = templateSubtasksListHTMLBoard(i, subtasks[i].subtask);
        subtaskList.innerHTML += subtaskHTML;
    }
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
                            <!-- <div id="title-input-container"><input type="text" placeholder="Enter a title" id="title-input" /></div> -->
                            <div id="title-input-container"><input type="text" placeholder="Enter a title" id="board-title-input" />
                                <span id="board-missing-title-message" class="d-none">This field is required</span>
                            </div>
                        </div>
                        <div id="description-container" class="flex-column gap8px">
                            <div class="subtitle">Description</div>
                            <!-- <div id="textarea-container" class="flex-column"><textarea placeholder="Enter a Description" id="textarea-input"></textarea></div> -->
                            <div id="board-textarea-container" class="flex-column"><textarea placeholder="Enter a Description" id="board-textarea-input"></textarea></div>
                        </div>
                        <div id="assigned-container" class="flex-column gap8px">
                            <div class="subtitle">Assigned to</div>
                            <div id="selected-name" class="select-container" onclick="checkIfContactsDropdownIsVisible()">
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
                            <!-- <div id="calender"><input type="date" id="date-input" /></div> -->
                            <div id="calender"><input type="date" id="board-date-input" />
                                <span id="board-missing-date-message" class="d-none">This field is required</span>
                            </div>
                        </div>
                        <div id="prio-container" class="flex-column gap8px">
                            <div class="subtitle">Prio</div>
                            <div id="choose-prio-container">
                                <!-- <button class="choose-prio-button flex-center-align" id="prio-urgent-button" type="button" onclick="choosePrio('urgent')"> -->
                                <button class="choose-prio-button flex-center-align" id="board-prio-urgent-button" type="button" onclick="choosePrioBoard('urgent')">
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
                                <!-- <button class="choose-prio-button flex-center-align prio-medium-button-bg-color" id="prio-medium-button" type="button" onclick="choosePrio('medium')"> -->
                                <button class="choose-prio-button flex-center-align prio-medium-button-bg-color" id="board-prio-medium-button" type="button" onclick="choosePrioBoard('medium')">
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
                                <!-- <button class="choose-prio-button flex-center-align" id="prio-low-button" type="button" onclick="choosePrio('low')"> -->
                                <button class="choose-prio-button flex-center-align" id="board-prio-low-button" type="button" onclick="choosePrioBoard('low')">
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
                        <div id="board-category-container" class="flex-column gap8px">
                            <div class="subtitle">Category<span class="asterisk">*</span></div>
                            <div>
                                <div id="board-selected-category" class="select-container" onclick="boardAddTaskCheckIfCategoryDropdownIsVisible(), boardAddTaskDoNotCloseDropdown(event)">
                                    <span id="board-category-placeholder">Select task category</span>
                                    <div id="board-category-dropdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>
                                </div>
                                <span id="board-missing-category-message" class="d-none">This field is required</span>
                            </div>    
                            <div id="board-category-dropdown-list" class="d-none"></div>
                        </div>
                        <div id="substasks-container" class="flex-column gap8px">
                            <div class="subtitle">Subtasks</div>
                            <div id="board-subtask-relative-container">
                                <div id="board-new-subtask-container" onclick="addOrCloseSubtaskBoard()">
                                    <!-- <input type="text" id="new-subtask-input" placeholder="Add new subtask" /> -->
                                    <input type="text" id="board-new-subtask-input" placeholder="Add new subtask" class="subtaskInputsBoard"/>
                                    <div id="board-subtask-icon-container">
                                        <div id="board-plus-icon-container" class="circleHoverEffect"><img src="/img/addTask/add.png" id="plus-icon" alt="plus-icon" /></div>
                                    </div>
                                </div>
                                <span id="board-missing-subtask-message" class="d-none">Please add a subtask 🙂</span>
                            </div>
                            <div id="board-new-subtask-list-container"><div id="board-generated-subtask-list-container"></div></div>
                        </div>
                    </div>
                </div>
                <div id="interactives-buttons-and-required-container">
                    <div id="required-container">
                        <span id="required-span"><span class="asterisk">*</span>This field is required</span>
                    </div>
                    <div id="interactives-buttons-container">
                        <button id="clear-button" class="flex-center-align" type="button" onclick="clearFieldsBoard()"><span id="clear-button-font" class="contents">Clear</span> <img src="/img/Vector.png" id="cancel-icon" /></button>
                        <button id="create-button" class="flex-center-align" type="button" onclick="addTaskFromBoard()"><span id="create-task-button-font" class="contents">Create Task</span><img src="/img/summary/check.png" id="check-icon" /></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// let clickedCategoryDropdownForTheFirstTime = false;

// function checkTaskCategory() {
//     setTimeout(() => {
//         const input1 = document.getElementById("board-selected-category");
//         const input2 = document.getElementById("board-category-placeholder");
//         const input3 = document.getElementById("board-category-container");
//         const message = document.getElementById("board-missing-category-message");
//         checkTaskOnClickInsideElementBoardCategory(input1, message, "#90d1ed");
//         checkTaskOnClickOutsideElementBoardCategory(input1, input2, input3, message, "#ff8190", "#d1d1d1");
//     }, 100);
// }

// function checkTaskOnClickInsideElementBoardCategory(input1, message, bordercolor) {
//     input1.addEventListener("click", () => {
//         input1.style = `border: 1px solid ${bordercolor};`;
//         if (message != "") {
//             message.style.display = "none";
//         }
//         clickedCategoryDropdownForTheFirstTime = true;
//     });
// }

// function checkTaskOnClickOutsideElementBoardCategory(input1, input2, input3, message, bordercolor1, bordercolor2) {
//     document.addEventListener("click", (event) => {
//         // If clicked outside of dropdown container and no category selected, then change border color
//         if (!input3.contains(event.target) && selectedCategory === null && clickedCategoryDropdownForTheFirstTime === true) {
//             boardAddTaskCloseCategoryDropDown();
//             input1.style = `border: 1px solid ${bordercolor1}`;
//             if (message != "") {
//                 message.style.display = "flex";
//             }
//         } else if (!input3.contains(event.target) && selectedCategory !== null && clickedCategoryDropdownForTheFirstTime === true) {
//             boardAddTaskCloseCategoryDropDown();
//             input1.style = `border: 1px solid ${bordercolor2}`;
//         }
//     });
// }

/**
 * Check the visibility of the category dropdown.
 * If the dropdown is hidden, it opens the dropdown; otherwise, it closes it.
 */
function boardAddTaskCheckIfCategoryDropdownIsVisible() {
    if (document.getElementById("board-category-dropdown-list").classList.contains("d-none")) {
        boardAddTaskShowCategoryDropDown();
    } else {
        boardAddTaskCloseCategoryDropDown();
    }
}

/**
 * Displays the category dropdown and resets the selected category.
 * It also changes the dropdown arrow to indicate the open state.
 */
function boardAddTaskShowCategoryDropDown() {
    document.getElementById("board-category-placeholder").innerHTML = /*html*/ `Select task category`;
    document.getElementById("board-category-dropdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="board-dropdown-arrow"/>`;

    let dropdownList = document.getElementById("board-category-dropdown-list");
    dropdownList.innerHTML = boardAddTaskTemplateCategoryHTMLDropdownList(categoryList);

    document.getElementById("board-category-dropdown-list").classList.remove("d-none");
    selectedCategory = null;
}

/**
 * Closes the category dropdown.
 * If a category is selected, it displays the selected category in the placeholder;
 * otherwise, it resets the placeholder to the default "Select task category".
 */
function boardAddTaskCloseCategoryDropDown() {
    let categoryPlaceholder = document.getElementById("board-category-placeholder");

    if (selectedCategory) {
        categoryPlaceholder.innerHTML = selectedCategory;
        checkIfCategoryIsSelectedBoard();
    } else {
        categoryPlaceholder.innerHTML = /*html*/ `Select task category`;
        selectedCategory = null;
        checkIfCategoryIsSelectedBoard();
    }

    document.getElementById("board-category-dropdown-arrow-container").innerHTML = /*html*/ `<div id="board-category-dropdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="board-dropdown-arrow"></div>`;
    document.getElementById("board-category-dropdown-list").classList.add("d-none");
}

/**
 * Generates the HTML template for the category dropdown list.
 *
 * @param {Array} categories - The list of available categories to be displayed.
 * @returns {string} The generated HTML string for the category dropdown list.
 */
function boardAddTaskTemplateCategoryHTMLDropdownList(categories) {
    let dropdownHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-category-${i}" onclick="boardAddTaskSelectCategory('${category}', ${i})">
                <span>${category}</span>
            </div>`;
    }
    return dropdownHTML;
}

/**
 * Prevents the dropdown from closing when clicking inside it.
 *
 * @param {Event} event - The click event.
 */
function boardAddTaskDoNotCloseDropdown(event) {
    event.stopPropagation();
}

/**
 * Selects a category from the dropdown.
 * Adds a border style to the category container and closes the dropdown.
 *
 * @param {string} categoryName - The name of the selected category.
 */
function boardAddTaskSelectCategory(categoryName) {
    selectedCategory = categoryName;
    boardAddTaskCloseCategoryDropDown();
    // resetCategoryRequiredNotification();
}

function clickOutsideOfDropdownBoard(event) {
    let categoryDropdownBoard = document.getElementById("board-category-dropdown-list");
    let clickedInsideCategory = categoryDropdownBoard && categoryDropdownBoard.contains(event.target);

    if (!clickedInsideCategory) {
        if (categoryDropdownBoard && !categoryDropdownBoard.classList.contains("d-none")) {
            boardAddTaskCloseCategoryDropDown();
        }

        if (selectedCategory) {
            let categoryInput = document.getElementById("board-selected-category");
            categoryInput.style.border = "1px solid #d1d1d1";
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", clickOutsideOfDropdownBoard);
});
