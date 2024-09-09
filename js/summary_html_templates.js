// HTML Templates
function loadHtmlTemplates() {
    toDoUser(toDo);
    doneUser(done);
    priorityUser(nextTaskPriority, urgent, medium, low);
    taskDeadlineUser(earliestDeadline);
    tasksInBoardUser(tasksInBoard);
    tasksInProgressUser(tasksInProgress);
    tasksInFeedbackUser(tasksInFeedback);
    desktopGreetingTextAndName();
    mobileGreetingTextAndName();
    createPriorityLogoAndColor(nextTaskPriority);
}


function toDoUser(toDo) {
    let toDoAmount = document.getElementById('userToDoAmount');
    toDoAmount.innerHTML = /*html*/ `
        <div class="mainContentLineTextTop">${toDo}</div>
    `;
}


function doneUser(done) {
    let doneAmount = document.getElementById('userDoneAmount');
    doneAmount.innerHTML = /*html*/ `
        <span class="mainContentLineTextTop">${done}</span>
    `;
}


function priorityUser(nextTaskPriority, urgent, medium, low) {
    let priority = document.getElementById('taskPriority');
    priority.innerHTML = /*html*/ `
        <div class="center"> <span class="mainContentLineTextTop">${urgent}</span> </div>          
        <div> <span class="mainContentLineTextBottom">${nextTaskPriority}</span> </div>
    `;
}


function taskDeadlineUser(earliestDeadline) {
    let date = document.getElementById('deadline');
    date.innerHTML = /*html*/ `
        <span id="date">${earliestDeadline}</span>
    `;
}


function tasksInBoardUser(tasksInBoard) {
    let boardTasks = document.getElementById('tasksInBoard');
    boardTasks.innerHTML = /*html*/ `
        <span class="mainContentLine3Number">${tasksInBoard}</span>
    `;
}


function tasksInProgressUser(tasksInProgress) {
    let progressTasks = document.getElementById('tasksInProgress');
    progressTasks.innerHTML = /*html*/ `
        <span class="mainContentLine3Number">${tasksInProgress}</span>
    `;
}


function tasksInFeedbackUser(tasksInFeedback) {
    let feedbackTasks = document.getElementById('tasksInFeedback');
    feedbackTasks.innerHTML = /*html*/ `
        <span class="mainContentLine3Number">${tasksInFeedback}</span>
    `;
}


function desktopGreetingTextAndName() {                                  
    let greeting = document.getElementById('greeting');
    greeting.innerHTML = /*html*/ `
        <span id="greetingText">${greetingText}</span>
        <span id="greetingName">${userName}</span>
    `;
}


function mobileGreetingTextAndName() {                                  
    let greeting = document.getElementById('greetingMobile');
    greeting.innerHTML = /*html*/ `
        <span id="greetingTextMobile">${greetingText}</span>
        <span id="greetingNameMobile">${userName}</span>
    `;
}


function createPriorityLogoAndColor() {
    let priority = document.getElementById('createPriorityLogoAndColor');
    priority.innerHTML = /*html*/ `
        <div id="mainContentLine2Circle">
            <img id="priorityIcon" src="../img/summary/urgent_white.svg" alt="Priority Icon">
        </div>
    `;
    changePriorityLogoAndColor(nextTaskPriority);
}