document.addEventListener('DOMContentLoaded', () => {
    const addContactForm = document.getElementById('addContactForm');
    const BASE_URL = 'https://authentification-bd13f-default-rtdb.europe-west1.firebasedatabase.app/'; // Susanne's Firebase

    let contactData = {
        name: '',
        email: '',
        phone: ''
    };

    addContactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('addNewName').value;
        const email = document.getElementById('addNewEmail').value;
        const phone = document.getElementById('addNewPhone').value;

        pushContactData(name, email, phone);
    });

    /**
     * Pushes contact data to the Firebase database.
     * 
     * @param {string} name - The name of the contact.
     * @param {string} email - The email of the contact.
     * @param {string} phone - The phone number of the contact.
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the data fetching fails.
     */
    async function pushContactData(name, email, phone, isRegistered = false) {
        contactData = { name, email, phone, isRegistered };
        try {
            const response = await fetch(`${BASE_URL}contacts.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                throw new Error('Failed to save contact data');
            }

            const data = await response.json();
            console.log('Success:', data);
            alert('Contact added successfully!');
            addContactForm.reset(); // Reset the form fields
        } catch (error) {
            console.error('Error:', error);
        }
    }
});