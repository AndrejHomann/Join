let emailAvailable;

/**
 * calls listed functions sequentially to perform the initial application setup.
 * - `loadRememberedLogin` - Checks local storage for login information.
 * - `loadUserData` - Fetches and processes user data.
 * - `createActiveUserSession` - Creates an active user session (if applicable).
 * - `checkIfUserOrGuest` - Determines user or guest status and redirects if necessary.
 */
async function init() {
    loadLoginData();
    if(emailAvailable == true) {
        await loadUserData();
        await checkIfUserSessionActive();
    }  else {
        console.error("error: ", error);
    }
}


/**
 * Loads the stored email address from local storage (if available).
 * This function checks if the "rememberMe" key exists in local storage.
 * If it exists and is set to "true", it retrieves the email address from the "email" key.
 */
function loadLoginData() {
    let storedEmail = localStorage.getItem('email');
    if (storedEmail && storedEmail !== '') {
        emailAvailable = true;
        email = storedEmail;
    } else {
        emailAvailable = false;
        console.error("no user email found in local storage", error);
    }
    return emailAvailable;
} 


/**
 * checks if the user session is active. if true, the header_and_sidebar.html will be loaded by the includeHTML() function
 */
async function checkIfUserSessionActive() {
    if (userSessionStatus == 'active') {
        await includeHTML();
    }
    else {
        window.location.href = "../index.html";
    }
}


/**
 * Renders external HTML templates into the DOM dynamically by calling the 'includeHTML' function (in this case: to show sidebar navigation and header information).
 * - It selects all elements with the `includeHTML` attribute using `querySelectorAll`.
 * - It iterates through each element and retrieves the file path from the attribute.
 * - It fetches the template content using `fetch` and checks the response status.
 * - If successful, it replaces the element's innerHTML with the fetched content.
 * - If unsuccessful, it displays a "Page not found" message.
 */
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