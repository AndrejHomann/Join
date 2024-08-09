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

        const color = generateRandomColor();
        pushContactData(name, email, phone, color);
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
    async function pushContactData(name, email, phone, color, isRegistered = false) {
        contactData = { name, email, phone, color, isRegistered };
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
            fetchContacts(); // Refresh the contact list
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchContacts() {
        try {
            const response = await fetch(`${BASE_URL}contacts.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const contacts = await response.json();
            const sortedContacts = sortContactsAlphabetically(contacts);
            displayContacts(sortedContacts);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function groupContactsByFirstLetter(contacts) {
        return contacts.reduce((acc, contact) => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(contact);
            return acc;
        }, {});
    }

    function createSectionTitle(letter) {
        const sectionTitle = document.createElement('p');
        sectionTitle.className = 'abc-order';
        sectionTitle.textContent = letter;
        return sectionTitle;
    }

    function createSeparator() {
        const separator = document.createElement('div');
        separator.className = 'underline';
        return separator;
    }

    function createContactElement(contact) {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        const contactIcon = createContactIcon(contact.name, contact.color);
        contactElement.innerHTML = `
            <div class="contact-header">
                ${contactIcon.outerHTML}
                </div>
            <h3>${contact.name}</h3>
            <p>Email: ${contact.email}</p>
            <p>Phone: ${contact.phone}</p>
        `;
        return contactElement;
    }

    // function createContactIcon(name, color) {
    //     const initials = name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();

    //     const icon = document.createElement('div');
    //     icon.className = 'contact-icon';
    //     icon.style.backgroundColor = color;
    //     icon.textContent = initials;

    //     return icon;
    // }

    function displayContacts(contacts) {
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = ''; // Clear any existing contacts

        const groupedContacts = groupContactsByFirstLetter(contacts);

        Object.keys(groupedContacts).sort().forEach(letter => {
            const sectionTitle = createSectionTitle(letter);
            const separator = createSeparator();

            contactList.appendChild(sectionTitle);
            contactList.appendChild(separator);

            groupedContacts[letter].forEach(contact => {
                const contactElement = createContactElement(contact);
                contactList.appendChild(contactElement);
            });
        });
    }

    fetchContacts();

});

//Funktionen zum Öffnen und Schließen des Popups
function openPopup() {
    const overlay = document.getElementById('add-contact-pop-up-overlay');
    const popup = document.querySelector('.add-contact-pop-up');

    // Reset animations
    overlay.classList.remove('active');
    popup.classList.remove('animate');
    void overlay.offsetWidth; // Force reflow to reset animation
    void popup.offsetWidth; // Force reflow to reset animation

    // Show overlay and start animations
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('active');
        popup.classList.add('animate');
    }, 10);
}

function closePopup() {
    const overlay = document.getElementById('add-contact-pop-up-overlay');
    const popup = document.querySelector('.add-contact-pop-up');

    // Start closing animations
    popup.classList.add('closing');
    overlay.classList.add('closing');

    // Warte, bis die Animationen abgeschlossen sind, bevor das Element entfernt wird
    setTimeout(() => {
        popup.classList.remove('animate', 'closing'); // Reset Pop-up-Animationen
        overlay.classList.remove('active', 'closing'); // Reset Overlay-Animationen
        overlay.style.display = 'none'; // Overlay verstecken
    }, 500); // 500ms passt zur Dauer der Animationen
}

// Popup schließen, wenn außerhalb des Popups geklickt wird
document.getElementById('add-contact-pop-up-overlay').addEventListener('click', (event) => {
    if (event.target === document.getElementById('add-contact-pop-up-overlay')) {
        closePopup();
    }
});