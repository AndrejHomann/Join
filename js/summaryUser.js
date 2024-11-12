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
let nextTaskPriority = '';
let deadlineArray = [];
let earliestDeadline;
let tasksInBoard = 0;
let tasksInProgress = 0;
let tasksInFeedback = 0;
let deadlineDate;
let deadlineText;


/**
 * calls listed functions sequentially to load and process the user data.
 */
async function loadUserData() { 
    if(email!="guest@join.com") {
        await findUserIdByEmail(`contacts`);
        await showUserNameById(`contacts`); 
        await createActiveUserSession(`contacts`);
        await getUserSessionById(`contacts`);
        await userSession();
    } else {
        await findUserIdByEmail(`guest`);
        await showUserNameById(`guest`); 
        await createActiveUserSession(`guest`);
        await getUserSessionById(`guest`);
        await guestSession();
    }
}


/**
 * Fetches user data from the specified URL and searches for the user ID matching the stored email address.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} userData - stores the API response in JSON format.
 * @param {string} email - The user's email address.
 * @returns {string|null} - user ID if found, null otherwise.
 */
async function findUserIdByEmail(arrayName) {
    try {
        const response = await fetch(`${baseUrl}/${arrayName}.json`);               // HTTP-Request in user list
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


/**
 * Fetches user data from the specified URL and retrieves the user name based on the stored user ID.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} userData - stores the API response in JSON format.
 * @param {string} firebaseUserId - the individual user ID for the logged in user or guest.
 * @returns {string|null} The user name if found, null otherwise.
 */
async function showUserNameById(arrayName) {
    try {
        const response = await fetch(`${baseUrl}/${arrayName}.json`);               // HTTP-Request in user list
        const userData = await response.json();
        userName = userData[firebaseUserId].name;
        return userName;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


/**
 * Sets the user session to active after successful login.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {string} firebaseUserId - the individual user ID for the logged in user or guest.
 * @param {object} session - this object contains the new session status.
 * @param {Error} error - logs the error to the console and returns `null` to indicate that the operation failed.
 */
async function createActiveUserSession(arrayName) {
    try {
        const response = await fetch(`${baseUrl}/${arrayName}/${firebaseUserId}.json`, {
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


/**
 * Fetches user data from the specified URL and retrieves the user session status based on the stored user ID.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} userData - stores the API response in JSON format.
 * @param {string} firebaseUserId - the individual user ID for the logged in user or guest.
 * @param {string} userSessionStatus - stores the current status of the logged in user.
 * @returns {string|null} - The user session status ("active" or "inactive") if found, null otherwise.
 */
async function getUserSessionById(arrayName) {
    try {
        const response = await fetch(`${baseUrl}/${arrayName}.json`);               // HTTP-Request in user list
        const userData = await response.json();
        userSessionStatus = userData[firebaseUserId].session;
        return userSessionStatus;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


/**
 * calls listed functions sequentially to load and process the user data.
 */
async function userSession() {
    await loadTaskData();
    loadHtmlTemplates();
    greeting();
    checkIfMobileOrDesktopGreeting();
}


/**
 * calls listed functions sequentially to load and process the user data.
 */
async function loadTaskData() {
    await countTasksAssignedToUser();
    await amountOfToDoTasksAssignedToUser();
    await amountOfDoneTasksAssignedToUser();
    await amountOfLowTasksAssignedToUser();
    await amountOfMediumTasksAssignedToUser();
    await amountOfUrgentTasksAssignedToUser();
    await amountOfTasksInProgressAssignedToUser();
    await amountOfTasksAwaitingFeedbackAssignedToUser();
    deadlineDate = await nextTaskDeadlineAssignedToUser();
}


/**
 * Counts the number of tasks assigned to the user in the provided user data 'tasks' object.
 * @param {string} email - The user's email address.
 * @param {object} data - The user data object.
 * @returns {number} - The number of tasks assigned to the user.
 */
async function checkAmountOfTasksAssignedToUser(userName, data) {
    let taskCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.name) {
                if (task.name.includes(userName)) {
                    taskCount++;
                }
            }
        });
    }
    return taskCount;
}


/**
 * 
 * Fetches user data and calls checkAmountOfTasksAssignedToUser to count assigned tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} tasksInBoard - stores the amount of tasks in the board.
 * @returns {number|undefined} - returns `undefined` in case an error occurred.
 */
async function countTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInBoard = await checkAmountOfTasksAssignedToUser(userName, data);
        return tasksInBoard;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * @param {Object} data - data object containing the tasks.
 * @param {string} statusValue - status value to check for.
 * @param {number} statusCount - stores the amount of tasks that match the specified status value.
 * @returns {number} - returns the value stored in 'statusCount'
 */
async function checkStatusOfTasksAssignedToUser(data, statusValue) {
    let statusCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.name) {
                if (task.name.includes(userName)) {
                    if (task.status === statusValue) {
                        statusCount++;
                    }
                }
            }
        });
    }
    return statusCount;
}


/**
 * Counts the number of tasks with a status of "todo".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "todo" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} toDo - stores the amount of tasks that match the value 'todo'.
 * @returns {number} - returns the value stored in 'toDo'.
 */
async function amountOfToDoTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        toDo = await checkStatusOfTasksAssignedToUser(data, 'todo');
        return toDo;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a status of "done".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "done" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} done - stores the amount of tasks that match the value 'done'.
 * @returns {number} - returns the value stored in 'done'.
 */
async function amountOfDoneTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        done = await checkStatusOfTasksAssignedToUser(data, 'done');
        return done;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a status of "progress".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "progress" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} tasksInProgress - stores the amount of tasks that match the value 'progress'.
 * @returns {number} - returns the value stored in 'progress'.
 */
async function amountOfTasksInProgressAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInProgress = await checkStatusOfTasksAssignedToUser(data, 'in-progress');
        return tasksInProgress;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a status of "feedback".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "feedback" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} tasksInFeedback - stores the amount of tasks that match the value 'feedback'.
 * @returns {number} - returns the value stored in 'feedback'.
 */
async function amountOfTasksAwaitingFeedbackAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInFeedback = await checkStatusOfTasksAssignedToUser(data, 'await-feedback');
        return tasksInFeedback;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/** 
 * Iterates over the tasks in the provided data and checks if their priority matches the given priority value.
 * every time the priority matches, the counter is raised by 1. 
 * @param {Object} data - data object containing the tasks.
 * @param {string} priorityValue - priority value to check for.
 * @param {number} priorityCount - stores the amount of tasks that match the specified priority value.
 * @returns {number} - returns the value stored in 'priorityCount'
 */
async function checkPriorityOfTasksAssignedToUser(data, priorityValue) {
    let priorityCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.name) {
                if (task.name.includes(userName)) {
                    if (task.priority === priorityValue) {
                        priorityCount++;
                    }
                }
            }
        });
    }
    return priorityCount;
}


/**
 * Counts the number of tasks with a priority of "low".
 * Fetches data from the base URL, extracts the task priority properties and calls `checkPriorityOfTasks` to count the "low" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} low - stores the amount of tasks that match the value 'low'.
 * @returns {number} - returns the value stored in 'low'.
 */
async function amountOfLowTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        low = await checkPriorityOfTasksAssignedToUser(data, 'low');
        return low;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a priority of "medium".
 * Fetches data from the base URL, extracts the task priority properties and calls `checkPriorityOfTasks` to count the "medium" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} medium - stores the amount of tasks that match the value 'medium'.
 * @returns {number} - returns the value stored in 'medium'.
 */
async function amountOfMediumTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        medium = await checkPriorityOfTasksAssignedToUser(data, 'medium');
        return medium;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a priority of "urgent".
 * Fetches data from the base URL, extracts the task priority properties and calls `checkPriorityOfTasks` to count the "urgent" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} urgent - stores the amount of tasks that match the value 'urgent'.
 * @returns {number} - returns the value stored in 'urgent'.
 */
async function amountOfUrgentTasksAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        urgent = await checkPriorityOfTasksAssignedToUser(data, 'urgent');
        return urgent;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}