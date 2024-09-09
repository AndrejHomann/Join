function createPriorityLogoAndColor() {
    let priority = document.getElementById('createPriorityLogoAndColor');
    priority.innerHTML = /*html*/ `
        <div id="mainContentLine2Circle">
            <img id="priorityIcon" src="../img/summary/urgent_white.svg" alt="Priority Icon">
        </div>
    `;
    changePriorityLogoAndColor(nextTaskPriority);
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