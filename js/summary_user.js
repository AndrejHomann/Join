const baseUrl = "https://join-test-4edf7-default-rtdb.europe-west1.firebasedatabase.app/";

let email = 'andrej.homann1990@gmail.com';
let id;
let userName;

async function init() {
    await findUserIdByEmail(email);
    await showUserNameById(id);
    greetUser(userName);
}


// async function includeHTML() {
//     let includeElements = document.querySelectorAll('[includeHTML]');
//     for (let i = 0; i < includeElements.length; i++) {
//         const element = includeElements[i];
//         file = element.getAttribute("includeHTML"); 
//         let resp = await fetch(file);
//         if (resp.ok) {
//             element.innerHTML = await resp.text();
//         } else {
//             element.innerHTML = 'Page not found';
//         }
//     }
// }



async function findUserIdByEmail(email) {
    try {
        const response = await fetch(`${baseUrl}/user.json`);   // HTTP-Request in user list
        const data = await response.json();
        for (const userId in data) {
            if (data[userId].email === email) {
            console.log("The Firebase user id is:", userId);
            id = userId;
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


async function showUserNameById(id) {
    try {
        const response = await fetch(`${baseUrl}/user.json`);   // HTTP-Request in user list
        const data = await response.json();
        
        userName = data[id].name;
        console.log("The user name is:", userName);
        return userName;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


function greetUser(userName) {
    let greeting = document.getElementById('greeting');
    greeting.innerHTML = /*html*/ `
        <span id="greetingText">Good morning,</span>
        <span id="greetingName">${userName}</span>
    `;
}






document.addEventListener('DOMContentLoaded', function() { //this code will only be executed, when all referenced HTML elements are existing
    changeToDoLogoColorOnHover();
    changeDoneLogoColorOnHover();
});

    
function changeToDoLogoColorOnHover() {
    const toDo = document.getElementById('toDo');
    const editImage = document.getElementById('edit');
    toDo.addEventListener('mouseover', function() {
        editImage.src = '/img/summary/edit_hover.svg';
    });
    toDo.addEventListener('mouseout', function() {
        editImage.src = '/img/summary/edit.png';
    });
}


function changeDoneLogoColorOnHover() {
    const done = document.getElementById('done');
    const checkImage = document.getElementById('check');
    done.addEventListener('mouseover', function() {
        checkImage.src = '/img/summary/check_hover.svg';
    });
    done.addEventListener('mouseout', function() {
        checkImage.src = '/img/summary/check.png';
    });
}