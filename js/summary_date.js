/**
 * Takes a German date format string (DD.MM.YYYY) and checks if it's after today's date.
 * @param {string} deadline - The task deadline in German date format.
 * @param {date} formattedDeadline - transforms deadline date object to standard object type format.
 * @param {date} today - defines and transforms todays date object to integer.
 * @param {boolean} result - checks if deadline is greater than todays date.
 * @returns {boolean} - true if the deadline is after today, false otherwise.
 */
function checkIfDeadlineLaterThanToday(deadline) {
    let parts = deadline.split('.');
    let dividedDeadline = parts[2] + '-' + parts[1] + '-' + parts[0];
    let newDeadlineFormat = new Date(dividedDeadline);
    let formattedDeadline = newDeadlineFormat.getTime();
    let today = new Date();
    let formattedToday = today.getTime();
    let result = formattedDeadline > formattedToday;
    return result;
}


/**
 * @param {Array} dateArray - stores the pushed dates lying in the future.
 * @param {} earliestDate - stores the converted value from German date format to a date object.
 * @returns {date} - the next upcoming date in the array.
 */
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


/**
 * Retrieves the next task deadline.
 * Fetches data from the specified URL, extracts task information, calculates deadlines, finds the earliest deadline, and formats it.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {date} earliestDeadlineFormatted - finds the date object with the nearest upcoming date in the array 'deadlineArray'.
 * @param {date} earliestDeadline - formats the earliest upcoming date object.
 * @returns {string} - returns stored and formatted string value in 'earliestDeadline' or `undefined` if an error occurred.
 */
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