async function logout() {
    setUserSessionToInactive();
    window.location.href = "../index.html";
}


async function setUserSessionToInactive() {
    try {
        const response = await fetch(`${baseUrl}/user/${firebaseUserId}.json`, {
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

