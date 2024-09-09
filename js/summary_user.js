const baseUrl = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/";

let email;              
let userSessionStatus;
let firebaseUserId;
let firebaseTaskId;
let userName;
let tasks;
let taskDeadline;
let taskStatus;
let toDo = 0;
let done = 0;
let taskPriority;
let urgent = 0;
let medium = 0;
let low = 0;
let nextTaskPriority = 'urgent';
let deadlineArray = [];
let earliestDeadline;
let tasksInBoard = 0;
let tasksInProgress = 0;
let tasksInFeedback = 0;


// initializes the listed functions while loading the HTML-Body
async function init() {
    loadRememberedLogin();  
    await loadUserData();
    await createActiveUserSession(); 
    await checkIfUserOrGuest();
}


async function checkIfUserOrGuest() {
    if (userSessionStatus == 'active') {
        await includeHTML();
        if (email != "guest@join.com") {
            await userSession();
        } 
        else if (email == "guest@join.com") {
            await guestSession();
        } 
    }
    else {
        window.location.href = "../index.html";
    }
}


/**
 * Loads email from local storage.
 */
function loadRememberedLogin() {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        email = localStorage.getItem('email');
    }
    console.log('email from local storage:', email);
}


// loads the HTML-templates for the sidebar navigation and the header
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
    await findUserIdByEmail();
    await showUserNameById(); 
    await createActiveUserSession();
    await getUserSessionById();
}


// This function finds the user ID by referencing the user email
async function findUserIdByEmail() {
    try {
        const response = await fetch(`${baseUrl}/user.json`);               // HTTP-Request in user list
        const userData = await response.json();
        for (const userId in userData) {
            if (userData[userId].email === email) {
            firebaseUserId = userId;
            }
        }
        return firebaseUserId;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


// This function finds the user name by referencing the user ID
async function showUserNameById() {
    try {
        const response = await fetch(`${baseUrl}/user.json`);               // HTTP-Request in user list
        const userData = await response.json();
        userName = userData[firebaseUserId].name;
        return userName;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


// This function sets the user session to active after successful login
async function createActiveUserSession() {
    try {
        const response = await fetch(`${baseUrl}/user/${firebaseUserId}.json`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session: 'active'
            })
        });
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


async function userSession() {
    await loadTaskData();
    loadHtmlTemplates();
    greeting();
    checkIfMobileOrDesktopGreeting();
}


async function getUserSessionById() {
    try {
        const response = await fetch(`${baseUrl}/user.json`);               // HTTP-Request in user list
        const userData = await response.json();
        userSessionStatus = userData[firebaseUserId].session;
        console.log('user session is:', userSessionStatus);
        return userSessionStatus;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


// This function requests the tasks from the database
async function loadTaskData() {
    await countTasksAssignedToUser();
    await amountOfToDoTasksAssignedToUser(email);
    await amountOfDoneTasksAssignedToUser(email);
    await amountOfUrgentTasksAssignedToUser(email);
    await amountOfTasksInProgressAssignedToUser(email);
    await amountOfTasksAwaitingFeedbackAssignedToUser(email);
    await nextTaskDeadlineAssignedToUser(email);
}


// This function counts the amount of keys in the "tasks" object
async function checkAmountOfTasksAssignedToUser(email, data) {
    let taskCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                    if (assignment.email === email) {
                        taskCount++;
                    }
                });
            }
        });
    } 
    return taskCount;
}


async function countTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInBoard = await checkAmountOfTasksAssignedToUser(email, data);
        console.log("tasks assigned to user:", tasksInBoard);
        return tasksInBoard;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function checkStatusOfTasksAssignedToUser(email, data, statusValue) {
    let statusCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && task.status === `${statusValue}` && Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                    if (assignment.email === email) {
                        statusCount++;
                    }
                });
            }
        });
    } 
    return statusCount;
}


async function amountOfToDoTasksAssignedToUser(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        toDo = await checkStatusOfTasksAssignedToUser(email, data, 'todo');
        console.log("tasks assigned to user with status 'todo':", toDo);
        return toDo;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfDoneTasksAssignedToUser(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        done = await checkStatusOfTasksAssignedToUser(email, data, 'done');
        console.log("tasks assigned to user with status 'done':", done);
        return done;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfTasksInProgressAssignedToUser(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInProgress = await checkStatusOfTasksAssignedToUser(email, data, 'progress');
        console.log("tasks assigned to user with status 'progress':", tasksInProgress);
        return tasksInProgress;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfTasksAwaitingFeedbackAssignedToUser(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInFeedback = await checkStatusOfTasksAssignedToUser(email, data, 'feedback');
        console.log("tasks assigned to user with status 'feedback':", tasksInFeedback);
        return tasksInFeedback;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function checkPriorityOfTasksAssignedToUser(email, data, priorityValue) {
    let priorityCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && task.priority === `${priorityValue}` && task.status !== "done" && Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                    if (assignment.email === email) {
                        priorityCount++;
                    }
                });
            }
        });
    } 
    return priorityCount;
}


async function amountOfUrgentTasksAssignedToUser(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        urgent = await checkPriorityOfTasksAssignedToUser(email, data, 'urgent');
        console.log("tasks assigned to user with priority 'urgent':", urgent);
        return urgent;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


function checkIfDeadlineLaterThanToday(deadline) {
    //transform german date type format (TT.MM.JJJJ) to standard object type format
    let parts = deadline.split('.');
    let dividedDeadline = parts[2] + '-' + parts[1] + '-' + parts[0];
    let newDeadlineFormat = new Date(dividedDeadline);
    //transform deadline date object to integer
    let formattedDeadline = newDeadlineFormat.getTime();
    //define and transform todays date object to integer
    let today = new Date();
    let formattedToday = today.getTime();
    //check if deadline greater than todays date
    let result = formattedDeadline > formattedToday;
    return result;
}


function findEarliestDate(dateArray) {
    let earliestDate = new Date(dateArray[0].split('.').reverse().join('-')); 
    for (let i = 1; i < dateArray.length; i++) {
        let currentDate = new Date(dateArray[i].split('.').reverse().join('-'));
        if (currentDate < earliestDate) {
        earliestDate = currentDate;
        }
    }
    return earliestDate;
}


function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}


async function pushDatesIntoDeadlineArray(email, data) {
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && checkIfDeadlineLaterThanToday(task.date) === true && Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                    if (assignment.email === email) {
                        deadlineArray.push(task.date);
                    }
                });
            }
        });
    } 
}


// This function shows the next task deadline by referencing the user ID
async function nextTaskDeadlineAssignedToUser(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        await pushDatesIntoDeadlineArray(email, data);
        let earliestDeadlineFormatted = findEarliestDate(deadlineArray);
        earliestDeadline = formatDate(earliestDeadlineFormatted);
        console.log("deadline Array:", deadlineArray);
        console.log('the next deadline is:', earliestDeadline);
        return earliestDeadline;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}