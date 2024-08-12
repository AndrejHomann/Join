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

let tasks = [
    { "id": "task1", "categoryUserStory": "User Story", "status": "todo" },
    { "id": "task2", "categoryUserStory": "Technical Task", "status": "inprogress" }
];

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
                    <button class="addTaskButton" onclick="addTask()">
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

    // Füge Aufgaben in die entsprechenden taskArea-Divs ein
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let taskHTML = `
            <div class="boardTask" id="${task.id}" draggable="true" ondragstart="drag(event)">
                <div class="categoryBordTask ${task.categoryUserStory === 'Technical Task' ? 'categoryTechnicalTask' : 'categoryUserStory'}">
                    <span>${task.categoryUserStory}</span>
                </div>
            </div>
        `;

        let taskArea = document.getElementById(task.status);
        taskArea.innerHTML += taskHTML;
    }
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
    // Hier kannst du zusätzliche Logik hinzufügen, um den Task-Status im Backend zu aktualisieren
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}