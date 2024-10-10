const BASE_URL = 'https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/';

let tasksArray = [];

document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    includeHTML();
});

async function loadTasks() {
    try {
        const response = await fetch(`${BASE_URL}tasks.json`);
        const data = await response.json();

        tasksArray = Object.keys(data).map(key => {
            return {
                id: key,
                ...data[key]
            };
        });

        displayTasks();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

function displayTasks() {
    console.log("Anzahl Aufgaben:", tasksArray.length);

    document.querySelector('#toDoColumn .tasks-container').innerHTML = '';
    document.querySelector('#inProgressColumn .tasks-container').innerHTML = '';
    document.querySelector('#awaitFeedbackColumn .tasks-container').innerHTML = '';
    document.querySelector('#doneColumn .tasks-container').innerHTML = '';

    tasksArray.forEach(task => {
        console.log(`Aufgabe: ${task.title}, Status: ${task.status}`);
        assignTaskToColumn(task);
    });

    checkEmptyColumns();
    addDragAndDropListeners();
}

function checkEmptyColumns() {
    const columns = [
        { selector: '#toDoColumn', message: 'No tasks To do' },
        { selector: '#inProgressColumn', message: 'No tasks In progress' },
        { selector: '#awaitFeedbackColumn', message: 'No tasks Awaiting feedback' },
        { selector: '#doneColumn', message: 'No tasks Done' }
    ];

    columns.forEach(column => {
        const tasksContainer = document.querySelector(`${column.selector} .tasks-container`);
        if (tasksContainer.children.length === 0 || tasksContainer.querySelector('.task') === null) {
            tasksContainer.innerHTML = `<div class="column-feedback"><p class="no-tasks">${column.message}</p></div>`;
        } else {
            const placeholder = tasksContainer.querySelector('.column-feedback');
            if (placeholder) {
                placeholder.remove();
            }
        }
    });
}

function assignTaskToColumn(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const { subtasksDisplay, progressPercentage } = createSubtasksDisplay(task);
    taskDiv.innerHTML = createTaskHTML(task, subtasksDisplay, progressPercentage);

    setCategoryColor(taskDiv, task.category);

    const contactIcons = createContactIcons(task);
    const taskFooter = taskDiv.querySelector('.task-footer');
    if (taskFooter) {
        taskFooter.insertBefore(contactIcons, taskFooter.firstChild); // Icons in den Footer einfügen
    }

    addProgressBarIfSubtasks(taskDiv, task, progressPercentage); // Fortschrittsleiste hinzufügen, wenn es Subtasks gibt

    assignTaskToContainer(taskDiv, task.status); // Task zu einer Spalte zuweisen

    taskDiv.setAttribute('draggable', true);
    taskDiv.setAttribute('onclick', `openTaskDetail('${task.id}')`);
    taskDiv.id = `task-${task.id}`;
}

function createTaskHTML(task, subtasksDisplay, progressPercentage) {
    const priorityImage = getPriorityImage(task.priority);
    return `
        <span class="task-category">${task.category}</span>
        <h4>${task.title}</h4>
        <p class="task-description">${task.taskDescription}</p>
        
        <div class="task-subtasks-container">
            <div class="task-progress-bar">
                <div class="task-progress" style="width: ${progressPercentage}%"></div>
            </div>
            <p class="task-subtasks">${subtasksDisplay}</p>
        </div>

        <div class="task-footer">
            <img src="${priorityImage}" alt="${task.priority} Priority" class="task-priority-icon">
        </div>
    `;
}

function getPriorityImage(priority) {
    switch (priority) {
        case 'low':
            return '/img/lowPrio.png';
        case 'medium':
            return '/img/mediumPrio.png';
        case 'urgent':
            return '/img/highPrio.png';
        default:
            return '';
    }
}

function assignTaskToContainer(taskDiv, taskStatus) {
    const taskContainer = getColumnByStatus(taskStatus);
    if (taskContainer) {
        taskContainer.appendChild(taskDiv);
    }
}

function createSubtasksDisplay(task) {
    const totalSubtasks = task.addedSubtasks ? task.addedSubtasks.length : 0;
    const completedSubtasks = task.completedSubtasks ? task.completedSubtasks.length : 0;
    const subtasksDisplay = totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks} Subtasks` : "";
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return {
        subtasksDisplay,
        progressPercentage
    };
}

function addProgressBarIfSubtasks(taskDiv, task, progressPercentage) {
    const subtasksContainer = taskDiv.querySelector('.task-subtasks-container');

    if (task.addedSubtasks && task.addedSubtasks.length > 0) {
        const progressBar = subtasksContainer.querySelector('.task-progress');
        progressBar.style.width = `${progressPercentage}%`;
        subtasksContainer.style.display = 'flex'; // Sichtbar machen
    } else {
        subtasksContainer.style.display = 'none'; // Ausblenden, wenn keine Subtasks
    }
}

function createContactIcons(task) {
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'contact-icons-container';

    if (Array.isArray(task.name) && Array.isArray(task.color) && task.name.length === task.color.length) {
        task.name.forEach((userName, index) => {
            const userColor = task.color[index];
            const icon = createContactIcon(userName, userColor, 'small');
            iconsContainer.appendChild(icon);
        });
    } else {
        console.warn('Benutzer oder Farben sind nicht korrekt definiert');
    }

    return iconsContainer;
}

function getColumnByStatus(status) {
    if (status === 'todo') {
        return document.querySelector('#toDoColumn .tasks-container');
    } else if (status === 'inprogress') {
        return document.querySelector('#inProgressColumn .tasks-container');
    } else if (status === 'awaitfeedback') {
        return document.querySelector('#awaitFeedbackColumn .tasks-container');
    } else if (status === 'done') {
        return document.querySelector('#doneColumn .tasks-container');
    }
    return null;
}

function setCategoryColor(taskDiv, category) {
    if (category === 'User Story') {
        taskDiv.querySelector('span').classList.add('category-user-story');
    } else if (category === 'Technical Task') {
        taskDiv.querySelector('span').classList.add('category-technical-task');
    }
}

function addDragAndDropListeners() {
    const taskDivs = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.board-column');

    taskDivs.forEach(task => {
        task.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', task.id);
            task.classList.add('dragging'); // Klasse hinzufügen, um die Rotation anzuwenden
            task.style.transform = 'rotate(-5deg)'; // Drehung während des Drag-Vorgangs
        });

        task.addEventListener('dragend', () => {
            task.classList.remove('dragging'); // Klasse entfernen
            task.style.transform = 'rotate(0deg)'; // Zurücksetzen der Drehung
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        column.addEventListener('drop', (event) => {
            event.preventDefault();
            const taskId = event.dataTransfer.getData('text/plain');
            const taskElement = document.getElementById(taskId);
            const newStatus = column.getAttribute('data-status');

            console.log(`TaskID: ${taskId}, Neuer Status: ${newStatus}`);

            const tasksContainer = column.querySelector('.tasks-container');
            tasksContainer.appendChild(taskElement);

            updateTaskStatus(taskId, newStatus);
            checkEmptyColumns();
        });
    });
}

function updateTaskStatus(taskId, newStatus) {
    const taskIndex = tasksArray.findIndex(t => `task-${t.id}` === taskId); // Suche die Aufgabe anhand der ID
    const task = tasksArray[taskIndex];

    if (task) {
        task.status = newStatus;

        console.log(`Aktualisiere Status für Aufgabe: ${task.title}, Neuer Status: ${newStatus}`);

        fetch(`${BASE_URL}tasks/${task.id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        }).then(response => {
            if (response.ok) {
                console.log(`Aufgabe ${task.title} erfolgreich aktualisiert!`);
            } else {
                console.error('Fehler beim Aktualisieren der Aufgabe.');
            }
        }).catch(error => {
            console.error('Netzwerkfehler:', error);
        });
    } else {
        console.error('Aufgabe nicht gefunden!');
    }
}

loadTasks();

function createTaskFromBoard() {
    const createTask = document.getElementById('addTaskFromBoard');
    createTask.innerHTML = createTaskFromBoardDiv();
}

function showTaskForm() {
    const taskContainer = document.getElementById('addTaskFromBoard');
    taskContainer.classList.add('show');
}

function closeAddTaskForm() {
    const taskForm = document.querySelector('.floating-task-container');
    const overlay = document.getElementById('task-form-overlay');
    taskForm.classList.add('slide-out');

    setTimeout(() => {
        taskForm.style.display = 'none';
        overlay.style.display = 'none';
    }, 500);
}

function openTaskDetail(taskId) {
    const task = tasksArray.find(t => t.id === taskId); // Aufgabe finden

    if (!task) return; // Falls die Aufgabe nicht gefunden wird

    // Detail-Container erstellen
    const detailOverlay = document.createElement('div');
    detailOverlay.classList.add('task-detail-overlay');

    const detailContainer = document.createElement('div');
    detailContainer.classList.add('task-detail-container');

    // Detail-HTML erstellen
    detailContainer.innerHTML = `
        <h2>${task.title}</h2>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Due Date:</strong> ${task.date}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Assigned to:</strong> ${Array.isArray(task.name) ? task.name.join(', ') : task.name}</p>
        <p><strong>Description:</strong> ${task.taskDescription}</p>
        <p><strong>Subtasks:</strong> ${task.addedSubtasks ? task.addedSubtasks.join(', ') : 'None'}</p>
        <button class="edit-task-btn">Edit</button>
        <button class="delete-task-btn">Delete</button>
        <button class="close-task-detail-btn">Close</button>
    `;

    // Close-Button hinzufügen
    detailContainer.querySelector('.close-task-detail-btn').addEventListener('click', () => {
        document.body.removeChild(detailOverlay); // Overlay entfernen
    });

    // Overlay und Detail-Container zum Body hinzufügen
    detailOverlay.appendChild(detailContainer);
    document.body.appendChild(detailOverlay);
}
