const baseUrl = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/";

let email = 'andrej@join.com';
let firebaseUserId;
let firebaseTaskId;
let userName;
let taskDeadline;
let taskStatus;
let toDo = 0;
let done = 0;
let taskPriority;
let urgent = 0;
let medium = 0;
let low = 0;
let nextTaskPriority = medium;
let tasksInBoard = 4;
let tasksInProgress = 1;
let tasksInFeedback = 3;


async function init() {
    await includeHTML();
    await loadUserData(); 
    await loadTaskData();
    
    loadHtmlTemplates();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[includeHTML]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("includeHTML"); 
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


// Requests from user list
async function loadUserData() {
    await findUserIdByEmail(email);
    await showUserNameById(firebaseUserId); 
}


async function findUserIdByEmail(email) {
    try {
        const response = await fetch(`${baseUrl}/user.json`);   // HTTP-Request in user list
        const data = await response.json();
        for (const userId in data) {
            if (data[userId].email === email) {
            console.log("The Firebase user id is:", userId);
            firebaseUserId = userId;
            return userId;
            }
        }
        console.log("User not found");
        return null;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


async function showUserNameById(id) {
    try {
        const response = await fetch(`${baseUrl}/user.json`);   // HTTP-Request in user list
        const data = await response.json();
        userName = data[firebaseUserId].name;
        console.log("The user name is:", userName);
        return userName;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}





// Requests from task list
async function loadTaskData() {
    await findTaskIdByEmail(email);
    await showTaskStatusById(firebaseTaskId);
    amountTaskStatus(taskStatus);
    await showTaskPriorityById(firebaseTaskId);
    amountPriority(urgent, medium, low);
    await showTaskDeadlineById(firebaseTaskId);
}


async function findTaskIdByEmail(email) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);   // HTTP-Request in task list
        const data = await response.json();
        for (const taskId in data) {
            if (data[taskId].assignment === email) {
            console.log("The Firebase task id is:", taskId);
            firebaseTaskId = taskId;
            return firebaseTaskId;
            }
        }
        console.log("task not found");
        return null;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


async function showTaskStatusById(firebaseTaskId) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);   // HTTP-Request in task list
        const data = await response.json();
        taskStatus = data[firebaseTaskId].status;
        console.log("The task status is:", taskStatus);
        return taskStatus;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


function amountTaskStatus(taskStatus) {
    if (taskStatus == 'todo') {
        toDo++;
    } else if (taskStatus == 'done') {
        done++;
    }
    console.log("toDos:", toDo);
    console.log("done:", done);
    return {toDo, done};
}


async function showTaskPriorityById(firebaseTaskId) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);   // HTTP-Request in task list
        const data = await response.json();
        taskPriority = data[firebaseTaskId].priority;
        console.log("The task priority is:", taskPriority);
        return taskPriority;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


function amountPriority(taskPriority, urgent, medium, low) {
    if (taskPriority == 'urgent') {
        urgent++;
    } else if (taskPriority == 'medium') {
        medium++;
    } else if (taskPriority == 'low') {
        low++;
    }
    console.log("amount of urgent priority tasks:", urgent);
    console.log("amount of medium priority tasks:", medium);
    console.log("amount of low priority tasks:", low);
    return {urgent, medium, low};
}


async function showTaskDeadlineById(firebaseTaskId) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);   // HTTP-Request in task list
        const data = await response.json();
        taskDeadline = data[firebaseTaskId].date;
        console.log("The task deadline is:", taskDeadline);
        return taskDeadline;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}





// Change images
document.addEventListener('DOMContentLoaded', function() { //this code will be executed as soon as all referenced HTML elements are loaded
    changeToDoLogoColorOnHover();
    changeDoneLogoColorOnHover();
    changePriorityLogoByPriorityStatus(nextTaskPriority);
});

    
function changeToDoLogoColorOnHover() {
    const toDo = document.getElementById('toDo');
    const editImage = document.getElementById('edit');
    toDo.addEventListener('mouseover', function() {
        editImage.src = '../img/summary/edit_hover.svg';
    });
    toDo.addEventListener('mouseout', function() {
        editImage.src = '../img/summary/edit.png';
    });
}


function changeDoneLogoColorOnHover() {
    const done = document.getElementById('done');
    const checkImage = document.getElementById('check');
    done.addEventListener('mouseover', function() {
        checkImage.src = '../img/summary/check_hover.svg';
    });
    done.addEventListener('mouseout', function() {
        checkImage.src = '../img/summary/check.png';
    });
}


// does not work
function changePriorityLogoByPriorityStatus(nextTaskPriority) { 
    let priorityLogo = document.getElementById('priorityIcon');
    if (nextTaskPriority == 'urgent') {
        priorityLogo.src = '../img/summary/urgent_orange.svg';
    } else if (nextTaskPriority == 'medium') {
        priorityLogo.src = '../img/summary/medium_orange.svg';
    } else if (nextTaskPriority == 'low') {
        priorityLogo.src = '../img/summary/low_orange.svg';
    }
}





// HTML Templates
function loadHtmlTemplates() {
    toDoUser(toDo);
    doneUser(done);
    priorityUser(taskPriority, urgent, medium, low);
    taskDeadlineUser(taskDeadline);
    tasksInBoardUser(tasksInBoard);
    tasksInProgressUser(tasksInProgress);
    tasksInFeedbackUser(tasksInFeedback);
    greetUser(userName);
}


function toDoUser(toDo) {
    let toDoAmount = document.getElementById('userToDoAmount');
    toDoAmount.innerHTML = /*html*/ `
        <span class="mainContentLineTextTop">${toDo}</span>
    `;
}


function doneUser(done) {
    let doneAmount = document.getElementById('userDoneAmount');
    doneAmount.innerHTML = /*html*/ `
        <span class="mainContentLineTextTop">${done}</span>
    `;
}


function priorityUser(taskPriority, urgent, medium, low) {
    let priority = document.getElementById('taskPriority');
    priority.innerHTML = /*html*/ `
        <div class="center"> <span class="mainContentLineTextTop">${medium}</span> </div>          
        <div> <span class="mainContentLineTextBottom">${taskPriority}</span> </div>
    `;
}


function taskDeadlineUser(taskDeadline) {
    let date = document.getElementById('deadline');
    date.innerHTML = /*html*/ `
        <span id="date">${taskDeadline}</span>
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


function greetUser(userName) {                                  
    let greeting = document.getElementById('greeting');
    greeting.innerHTML = /*html*/ `
        <span id="greetingText">Good morning,</span>
        <span id="greetingName">${userName}</span>
    `;
}