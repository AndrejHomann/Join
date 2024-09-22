document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.getElementById('signUpForm');
    const loginForm = document.getElementById('loginForm');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const BASE_URL = 'https://join285-60782-default-rtdb.europe-west1.firebasedatabase.app/'; //(Susanne's Firebase)

    let userData = {
        name: '',
        email: '',
        password: ''
    };

    // Call startAnimations with a delay
    setTimeout(startAnimations, 100);

    /**
     * Pushes user data to the Firebase database.
     * 
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the data fetching fails.
     */
    async function pushUserData(name, email, password, isRegistered = true) {
        const color = generateRandomColor();
        userData = { name, email, password, color, isRegistered };
        try {
            const response = await fetch(`${BASE_URL}contacts.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error('Failed to save data');
            }
            const data = await response.json();
            console.log('Success:', data);
            saveSignUpData(email, password); // save sign up data to local storage
            showSignUpOverlay();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Checks if the provided email is already registered in Firebase.
     * 
     * @param {string} email - The email to check.
     * @returns {Promise<boolean>} - True if the email is registered, false otherwise.
     * @throws {Error} Throws an error if the data fetching fails.
     */
    async function isEmailRegistered(email) {
        try {
            const response = await fetch(`${BASE_URL}contacts.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const users = await response.json();
            for (const key in users) {
                if (users[key].email === email) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    /**
     * Logs in a user by checking the provided email and password against stored user data.
     * 
     * @param {string} email - The email address of the user trying to log in.
     * @param {string} password - The password of the user trying to log in.
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the data fetching fails.
     */
    async function loginUser(email, password) {
        try {
            const response = await fetch(`${BASE_URL}contacts.json`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            for (const key in data) {
                if (data[key].email === email && data[key].password === password) {
                    window.location.href = './html/summary_user.html';
                    clearLoginFields()
                    return;
                }
            }
            alert('Invalid email or password');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    }

    /**
    * Eventlistener for the Guest-Login-Button.
    * 
    * This function redirects the user directly to the ‘Summary’ page without requiring login data. 
    * It prevents the form from being sent, ignores existing entries in the email and password fields 
    * and resets the ‘Remember me’ function.
    *
    * @param {Event} event - The click event of the guest login button to prevent the default behaviour (form submission).
     */
    document.querySelector('.btn-guest-log-in').addEventListener('click', (event) => {
        event.preventDefault();

        const emailField = document.getElementById('loginEmail');
        const passwordField = document.getElementById('loginPassword');

        emailField.value = '';
        passwordField.value = '';
        document.getElementById('rememberMe').checked = false;

        window.location.href = './html/summary_user.html';
    });

    /**
     * Clears input fields in log in section after succesful log in.
     */
    function clearLoginFields() {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        rememberMeCheckbox.checked = false;
    }

    /**
     * Validates that all required sign-up fields have been filled out and the privacy policy has been checked.
     * 
     * @returns {Object} An object containing the values of the sign-up form fields:
    * - {string} name: The user's name.
    * - {string} email: The user's email.
    * - {string} password: The user's password.
    * - {string} confirmPassword: The user's password confirmation.
    * - {boolean} privacyPolicyChecked: Whether the privacy policy checkbox is checked.
     */
    function validateSignUpFields() {
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;
        const privacyPolicyChecked = document.getElementById('privacy-policy').checked;

        return { name, email, password, confirmPassword, privacyPolicyChecked };
    }

    /**
     * Displays an error message when the confirmed password does not match the original password entry.
     */
    function displayPasswordError() {
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        confirmPasswordError.textContent = 'Ups! Your password does not match';
        document.getElementById('signUpConfirmPassword').classList.add('error');
    }

    /**
     * Handles the sign-up process by checking if the email is already registered and pushing the user data to the database if it is not.
     * 
     * @param {Object} userDetails - An object containing the user's details:
     * - {string} name: The user's name. 
     * - {string} email: The user's email.
     * - {string} password: The user's password.
     * - {string} confirmPassword: The user's password confirmation.
     * @returns {Promise<void}
     */
    async function handleSignUp({ name, email, password, confirmPassword }) {
        const emailExists = await isEmailRegistered(email);
        if (emailExists) {
            alert('Email is already registered');
        } else {
            await pushUserData(name, email, password);
        }
    }

    /**
     * Handles the form submission for the sign-up process.
     * Prevents default form submission and validates the input fields.
     * 
     * @param {Event} e - The event object from the form submission.
     * @returns {Promise<void}
     */
    async function submitSignUp(e) {
        e.preventDefault(); // Prevents the default form submission action.
        const { name, email, password, confirmPassword, privacyPolicyChecked } = validateSignUpFields();

        document.getElementById('confirmPasswordError').textContent = '';
        document.getElementById('signUpConfirmPassword').classList.remove('error');

        if (name && email && password && confirmPassword && privacyPolicyChecked) {
            if (password === confirmPassword) {
                await handleSignUp({ name, email, password, confirmPassword });
            } else {
                displayPasswordError();
            }
        } else {
            alert('Please fill in all required fields and accept the privacy policy');
        }
    }

    /**
     * Handles the form submission for login.
     * Prevents default form submission and validates the input fields.
     * 
     * @param {Event} e - Event object from the form submission.
     * @returns {Promise<void>}
     */
    async function submitLogin(e) {
        e.preventDefault(); // Prevents the default form submission action.
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = rememberMeCheckbox.checked;

        if (email && password) {
            try {
                await loginUser(email, password);
                if (rememberMe) {
                    saveLoginData(email, password);
                } else {
                    clearSavedLoginData();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login');
            }
        } else {
            alert('Please fill in all required fields');
        }
    }

    /**
     * Saves the user's data in the local storage.
     * 
     * @param {string} email - The user's email.
     * @param {*} password - The user's password.
     */
    function saveLoginData(email, password) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    }

    /**
     * Removes previoulsy saved data from the local storage.
     */
    function clearSavedLoginData() {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    }

    /**
     * Loads saved user data from the local storage and fills the login form with it.
     * Also checks the "Remember me" checkbox if data is present.
     */
    function loadRememberedLogin() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
            document.getElementById('loginEmail').value = localStorage.getItem('email');
            document.getElementById('loginPassword').value = localStorage.getItem('password');
            rememberMeCheckbox.checked = true;
        }
    }

    /**
     * Saves the user's sign-up data in the local storage.
     * 
     * @param {*} email - The user's email.
     * @param {*} password - The user's password.
     */
    function saveSignUpData(email, password) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberMe', 'true');
    }

    /**
     * Clears all form entries in the sign-up form.
     */
    function clearSignUpFields() {
        document.getElementById('signUpName').value = '';
        document.getElementById('signUpEmail').value = '';
        document.getElementById('signUpPassword').value = '';
        document.getElementById('signUpConfirmPassword').value = '';
        document.getElementById('privacy-policy').checked = false;
    }

    /**
     * Checks if the variable (signUpForm or loginForm) exists.
     * The event listener listens to the submit event. When  the event occurs the function (submitSignUp or submitLogin) is executed.
     */
    if (signUpForm) {
        signUpForm.addEventListener('submit', submitSignUp);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', submitLogin);
        loadRememberedLogin();
    }

    /**
     * Shows the sign-up overlay and redirects to the login page after delay.
     */
    function showSignUpOverlay() {
        const overlay = document.getElementById('signup-overlay');
        overlay.classList.add('active');
        setTimeout(() => {
            overlay.classList.remove('active');
            clearSignUpFields();
            loadRememberedLogin();
            logIn();
        }, 800);
    }
});

/**
 * Switches the view to the sign-up form.
 * 
 * This function hides the log-in form and the sign-up box,
 * and shows the sign-up form. Typically triggered by a "Sign Up" button click.
 */
function signUp() {
    document.getElementById('signUpContainer').classList.remove('hidden');
    document.getElementById('signUpBox').classList.add('hidden');
    document.getElementById('loginContainer').classList.add('hidden');
};

/**
 * Switches the view to the log-in form.
 * 
 * This function hides the sign-up form, shows the log-in form and the
 * sign-up box. Typically triggered after a sign-up is completed or by a
 * "Log In" button click.
 */
function logIn() {
    document.getElementById('signUpContainer').classList.add('hidden');
    document.getElementById('signUpBox').classList.remove('hidden');
    document.getElementById('loginContainer').classList.remove('hidden');
};

function startAnimations() {
    const logo = document.getElementById('logo');
    const overlay = document.querySelector('.overlay');

    if (logo && overlay) {
        // Remove animation classes
        logo.classList.remove('animate-logo');
        overlay.classList.remove('animate-overlay');

        // Trigger reflow to restart the animation
        void logo.offsetWidth;

        // Add animation classes back
        logo.classList.add('animate-logo');
        overlay.classList.add('animate-overlay');
    }
}

/**
 * Redirects the user to the previous page (typically the log in page) when the button is clicked.
 * 
 * This function uses the browser's history to navigate back to the previous page.
 */
function goBack() {
    window.history.back();
}