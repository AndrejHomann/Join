/**
 * injects HTML code to create a container and an image element for the task priority logo.
 * then calls the function changePriorityLogoAndColor() with element 'nextTaskPriority' as paramete to update the logo and background color based on the initial priority.
 * @param {string} nextTaskPriority - stores the string value of the task priority.
 */
function createPriorityLogoAndColor() {
    let priority = document.getElementById('createPriorityLogoAndColor');
    priority.innerHTML = /*html*/ `
        <div id="mainContentLine2Circle">
            <!-- <img id="priorityIcon" src="../img/summary/${nextTaskPriority}_white.svg" alt="Priority Icon"> -->
            <img id="priorityIcon" alt="Priority Icon">
        </div>
    `;
    changePriorityLogoAndColor(nextTaskPriority);
}


/**
 * Updates the priority logo and background color based on the provided value stored in `nextTaskPriority`.
 * @param {string} nextTaskPriority - stores the string value of the task priority.
 */
function changePriorityLogoAndColor(nextTaskPriority) { 
    let priorityLogo = document.getElementById('priorityIcon');
    let priorityLogoBackground = document.getElementById('mainContentLine2Circle');
    if (nextTaskPriority !== '') { 
        changePriorityLogoBackgroundColor(priorityLogo, priorityLogoBackground, nextTaskPriority);
    }
    if (nextTaskPriority === '') {
        priorityLogo.style = 'display: none';
        priorityLogoBackground.style = 'display: none';
    }
    return;
}


/**
 * Updates the background color of the priority logo based on the next task's priority.

 * @param {string} nextTaskPriority - The priority of the next task ("low", "medium", "urgent", or an empty string).
 */
function changePriorityLogoBackgroundColor(priorityLogo, priorityLogoBackground, nextTaskPriority) {
    priorityLogo.src = `../img/summary/${nextTaskPriority}_white.svg`;
    if (nextTaskPriority === 'low') { 
        priorityLogoBackground.style = 'background-color: rgb(121, 227, 41)';
    } else if (nextTaskPriority === 'medium') {
        priorityLogoBackground.style = 'background-color: rgb(255, 166, 0)';
    } else if (nextTaskPriority === 'urgent') {
        priorityLogoBackground.style = 'background-color: rgb(255, 60, 0)';
    } 
}


/** 
 * After HTML content was loaded, both included functions change images on hover
 **/ 
document.addEventListener('DOMContentLoaded', function() {          //this code will be executed as soon as all referenced HTML elements are loaded
    changeToDoStatsOnHover();
    changeDoneStatsOnHover();
});


/**
 * Uses event listeners to the element 'edit' to change the image source of an element on hover and back on mouseout.
 */
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


/**
 * Uses event listeners to the element 'check' to change the image source of an element on hover and back on mouseout.
 */
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