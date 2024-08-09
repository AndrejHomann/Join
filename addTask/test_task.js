document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const BASE_URL = 'https://authentification-bd13f-default-rtdb.europe-west1.firebasedatabase.app/';

    document.getElementById('submitTaskButton').addEventListener('click', (event) => {
        event.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;

        const assignedUsers = Array.from(document.querySelectorAll('.dropdown-item.selected'))
            .map(item => item.dataset.name);

        pushTaskData(title, description, assignedUsers);
    });

    async function pushTaskData(title, description, assignedUsers) {
        const taskData = { title, description, assignedUsers };
        try {
            const response = await fetch(`${BASE_URL}tasks.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error('Failed to save task data');
            }

            const data = await response.json();
            console.log('Success:', data);
            alert('Task created successfully!');
            taskForm.reset();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function filterRegisteredContacts(contacts) {
        return contacts.filter(contact => contact.isRegistered);
    }

    async function fetchContacts() {
        try {
            const response = await fetch(`${BASE_URL}contacts.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const contacts = await response.json();

            const registeredContacts = filterRegisteredContacts(Object.values(contacts));
            const sortedContacts = sortContactsAlphabetically(registeredContacts);

            populateUserOptions(sortedContacts);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function populateUserOptions(contacts) {
        const assignedUsersContainer = document.getElementById('assignedUsers');
        assignedUsersContainer.innerHTML = '';

        contacts.forEach(contact => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.dataset.name = contact.name;
            item.innerHTML = `
                <div class="contact-icon" style="background-color: ${contact.color};">${contact.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase()}</div>
                ${contact.name}
            `;
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
            });
            assignedUsersContainer.appendChild(item);
        });
    }

    fetchContacts();
});