const baseUrl = "https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/";

let email = "andrej@join.com";      // email-adress needs to be deleted as soon as function loadRememberedLogin() is active again
let password;
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
let nextTaskPriority = 'urgent';
let tasksInBoard = 0;
let tasksInProgress = 0;
let tasksInFeedback = 0;


// initializes the listed functions after the HTML-Body was loaded
async function init() {
    // loadRememberedLogin();                                       // uncomment as soon as function loadRememberedLogin() is active again
    console.log('logged in user:', email);
    await includeHTML();
    await loadUserData(); 
    await loadTaskData();
    loadHtmlTemplates();
}


/**
 * Loads saved user data from the local storage and fills the login form with it.
 * Also checks the "Remember me" checkbox if data is present.
 */

// function loadRememberedLogin() {
//     const rememberMe = localStorage.getItem('rememberMe') === 'true';
//     if (rememberMe) {
//         email = localStorage.getItem('email');
//         password = localStorage.getItem('password');
//     }
// }


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
    await findUserIdByEmail(email);
    await showUserNameById(firebaseUserId); 
}


// This function finds the user ID by referencing the user email
async function findUserIdByEmail(email) {
    try {
        const response = await fetch(`${baseUrl}/user.json`);               // HTTP-Request in user list
        const userData = await response.json();
        for (const userId in userData) {
            if (userData[userId].email === email) {
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


// This function finds the user name by referencing the user ID
async function showUserNameById(id) {
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





// This function requests the tasks from the database
async function loadTaskData() {
    await countTasks();
    // await countTasksAssignedToUser(email);
    await amountOfToDoTasksAssignedToUser(email);
    await amountOfDoneTasksAssignedToUser(email);
    await amountOfTasksInProgressAssignedToUser(email);
    await amountOfTasksAwaitingFeedbackAssignedToUser(email);
    await amountOfTasksAssignedToUser(email);
    await findTaskIdByEmail(email);
    await showTaskStatusById(firebaseTaskId);
    await showTaskPriorityById(firebaseTaskId);
    await showTaskDeadlineById(firebaseTaskId);
    amountPriority(urgent, medium, low);
}


async function countTasks() {
    let taskArrayLength;
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        // Überprüfe, ob das "tasks"-Objekt existiert und nicht null oder undefined ist
        if (data && data.tasks) {
            // Zähle die Schlüssel im "tasks"-Objekt
            taskArrayLength = Object.keys(data.tasks).length;
        } else {
            console.error("JSON does not include 'tasks' object or is invalid.");
        }
        console.log("tasks in board:", taskArrayLength);
        tasksInBoard = taskArrayLength;
        return tasksInBoard;
    } catch (error) {
        console.error("error whilte fetching task data:", error);
    }
}


// async function countTasksAssignedToUser(email) {
//     let count = 0;

//     try {
//       const response = await fetch(`${baseUrl}.json`);
//       const data = await response.json();
  
//       if (data && data.tasks) {
//         // Filtere die Aufgaben, die "andrej@join.com" zugewiesen sind
//         const filteredTasks = Object.values(data.tasks).filter(task => task.assignment === email);
  
//         // Zähle die gefilterten Aufgaben
//         count = filteredTasks.length;
//         console.log(`amount of tasks for user: ' ${email}:`, count);
//       } else {
//         console.error("JSON does not include 'tasks' object or is invalid.");
//       }
//     } catch (error) {
//       console.error("error whilte fetching task data:", error);
//     }
//     console.log('amoount of user to do tasks: ', count);
//     return count;
// }


async function amountOfTasksAssignedToUser(email) {
    let count = 0;
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        if (data && data.tasks) {
            Object.values(data.tasks).forEach(task => {
                if (task.assignment) {
                    const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
                    if (Array.isArray(assignments)) {
                        assignments.forEach(assignment => {
                            if(assignment.email === email) {
                                count++;
                            }
                        });
                    } 
                } 
            });
        } else {
          console.error("there is no 'tasks' object or it is invalid.");
        }
        console.log('tasks assigned to user:', count);
        return count;
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
}


async function amountOfToDoTasksAssignedToUser(email) {
    let count = 0;
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
    
        if (data && data.tasks) {
          Object.values(data.tasks).forEach(task => {
            if (task.assignment && task.status === "todo") {
              const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
              if (Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                  if (assignment.email === email) {
                    count++;
                  }
                });
              }
            }
          });
        } else {
          console.error("there is no 'tasks' object or it is invalid.");
        }
        console.log("tasks assigned to user with status 'todo':", count);
        toDo = count;
        return toDo;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfDoneTasksAssignedToUser(email) {
    let count = 0;
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        if (data && data.tasks) {
          Object.values(data.tasks).forEach(task => {
            if (task.assignment && task.status === "done") {
              const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
              if (Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                  if (assignment.email === email) {
                    count++;
                  }
                });
              }
            }
          });
        } else {
          console.error("there is no 'tasks' object or it is invalid.");
        }
        console.log("tasks assigned to user with status 'done':", count);
        done = count;
        return done;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfTasksInProgressAssignedToUser(email) {
    let count = 0;
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        if (data && data.tasks) {
          Object.values(data.tasks).forEach(task => {
            if (task.assignment && task.status === "progress") {
              const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
              if (Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                  if (assignment.email === email) {
                    count++;
                  }
                });
              }
            }
          });
        } else {
          console.error("there is no 'tasks' object or it is invalid.");
        }
        console.log("tasks assigned to user with status 'progress':", count);
        tasksInProgress = count;
        return tasksInProgress;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfTasksAwaitingFeedbackAssignedToUser(email) {
    let count = 0;
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        if (data && data.tasks) {
          Object.values(data.tasks).forEach(task => {
            if (task.assignment && task.status === "feedback") {
              const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
              if (Array.isArray(assignments)) {
                assignments.forEach(assignment => {
                  if (assignment.email === email) {
                    count++;
                  }
                });
              }
            }
          });
        } else {
          console.error("there is no 'tasks' object or it is invalid.");
        }
        console.log("tasks assigned to user with status 'feedback':", count);
        tasksInFeedback = count;
        return tasksInFeedback;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


// This function finds the tasks by referencing the user email
async function findTaskIdByEmail(email) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);      // HTTP-Request in task list
        const taskData = await response.json();
        // Loop through each task in the data
        for (const taskId in taskData) {
            const task = taskData[taskId];
            const assignmentsArray = JSON.parse(task.assignment);       // Parse the stringified array
            // Loop through each assignment within the task
            for (const assignment of assignmentsArray) {
                if (assignment.email === email) {
                firebaseTaskId = taskId;
                return firebaseTaskId;                                  // Return immediately after finding a match
                }
            }
        }
        return taskId;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
    // console.log("The Firebase task id is:", taskId);
}


//This function shows the task status by referencing the user ID
async function showTaskStatusById(firebaseTaskId) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);      // HTTP-Request in task list
        const taskData = await response.json();
        taskStatus = taskData[firebaseTaskId].status;
        return taskStatus;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


// This function shows the task priority by referencing the user ID
async function showTaskPriorityById(firebaseTaskId) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);      // HTTP-Request in task list
        const data = await response.json();
        taskPriority = data[firebaseTaskId].priority;
        return taskPriority;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


// This function counts the amount of tasks by priority type 
function amountPriority(taskPriority, urgent, medium, low) {
    if (taskPriority == 'urgent') {
        urgent++;
    } else if (taskPriority == 'medium') {
        medium++;
    } else if (taskPriority == 'low') {
        low++;
    }
    return {urgent, medium, low};
}


// This function shows the task deadline by referencing the user ID
async function showTaskDeadlineById(firebaseTaskId) {
    try {
        const response = await fetch(`${baseUrl}/tasks.json`);      // HTTP-Request in task list
        const data = await response.json();
        taskDeadline = data[firebaseTaskId].date;
        return taskDeadline;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}






// HTML Templates
function loadHtmlTemplates() {
    toDoUser(toDo);
    doneUser(done);
    priorityUser(nextTaskPriority, urgent, medium, low);
    taskDeadlineUser(taskDeadline);
    tasksInBoardUser(tasksInBoard);
    tasksInProgressUser(tasksInProgress);
    tasksInFeedbackUser(tasksInFeedback);
    greetUser(userName);
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
        <div class="center"> <span class="mainContentLineTextTop">${medium}</span> </div>          
        <div> <span class="mainContentLineTextBottom">${nextTaskPriority}</span> </div>
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


function createPriorityLogoAndColor() {
    let priority = document.getElementById('createPriorityLogoAndColor');
    priority.innerHTML = /*html*/ `
        <div id="mainContentLine2Circle">
            <img id="priorityIcon" src="../img/summary/urgent_white.svg" alt="Priority Icon">
        </div>
    `;
    changePriorityLogoAndColor(nextTaskPriority);
}





// After HTML content was loaded, change images on hover
document.addEventListener('DOMContentLoaded', function() {          //this code will be executed as soon as all referenced HTML elements are loaded
    changeToDoStatsOnHover();
    changeDoneStatsOnHover();
});


function changeToDoStatsOnHover() {
    const toDo = document.getElementById('toDo');
    const editImage = document.getElementById('edit');
    toDo.addEventListener('mouseover', function() {
        editImage.src = '../img/summary/edit_hover.svg';
    });
    toDo.addEventListener('mouseout', function() {
        editImage.src = '../img/summary/edit.png';
    });
}


function changeDoneStatsOnHover() {
    const done = document.getElementById('done');
    const checkImage = document.getElementById('check');
    done.addEventListener('mouseover', function() {
        checkImage.src = '../img/summary/check_hover.svg';
    });
    done.addEventListener('mouseout', function() {
        checkImage.src = '../img/summary/check.png';
    });
}


function changePriorityLogoAndColor(nextTaskPriority) { 
    let priorityLogo = document.getElementById('priorityIcon');
    let priorityLogoBackground = document.getElementById('mainContentLine2Circle');
    if (nextTaskPriority == 'urgent') {
        priorityLogo.src = '../img/summary/urgent_white.svg';
        priorityLogoBackground.style = 'background-color: rgb(255, 60, 0)';
    } else if (nextTaskPriority == 'medium') {
        priorityLogo.src = '../img/summary/medium_white.svg';
        priorityLogoBackground.style = 'background-color: rgb(255, 166, 0)';
    } else if (nextTaskPriority == 'low') {
        priorityLogo.src = '../img/summary/low_white.svg';
        priorityLogoBackground.style = 'background-color: rgb(121, 227, 41)';
    }
    return;
}