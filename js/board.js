let kanbanCategories = [
    {
        "taskareaHeadline": "To do",
        "taskareaCategorie": "todo"
    },
    {
        "taskareaHeadline": "In progress",
        "taskareaCategorie": "inprogress"
    },
    {
        "taskareaHeadline": "Await feedback",
        "taskareaCategorie": "awaitfeedback"
    },
    {
        "taskareaHeadline": "Done",
        "taskareaCategorie": "done"
    }
];

let tasksFromApi = {}; // Globale Variable für Tasks

function renderBoard() {
    let boardContent = document.getElementById('boardContent');
    boardContent.innerHTML = '';

    boardContent.innerHTML += `
        <div class="boardFindTaskAddTaskDiv">
            <h1>Board</h1>
            <div class="FindInputAndAddButton">
                <div class="inputDiv">
                    <input class="inputFindTask" oninput="findTask()" placeholder="Find Task" type="text" id="findTask">
                    <div class="inputSeperatorDiv"></div>
                    <img class="searchIcon" src="./assets/icons/input_search.png" alt="searchIcon">
                </div>
                <div>
                    <button class="addTaskButton" onclick="openAddTask()">
                        <span class="AddTaskSpan">Add Task</span>
                        <img class="addTaskPlusIcon" src="./assets/icons/add.png" alt="">
                    </button>
                </div>
            </div>
        </div>
        <div class="inputDiv2">
            <input class="inputFindTask2" oninput="findTask()" placeholder="Find Task" type="text" id="findTask2">
            <div class="inputSeperatorDiv2"></div>
            <img class="searchIcon2" src="./assets/icons/input_search.png" alt="searchIcon">
        </div>
        <div class="kanbanBoard" id="kanbanBoard"></div>
    `;

    let kanbanBoard = document.getElementById('kanbanBoard');
    let html = '';

    for (let index = 0; index < kanbanCategories.length; index++) {
        let category = kanbanCategories[index];
        html += `
            <div class="kanbanSplit">
                <div class="kanbanHeadlineDiv">
                    <span class="kanbanCategorieSpan" id="taskareaHeadline${index}">${category.taskareaHeadline}</span>
                    <img class="kanbanPlusButton" onclick="openAddTask()" src="./assets/icons/plus button.png" alt="">
                </div>
                <div class="taskArea" id="${category.taskareaCategorie}" 
                    ondrop="drop(event, '${category.taskareaCategorie}')" 
                    ondragover="allowDrop(event)" 
                    ondragleave="dragLeave(event)">
                </div>
            </div>
        `;
    }

    kanbanBoard.innerHTML = html;

    // TaskDetailsWrapper sicher initial verstecken
    const taskDetailsWrapper = document.getElementById('taskDetailsWrapper');
    taskDetailsWrapper.classList.add('d-none');

    // Event Listener für boardTask-Elemente hinzufügen
    const boardTasks = document.querySelectorAll('.boardTask');
    boardTasks.forEach(task => {
        task.addEventListener('click', function() {
            const taskId = this.id;
            openTaskDetails(taskId);
        });
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function dragLeave(event) {
    event.preventDefault();
}

function drop(event, category) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let task = document.getElementById(taskId);
    event.target.appendChild(task);
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function getColorClassForInitial(initial) {
    return `color-${initial}`;
}

// Daten aus der API abrufen
fetch('https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        tasksFromApi = data.tasks;  // Globale Variable nutzen

        for (let taskId in tasksFromApi) {
            if (tasksFromApi.hasOwnProperty(taskId)) {
                let task = tasksFromApi[taskId];

                if (!task.status) {
                    continue;
                }

                let taskAreaId = '';
                switch (task.status) {
                    case 'todo':
                        taskAreaId = 'todo';
                        break;
                    case 'progress':
                        taskAreaId = 'inprogress';
                        break;
                    case 'feedback':
                        taskAreaId = 'awaitfeedback';
                        break;
                    case 'done':
                        taskAreaId = 'done';
                        break;
                    default:
                        continue;
                }

                let categoryClass = '';
                let categoryText = '';

                if (task.category === 'technical') {
                    categoryClass = 'technicalTaskDiv';
                    categoryText = 'Technical Task';
                } else if (task.category === 'story') {
                    categoryClass = 'UserStoryTaskDiv';
                    categoryText = 'User Story';
                }

                let progressBarHtml = '';
                let subtaskCountHtml = '';
                if (task.subtask && task.subtask.length > 0) {
                    let wordCount = task.subtask.split(" ").length;
                    let progress = (wordCount === 1) ? '50%' : '100%';
                    progressBarHtml = `
                        <div class="progressbarSubtask">
                            <div class="filledProgressbar" style="width: ${progress};"></div>
                        </div>
                    `;
                    subtaskCountHtml = `
                        <div class="subtaskCount">${wordCount}/2 Subtasks</div> 
                    `;
                }

                let assignmentHtml = '';
                if (task.assignment) {
                    let assignments = JSON.parse(task.assignment);
                    assignmentHtml = assignments.map(assignee => {
                        let name = assignee.email.split('@')[0];
                        let initial = name.charAt(0).toUpperCase();
                        let colorClass = getColorClassForInitial(initial);
                        return `<div class="seperateDivForEveryUser ${colorClass}">${initial}</div>`;
                    }).join('');
                }

                let priorityImage = '';
                switch (task.priority) {
                    case 'low':
                        priorityImage = './assets/icons/priority_low.png';
                        break;
                    case 'medium':
                        priorityImage = './assets/icons/priority_medium.png';
                        break;
                    case 'urgent':
                        priorityImage = './assets/icons/priority_urgent.png';
                        break;
                }

                let taskHtml = `
                    <div class="boardTask" id="${taskId}" draggable="true" ondragstart="drag(event)">
                        <div class="addedTaskCategorie ${categoryClass}">${categoryText}</div>
                        <div class="TitleAndDescriptionDiv">
                            <div class="addedTaskTitle">${task.title}</div>
                            <div class="addedTaskDescription">${task.description}</div>
                        </div>
                        <div class="progressbarAndSubtask">
                            ${progressBarHtml}
                            ${subtaskCountHtml}
                        </div>
                        <div class="assignmentAndPriorityDiv">
                            <div class="assignedUsers">
                                ${assignmentHtml}
                            </div>
                            <div class="priorityDiv">
                                <img src="${priorityImage}" alt="Priority Icon">
                            </div>
                        </div>
                    </div>
                `;

                let taskArea = document.getElementById(taskAreaId);
                taskArea.innerHTML += taskHtml;
            }
        }

        // Event Listener für boardTask-Elemente nach dem Fetch hinzufügen
        const boardTasks = document.querySelectorAll('.boardTask');
        boardTasks.forEach(task => {
            task.addEventListener('click', function() {
                const taskId = this.id;
                openTaskDetails(taskId);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    function openTaskDetails(taskId) {
        const taskDetailsWrapper = document.getElementById('taskDetailsWrapper');
        taskDetailsWrapper.classList.remove('d-none');
    
        let task = tasksFromApi[taskId];
    
        if (!task) {
            console.error('Task not found for ID:', taskId);
            return;
        }
    
        let categorybg = '';
        let categoryText = '';
    
        if (task.category === 'technical') {
            categorybg = 'technicalTaskBgColor';
            categoryText = 'Technical Task';
        } else if (task.category === 'story') {
            categorybg = 'userStoryBgColor';
            categoryText = 'User Story';
        }
    
        // Dynamisches Prioritäts-Icon für die Task-Details
        let priorityImage = '';
        let priorityText = ''; // Neue Variable für den Prioritätstext
        switch (task.priority) {
            case 'low':
                priorityImage = './assets/icons/priority_low.png';
                priorityText = 'Low';  // Setze den Text für "low"
                break;
            case 'medium':
                priorityImage = './assets/icons/priority_medium.png';
                priorityText = 'Medium';  // Setze den Text für "medium"
                break;
            case 'urgent':
                priorityImage = './assets/icons/priority_urgent.png';
                priorityText = 'Urgent';  // Setze den Text für "urgent"
                break;
        }
    
        // Zuordnungs-HTML erstellen
        let assignmentHtml = '';
        let assignmentNames = '';
        if (task.assignment) {
            try {
                let assignments = JSON.parse(task.assignment);
                assignmentHtml = assignments.map(assignee => {
                    let name = assignee.email.split('@')[0];
                    let initial = name.charAt(0).toUpperCase();
                    let colorClass = getColorClassForInitial(initial);
                    return `<div class="seperateDivForEveryUser ${colorClass}">${initial}</div>`;
                }).join('');
                // Nur die Vornamen für die Anzeige in der Taskdetails verwenden
                assignmentNames = assignments.map(assignee => {
                    let name = assignee.email.split('@')[0];
                    return name.charAt(0).toUpperCase() + name.slice(1); // Vorname mit Großbuchstaben
                }).join(', ');
            } catch (e) {
                console.error('Error parsing assignment data:', e);
            }
        }
    
        let assignmentInTaskDetails = '';
        if (task.assignment) {
            try {
                let assignments = JSON.parse(task.assignment);
                assignmentInTaskDetails = assignments.map(assignee => {
                    let name = assignee.email.split('@')[0];
                    let initial = name.charAt(0).toUpperCase();
                    let colorClass = getColorClassForInitial(initial);
                    let formattedName = name.charAt(0).toUpperCase() + name.slice(1); // Vorname mit Großbuchstaben
                    return `
                        <div class="userAssignment">
                            <div class="seperateDivForEveryUserInTaskDetails ${colorClass}">${initial}</div>
                            <span>${formattedName}</span>
                        </div>`;
                }).join('');
            } catch (e) {
                console.error('Error parsing assignment data:', e);
            }
        }
    
        let taskDetailsHTML = `
<div class="taskDetailsDiv">
    <div class="categorieAndCloseButton">
        <div class="categorieInTaskDetails ${categorybg}">${categoryText}</div>
        <div class="closeButtonDiv" onclick="closeTaskDetails()">
            <img src="./assets/icons/closeBtn.png" alt="">
        </div>
    </div>
    <div class="detailSection">
        <h2>${task.title}</h2>
        <span class="descriptionSpan"><span>${task.description}</span><br>
        <div class="dueDateDiv">Due date: <span>${task.date}</span></div>
        <div class="taskPriority">
            <div>Priority:</div>
            <div class="priorityTextAndIcon">
                <span>${priorityText}</span>
                <img src="${priorityImage}" alt="Priority Icon">
            </div>
        </div>
        <div class="taskDetailsInfo">
            <div class="assignedUsersInTaskDetails">
                <div><span>Assigned To:</span></div>
                <div class="sectionAssignedUsers">
                    ${assignmentInTaskDetails}
                </div>
            </div>
        </div>
    </div>
    <div class="subtaskSection">
        <div><span>Subtasks</span></div>
        <div class="addedSubtasksDiv">${renderSubtasks(task.addedSubtasks)}</div>
    </div>
    <div class="deleteAndEditDiv">
        <div class="deleteDiv" onclick="deleteTask()"><img src="./assets/icons/delete.png" alt=""><span>Delete</span></div>
        <div class="eleteEditSeperator"></div>
        <div class="editDiv"><img src="./assets/icons/edit.png" alt=""><span>Edit</span></div>
    </div>
</div>
    `;

    taskDetailsWrapper.innerHTML = taskDetailsHTML;
}

function renderSubtasks(addedSubtasks, taskId) {
    if (!addedSubtasks || addedSubtasks.length === 0) {
        return '<div>No subtasks</div>';
    }

    let subtasksArray = Array.isArray(addedSubtasks) ? addedSubtasks : addedSubtasks.split(',');

    return subtasksArray.map((subtask, index) => {
        let isChecked = getSubtaskStatus(taskId, index);  // Status aus localStorage lesen
        let iconSrc = isChecked ? './assets/icons/checkBtn.png' : './assets/icons/checkBtnEmpty.png';

        return `
            <div class="subtaskItem" onclick="toggleSubtaskStatus('${taskId}', ${index}, this)">
                <img src="${iconSrc}" alt="check icon">
                <span>${subtask}</span>
            </div>
        `;
    }).join('');
}

function toggleSubtaskStatus(taskId, subtaskIndex, imgElement) {
    let isChecked = getSubtaskStatus(taskId, subtaskIndex);
    let newStatus = !isChecked;
    
    // Bild wechseln
    imgElement.src = newStatus ? './assets/icons/checkBtn.png' : './assets/icons/checkBtnEmpty.png';
    
    // Status in localStorage speichern
    saveSubtaskStatus(taskId, subtaskIndex, newStatus);
}

function saveSubtaskStatus(taskId, subtaskIndex, status) {
    let taskStatus = JSON.parse(localStorage.getItem('subtaskStatus')) || {};
    
    // Status für die Aufgabe und Subtask speichern
    if (!taskStatus[taskId]) {
        taskStatus[taskId] = {};
    }
    taskStatus[taskId][subtaskIndex] = status;

    localStorage.setItem('subtaskStatus', JSON.stringify(taskStatus));
}

function getSubtaskStatus(taskId, subtaskIndex) {
    let taskStatus = JSON.parse(localStorage.getItem('subtaskStatus')) || {};
    
    // Status des Subtasks zurückgeben (standardmäßig false)
    return taskStatus[taskId] ? taskStatus[taskId][subtaskIndex] : false;
}

function markSubtaskAsDone(index) {
    let img = document.getElementById(`subtaskCheck${index}`);
    img.src = './assets/icons/checkBtn.png';  // Bild ändern
}
    



    function closeTaskDetails() {
        const taskDetailsWrapper = document.getElementById('taskDetailsWrapper');
        taskDetailsWrapper.classList.add('d-none');
        
        // Bestätigungsdiv schließen
        closeConfirmationDiv();
    }
    
    function deleteTask(taskId) {
        // Div für das Bestätigungs-Popup erstellen
        const confirmationDiv = document.createElement('div');
        confirmationDiv.classList.add('deleteConfirmationDiv');
        confirmationDiv.innerHTML = `
            <div class="confirmationText">Delete task?</div>
            <div class="confirmationButtons">
                <button class="yesButton" onclick="confirmDeleteTask('${taskId}')">Yes</button>
                <button class="noButton" onclick="closeConfirmationDiv()">No</button>
            </div>
        `;
        
        // Die div zum Body hinzufügen und Task-Details darüber legen
        document.body.appendChild(confirmationDiv);
    }
    
    function closeConfirmationDiv() {
        // Bestätigungsdiv entfernen
        const confirmationDiv = document.querySelector('.deleteConfirmationDiv');
        if (confirmationDiv) {
            confirmationDiv.remove();
        }
    }
    
    function confirmDeleteTask(taskId) {
        console.log('Versuche, Aufgabe mit ID zu löschen:', taskId); // Debugging-Ausgabe
    
        if (!taskId) {
            console.error('Kein taskId angegeben');
            return; // Beende die Funktion, wenn taskId nicht vorhanden ist
        }
    
        fetch(`https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json(); // Optional, je nach API
        })
        .then(() => {
            console.log('Aufgabe erfolgreich gelöscht');
            // Weitere Logik hier...
        })
        .catch(error => {
            console.error('Fehler beim Löschen der Aufgabe:', error);
        });
    }