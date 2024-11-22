/**
 * Loads and renders various HTML templates and components based on provided data.

 * @param {Object} toDo - number of to-do tasks.
 * @param {Object} done - number of completed tasks.
 * @param {string} nextTaskPriority - Priority of the next task ("low", "medium", "urgent").
 * @param {number} urgent - number of urgent tasks.
 * @param {number} medium - number of tasks with medium priotity.
 * @param {number} low - number of tasks with low priotity.
 * @param {Object} tasksInBoard - number of all tasks in the board.
 * @param {Object} tasksInProgress - number of all tasks in progress.
 * @param {Object} tasksInFeedback - number of all tasks in feedback.
 */
function loadHtmlTemplates() {
    toDoUser(toDo);
    doneUser(done);
    priorityUser(nextTaskPriority, urgent, medium, low);
    taskDeadlineUser();
    taskDeadlineUserText();
    tasksInBoardUser(tasksInBoard);
    tasksInProgressUser(tasksInProgress);
    tasksInFeedbackUser(tasksInFeedback);
    desktopGreetingTextAndName();
    mobileGreetingTextAndName();
    createPriorityLogoAndColor(nextTaskPriority);
}


/**
 * Renders the number of to-do tasks in the HTML.

 * @param {number} toDo - number of to-do tasks.
 */
function toDoUser(toDo) {
    let toDoAmount = document.getElementById('userToDoAmount');
    toDoAmount.innerHTML = /*html*/ `
        <div class="mainContentLineTextTop">${toDo}</div>
    `;
}


/**
 * Renders the number of done tasks in the HTML.

 * @param {number} done - number of done tasks.
 */
function doneUser(done) {
    let doneAmount = document.getElementById('userDoneAmount');
    doneAmount.innerHTML = /*html*/ `
        <span class="mainContentLineTextTop">${done}</span>
    `;
}


/**
 * Renders the priority information for the next task.

 * @param {string} nextTaskPriority - The priority of the next task ("low", "medium", "urgent", or an empty string).
 * @param {number} urgent - The number of urgent tasks.
 * @param {number} medium - The number of medium-priority tasks.
 * @param {number} low - The number of low-priority tasks.
 */
function priorityUser(nextTaskPriority, urgent, medium, low) {
    let priority = document.getElementById('taskPriority');
    textSize = "64";
    if (nextTaskPriority === "low") {
        priorityUserHtml(priority, nextTaskPriority, low, textSize);
    }
    if (nextTaskPriority === "medium") {
        priorityUserHtml(priority, nextTaskPriority, medium, textSize);
    }
    if (nextTaskPriority === "urgent") {
        priorityUserHtml(priority, nextTaskPriority, urgent, textSize);
    }
    if (nextTaskPriority === "") {
        priorityUserHtml(priority, nextTaskPriority, 'upcoming task has no priority', '21');
    }
}


/**
 * Renders the priority information for the next task, including the count and priority level.

 * @param {HTMLElement} priority - The HTML element to render the priority information into.
 * @param {string} nextTaskPriority - The priority of the next task ("low", "medium", "urgent", or an empty string).
 * @param {string|number} priorityCount - The count of tasks with the specified priority or a custom message.
 * @param {string} textSize - The font size in pixels for the priority count.
 */
function priorityUserHtml(priority, nextTaskPriority, priorityCount, textSize) {
    priority.innerHTML = /*html*/ `
        <div class="center"> <span class="mainContentLineTextTop" style="font-size: ${textSize}px;">${priorityCount}</span> </div>          
        <div> <span class="mainContentLineTextBottom">${nextTaskPriority}</span> </div>
    `;
}


/**
 * Renders the deadline date.

 * @param {HTMLElement} date - The HTML element to render the deadline date into.
 * @param {string} earliestDeadline - The earliest deadline date.
 */
function taskDeadlineUser() {
    let date = document.getElementById('deadline');
    date.innerHTML = /*html*/ `
        <span id="date">${deadlineDate.earliestDeadline}</span>
    `;
}


/**
 * Renders the deadline text.

 * @param {HTMLElement} text - The HTML element to render the deadline text into.
 * @param {string} deadlineText - The deadline text.
 */
function taskDeadlineUserText() {
    let text = document.getElementById('upcoming');
    text.innerHTML = /*html*/ `
        <span id="dateText">${deadlineDate.deadlineText}</span>
    `;
}


/**
 * Renders the number of tasks in the board.

 * @param {HTMLElement} boardTasks - The HTML element to render the task count into.
 * @param {number} tasksInBoard - The number of all tasks available in the board.
 */
function tasksInBoardUser(tasksInBoard) {
    let boardTasks = document.getElementById('tasksInBoard');
    boardTasks.innerHTML = /*html*/ `
        <span class="mainContentLine3Number">${tasksInBoard}</span>
    `;
}


/**
 * Renders the number of tasks in the board.

 * @param {HTMLElement} progressTasks - The HTML element to render the task count into.
 * @param {number} tasksInProgress - The number of all tasks in progress.
 */
function tasksInProgressUser(tasksInProgress) {
    let progressTasks = document.getElementById('tasksInProgress');
    progressTasks.innerHTML = /*html*/ `
        <span class="mainContentLine3Number">${tasksInProgress}</span>
    `;
}


/**
 * Renders the number of tasks in the board.

 * @param {HTMLElement} feedbackTasks - The HTML element to render the task count into.
 * @param {number} tasksInFeedback - The number of all tasks in feedback.
 */
function tasksInFeedbackUser(tasksInFeedback) {
    let feedbackTasks = document.getElementById('tasksInFeedback');
    feedbackTasks.innerHTML = /*html*/ `
        <span class="mainContentLine3Number">${tasksInFeedback}</span>
    `;
}


/**
 * Renders the greeting text and user name for desktop devices.

 * @param {HTMLElement} greeting - The HTML element to render the greeting into.
 * @param {string} greetingText - The greeting text.
 * @param {string} userName - The user's name.
 */
function desktopGreetingTextAndName() {                                  
    let greeting = document.getElementById('greeting');
    greeting.innerHTML = /*html*/ `
        <span id="greetingText">${greetingText}</span>
        <span id="greetingName">${userName}</span>
    `;
}


/**
 * Renders the greeting text and user name for mobile devices.

 * @param {HTMLElement} greeting - The HTML element to render the greeting into.
 * @param {string} greetingText - The greeting text.
 * @param {string} userName - The user's name.
 */
function mobileGreetingTextAndName() {                                  
    let greeting = document.getElementById('greetingMobile');
    greeting.innerHTML = /*html*/ `
        <span id="greetingTextMobile">${greetingText}</span>
        <span id="greetingNameMobile">${userName}</span>
    `;
}