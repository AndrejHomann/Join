/**
 * sets the user session status to active. then redirects the user to the index page (=login).
 */
async function logout() {
    await setSessionToInactive();

    // Check if "remember me" is active
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'false') {
        clearSavedLoginData(); // deletes the saved login data in local storage
    }

    window.location.href = "../index.html"; // forwards to the login
}


/**
* Removes previoulsy saved data from the local storage.
*/
function clearSavedLoginData() {
    localStorage.removeItem('userInitials');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
}


/** 
 * logs out the user or guest by setting the session status to 'inactive'.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {string} firebaseUserId - the individual user ID for the logged in user or guest.
 * @param {object} session - this object contains the new session status.
 * @param {Error} error - logs the error to the console and returns `null` to indicate that the operation failed.
*/
async function setSessionToInactive() {
    const email = localStorage.getItem('email');
    if (email === 'guest@join.com') {
        await setGuestSessionToInactive();
    } else {
        let contactId = await fetchContactId(email);
        await SetUserSessionToInactive(contactId);
    }
}


/**
 * Sets the current guest session to inactive.
 *
 * This function sends a PATCH request to the specified base URL with a JSON payload containing the updated session status.
 * If the request is successful, the guest session is marked as inactive.
 *
 * @async
 * @returns {Promise<void>} A Promise that resolves when the request is complete or rejects if an error occurs.
 */
async function setGuestSessionToInactive() {
    try {
        const response = await fetch(`${baseUrl}/guest/0.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: 'inactive'
            })
        });
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


/**
 * Fetches the ID of a contact by email address.
 *
 * This function sends a GET request to the specified base URL with a `.json` extension and expects a JSON response containing a `contacts` object.
 * It then iterates through the `contacts` object and searches for a contact with a matching email address.
 * If a match is found, the contact's ID is returned.
 * Otherwise, the function returns `null`.
 *
 * @async
 * @param {string} email The email address of the contact to search for.
 * @returns {Promise<string|null>} A Promise that resolves to the contact ID (string) if found, or `null` if no matching contact is found or an error occurs.
 */
async function fetchContactId(email) {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        const contacts = data.contacts;
        let contactId;
        for (const Id in contacts) {
            const contact = contacts[Id];
            if (contact.email === email) {
                contactId = Id;
            }
        }
        return contactId;
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}


/**
 * Sets the session of a specific contact to inactive.

 * This function sends a PATCH request to the specified base URL with a JSON payload containing the updated session status.
 * If the request is successful, the contact's session is marked as inactive.

 * @async
 * @param {string} contactId The ID of the contact whose session should be set to inactive.
 * @returns {Promise<void>} A Promise that resolves when the request is complete or rejects if an error occurs.
 */
async function SetUserSessionToInactive(contactId) {
    try {
        const response = await fetch(`${baseUrl}/contacts/${contactId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: 'inactive'
            })
        });
    } catch (error) {
        console.error("Error while fetching data:", error);
        return null;
    }
}