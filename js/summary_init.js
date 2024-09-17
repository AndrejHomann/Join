/**
 * calls listed functions sequentially to perform the initial application setup.
 * - `loadRememberedLogin` - Checks local storage for login information.
 * - `loadUserData` - Fetches and processes user data.
 * - `createActiveUserSession` - Creates an active user session (if applicable).
 * - `checkIfUserOrGuest` - Determines user or guest status and redirects if necessary.
 */
async function init() {
    loadRememberedLogin();  
    await loadUserData();
    await checkIfUserOrGuest();
}


/**
 * Loads the stored email address from local storage (if available).
 * This function checks if the "rememberMe" key exists in local storage.
 * If it exists and is set to "true", it retrieves the email address from the "email" key.
 */
function loadRememberedLogin() {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        email = localStorage.getItem('email');
    }
    console.log('email from local storage:', email);
} 


/**
 * Determines whether the user is logged in or a guest and redirects accordingly.
 * This function checks the user session status and performs actions based on the result:
 * - If the session is active (user is logged in): Includes necessary HTML templates (`includeHTML`).
 * - If the email is not "guest@join.com": starts a user session (`userSession`).
 * - If the email is "guest@join.com": starts a guest session (`guestSession`).
 * - If the session is not active: redirects the user to the login page (`index.html`).
 */
async function checkIfUserOrGuest() {
    if (userSessionStatus == 'active') {
        await includeHTML();
        if (email != "guest@join.com") {
            await userSession();
        } 
        else if (email == "guest@join.com") {
            await guestSession();
        } 
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