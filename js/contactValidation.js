/**
 * Validates all fields in the Add Contact form.
 * Checks if each field passes its respective validation function.
 * 
 * @function
 * @returns {boolean} - Returns `true` if all fields are valid, otherwise `false`.
 */
function validateForm() {
    const nameInput = document.getElementById('addNewName');
    const emailInput = document.getElementById('addNewEmail');
    const phoneInput = document.getElementById('addNewPhone');

    const isNameValid = validateField(nameInput, 'addNameError', isNotEmpty);
    const isEmailValid = validateField(emailInput, 'addEmailError', isValidEmail);
    const isPhoneValid = validateField(phoneInput, 'addPhoneError', isValidPhone);

    return isNameValid && isEmailValid && isPhoneValid;
}

/**
 * Validates a single input field using a validation function.
 * Displays or hides an error message based on the validation result.
 * 
 * @function
 * @param {HTMLElement} inputField - The input element to validate.
 * @param {string} errorId - The ID of the error message element.
 * @param {Function} validationFn - The validation function to apply.
 * @returns {boolean} - Returns `true` if the field is valid, otherwise `false`.
 */
function validateField(inputField, errorId, validationFn) {
    const errorDiv = document.getElementById(errorId);
    const isValid = validationFn(inputField.value.trim());
    if (isValid) {
        errorDiv.style.display = 'none';
        inputField.classList.remove('error');
    } else {
        errorDiv.style.display = 'block';
        inputField.classList.add('error');
    }
    return isValid;
}

/**
 * Validates if a given value is not empty and consists of at least two words (e.g., first and last name).
 * 
 * @function
 * @param {string} value - The value to validate.
 * @returns {boolean} - Returns `true` if the value is not empty and contains at least two words, otherwise `false`.
 */
function isNotEmpty(value) {
    if (value.trim() === '') {
        return false;
    }

    const nameParts = value.trim().split(' ');
    return nameParts.length >= 2;
}

/**
 * Validates if a given value is a valid email address.
 * 
 * @function
 * @param {string} value - The value to validate.
 * @returns {boolean} - Returns `true` if the value is a valid email, otherwise `false`.
 */
function isValidEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}

/**
 * Validates if a given value contains only digits.
 * 
 * @function
 * @param {string} value - The value to validate.
 * @returns {boolean} - Returns `true` if the value contains only digits, otherwise `false`.
 */
function isValidPhone(value) {
    if (value === '') return true; // Leere Felder sind gültig
    const phonePattern = /^[0-9]+$/; // Nur Ziffern erlaubt
    return phonePattern.test(value);
}

/**
 * Adds live validation to an input field.
 * Validates the field on each input event and updates the error message accordingly.
 * 
 * @function
 * @param {HTMLElement} inputField - The input element to validate live.
 * @param {HTMLElement} errorDiv - The error message element to display or hide.
 * @param {Function} validationFn - The validation function to apply.
 */
function addLiveValidation(inputField, errorDiv, validationFn) {
    inputField.addEventListener('input', () => {
        if (validationFn(inputField.value.trim())) {
            errorDiv.style.display = 'none';
            inputField.classList.remove('error');
        }
    });
}

/**
 * Adds live validation to the input fields.
 * This will validate the fields as the user types and display errors if needed.
 * 
 * @function
 * @param {HTMLInputElement} inputField - The input field to validate.
 * @param {HTMLElement} errorElement - The error message element to display errors.
 * @param {Function} validationFunction - The validation function to use (e.g., isNotEmpty, isValidEmail).
 */
addLiveValidation(document.getElementById('addNewName'), document.getElementById('addNameError'), isNotEmpty);
addLiveValidation(document.getElementById('addNewEmail'), document.getElementById('addEmailError'), isValidEmail);
addLiveValidation(document.getElementById('addNewPhone'), document.getElementById('addPhoneError'), isValidPhone);

/**
 * Event listener for the "Cancel" button on the contact form.
 * This prevents the default form submission, resets the form fields, and handles contact addition.
 * 
 * @function
 * @param {Event} event - The click event triggered by the "Cancel" button.
 */
document.getElementById('cancelContact').addEventListener('click', (event) => {
    event.preventDefault();
    resetForm();
    handleContactAdd();
});

/**
 * Resets the contact form fields to their initial state.
 * This clears the input fields and hides any error messages.
 * 
 * @function
 */
function resetForm() {
    document.getElementById('addNewName').value = '';
    document.getElementById('addNewEmail').value = '';
    document.getElementById('addNewPhone').value = '';
    const errorFields = ['addNameError', 'addEmailError', 'addPhoneError'];
    errorFields.forEach((errorId) => {
        const errorDiv = document.getElementById(errorId);
        errorDiv.style.display = 'none';
    });
    const inputFields = [
        document.getElementById('addNewName'),
        document.getElementById('addNewEmail'),
        document.getElementById('addNewPhone'),
    ];
    inputFields.forEach((input) => input.classList.remove('error'));
}

/**
 * Event listener for the "Update" button in the contact edit form.
 * This prevents the default form submission, validates the form, and updates the contact if valid.
 * 
 * @function
 * @param {Event} event - The click event triggered by the "Update" button.
 */
const updateButton = document.getElementById('updateButton');
updateButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (validateEditForm()) {
        updateContact();
    }
});

/**
 * Processes the contact form and returns the form data.
 * 
 * @function
 * @returns {Object} The processed contact data including name, email, phone, color, and registration status.
 */
function processEditForm() {
    return {
        name: document.getElementById('editName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        color: document.getElementById('editContactIcon').dataset.color || '#D1D1D1',
        isRegistered: document.getElementById('editIsRegistered').value === 'true'
    };
}

/**
 * Validates the contact edit form inputs.
 * 
 * @function
 * @returns {boolean} True if all fields are valid, otherwise false.
 */
function validateEditForm() {
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');

    const isNameValid = validateField(nameInput, 'editNameError', isNotEmpty);
    const isEmailValid = validateField(emailInput, 'editEmailError', isValidEmail);
    const isPhoneValid = validateField(phoneInput, 'editPhoneError', isValidPhone);

    return isNameValid && isEmailValid && isPhoneValid;
}

/**
 * Adds live validation to the input fields.
 * This will validate the fields as the user types and display errors if needed.
 * 
 * @function
 * @param {HTMLInputElement} inputField - The input field to validate.
 * @param {HTMLElement} errorElement - The error message element to display errors.
 * @param {Function} validationFunction - The validation function to use (e.g., isNotEmpty, isValidEmail).
 */
addLiveValidation(document.getElementById('editName'), document.getElementById('editNameError'), isNotEmpty);
addLiveValidation(document.getElementById('editEmail'), document.getElementById('editEmailError'), isValidEmail);
addLiveValidation(document.getElementById('editPhone'), document.getElementById('editPhoneError'), isValidPhone);