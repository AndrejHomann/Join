/**
 * Takes a German date format string (DD.MM.YYYY) and checks if it's after today's date.
 * @param {string} deadline - The task deadline in German date format.
 * @param {date} formattedDeadline - transforms deadline date object to standard object type format.
 * @param {date} today - defines and transforms todays date object to integer.
 * @param {boolean} result - checks if deadline is greater than todays date.
 * @returns {boolean} - true if the deadline is after today, false otherwise.
 */
function checkIfDeadlineLaterThanToday(deadline) {
    let newDeadlineFormat = new Date(deadline);
    let formattedDeadline = newDeadlineFormat.setHours(0,0,0,0);
    let today = new Date();
    let formattedToday = today.setHours(0,0,0,0);
    let result = formattedDeadline >= formattedToday;
    return result;
}


/**
 * @param {Array} dateArray - stores the pushed dates lying in the future.
 * @param {} earliestDate - stores the converted value from German date format to a date object.
 * @returns {date} - the next upcoming date in the array.
 */
function findEarliestDate(dateArray) {
    let earliestDate = new Date(dateArray[0]); 
    for (let i = 1; i < dateArray.length; i++) {
        let currentDate = new Date(dateArray[i]);
        if (currentDate <= earliestDate) {
            earliestDate = currentDate;
        }
    }
    return earliestDate;
}


/**
 * Formats a date object into a German date string (DD.MM.YYYY).
 * @param {Date} dateObject - The date object to format.
 * @returns {string} - formatted date string in German format (DD.MM.YYYY).
 */
function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}


/**
 * Pushes upcoming task deadlines assigned to the user into the array 'deadlineArray'.
 * @param {string} email - The user's email address.
 * @param {object} data - The user data object.
 * @param {Array} deadlineArray - stores the pushed date objects.
 * @returns {void} - doesn't return a value.
 */
async function pushDatesIntoDeadlineArray(data) {
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.name && task.date) {
                if (task.name.includes(userName)) {
                    if (checkIfDeadlineLaterThanToday(task.date) === true) {
                        deadlineArray.push(task.date);
                    }
                }
            }
        });
    }
}


/**
 * Retrieves the next task deadline.
 * Fetches data from the specified URL, extracts task information, calculates deadlines, finds the earliest deadline, and formats it.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {date} earliestDeadlineFormatted - finds the date object with the nearest upcoming date in the array 'deadlineArray'.
 * @param {date} earliestDeadline - formats the earliest upcoming date object.
 * @returns {string} - returns stored and formatted string value in 'earliestDeadline' or `undefined` if an error occurred.
 */
async function nextTaskDeadlineAssignedToUser() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        await pushDatesIntoDeadlineArray(data);
        await checkIfDeadlineArrayEmpty(deadlineArray);
        await checkTaskPriorityOfNextDeadline(data);
        return {earliestDeadline, deadlineText, nextTaskPriority};
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * checks if the deadline array is empty or not and according to the result it changes the deadline and text and styles
 * @param {*} deadlineArray - contains all deadlines assigned to logged in user 
 */
async function checkIfDeadlineArrayEmpty(deadlineArray) {
    if(deadlineArray != "") {
        let earliestDeadlineFormatted = findEarliestDate(deadlineArray);
        earliestDeadline = formatDate(earliestDeadlineFormatted);
        deadlineText = "Upcoming Deadline";
        mainContentLine2Middle.style = "padding-right: 8px";
        mainContentLine2Right.style = "padding-right: 50px";
    } else {
        earliestDeadline = "No tasks";
        deadlineText = "No deadline";
        mainContentLine2Middle.style = "padding-right: 10px";
        mainContentLine2Right.style = "padding-right: 107px";
    }
}


/**
 * finds the task with the earliest Deadline and extracts the priority of this task
 * @param {date} earliestDeadlineFormatted - stores the earliest Deadline in original / america format
 * @param {*} nextTaskPriority - stores the priority of the next task in the timeline
 */
async function checkTaskPriorityOfNextDeadline(data) {
    const dateParts = earliestDeadline.split('.');
    const earliestDeadlineFormatted = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.name) {
                if (task.name.includes(userName) && task.date === earliestDeadlineFormatted) {
                    if (task.status !== "done") {
                        nextTaskPriority = task.priority;
                        return nextTaskPriority;
                    }
                }
            }
        });
    }
}

