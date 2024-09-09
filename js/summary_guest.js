// initializes the listed functions while loading the HTML-Body
async function guestSession() {
    userName = "Guest";
    await loadTaskDataGuest();
    loadHtmlTemplates();
    greeting();
    checkIfMobileOrDesktopGreeting();
} 


// This function requests the tasks from the database
async function loadTaskDataGuest() {
    await countTasks();
    await amountOfToDoTasks();
    await amountOfDoneTasks();
    await amountOfUrgentTasks();
    await amountOfTasksInProgress();
    await amountOfTasksAwaitingFeedback();
    await nextTaskDeadline();
}


async function countTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        if (data && data.tasks) {
            tasksInBoard = Object.keys(data.tasks).length;
        } else {
            console.error("JSON does not include 'tasks' object or is invalid.");
        }
        console.log("tasks in board:", tasksInBoard);
        return tasksInBoard;
    } catch (error) {
        console.error("error while fetching task data:", error);
    }
}


async function checkStatusOfTasks(data, statusValue) {
    let statusCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && task.status === `${statusValue}`) {
                statusCount++;
            }
        });
    } 
    return statusCount;
}


async function amountOfToDoTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        toDo = await checkStatusOfTasks(data, 'todo');
        console.log("tasks with status 'todo':", toDo);
        return toDo;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfDoneTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        done = await checkStatusOfTasks(data, 'done');
        console.log("tasks with status 'done':", done);
        return done;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfTasksInProgress() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInProgress = await checkStatusOfTasks(data, 'progress');
        console.log("tasks assigned to user with status 'progress':", tasksInProgress);
        return tasksInProgress;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function amountOfTasksAwaitingFeedback() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInFeedback = await checkStatusOfTasks(data, 'feedback');
        console.log("tasks with status 'feedback':", tasksInFeedback);
        return tasksInFeedback;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function checkPriorityOfTasks(data, priorityValue) {
    let priorityCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && task.priority === `${priorityValue}` && task.status !== "done") {
                priorityCount++;
            }
        });
    } 
    return priorityCount;
}


async function amountOfUrgentTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        urgent = await checkPriorityOfTasks(data, 'urgent');
        console.log("tasks assigned to user with priority 'urgent':", urgent);
        return urgent;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


async function pushDatesIntoDeadlineArrayGuest(data) {
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            const assignments = typeof task.assignment === 'string' ? JSON.parse(task.assignment) : task.assignment;
            if (task.assignment && checkIfDeadlineLaterThanToday(task.date) === true) {
                deadlineArray.push(task.date);
            }
        });
    } 
}


// This function shows the next task deadline
async function nextTaskDeadline() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        await pushDatesIntoDeadlineArrayGuest(data);
        let earliestDeadlineFormatted = findEarliestDate(deadlineArray);
        earliestDeadline = formatDate(earliestDeadlineFormatted);
        console.log("deadline Array:", deadlineArray);
        console.log('the next deadline is:', earliestDeadline);
        return earliestDeadline;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}