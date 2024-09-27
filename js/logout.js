/**
 * sets the user session status to active. then redirects the user to the index page (=login).
 */
async function logout() {
    await setUserSessionToInactive();
    window.location.href = "../index.html";
}

/** 
 * logs out the user or guest by setting the session status to 'inactive'.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {string} firebaseUserId - the individual user ID for the logged in user or guest.
 * @param {object} session - this object contains the new session status.
 * @param {Error} error - logs the error to the console and returns `null` to indicate that the operation failed.
*/
async function setUserSessionToInactive() {
    try {
        const response = await fetch(`${baseUrl}/contacts/${firebaseUserId}.json`, {
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

