/**
 * Validates the sign-up form fields (name, email, password, and confirm password).
 * It checks if each field is valid according to the corresponding validation rules.
 * 
 * @returns {boolean} True if all fields are valid, false if any field is invalid.
 */
function validateSignUpForm() {
    const nameInput = document.getElementById('signUpName');
    const emailInput = document.getElementById('signUpEmail');
    const passwordInput = document.getElementById('signUpPassword');
    const confirmPasswordInput = document.getElementById('signUpConfirmPassword');

    const isNameValid = validateField(nameInput, 'inputNameError', isNotEmpty);
    const isEmailValid = validateField(emailInput, 'inputEmailError', isValidEmail);
    const isPasswordValid = validateField(passwordInput, 'inputPasswordError', isPasswordLongEnough);
    const isConfirmPasswordValid = validateField(confirmPasswordInput, 'confirmPasswordError', isConfirmPasswordMatch);

    return isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
}

/**
 * Validates a single input field with the given validation function and displays or hides the associated error message.
 * 
 * @param {HTMLElement} inputElement - The input element to be validated.
 * @param {string} errorElementId - The ID of the element that will display the error message.
 * @param {function} validationFunction - The validation function that checks the input value.
 * @returns {boolean} True if the field is valid, false if the field is invalid.
 */
function validateField(inputElement, errorElementId, validationFunction) {
    const errorElement = document.getElementById(errorElementId);
    const isValid = validationFunction(inputElement.value);

    if (!isValid) {
        inputElement.classList.add('error');
        errorElement.style.display = 'block';
    } else {
        inputElement.classList.remove('error');
        errorElement.style.display = 'none';
    }

    return isValid;
}

/**
 * Checks if the input value is not empty and contains at least two parts (e.g., first and last name).
 * 
 * @param {string} value - The value to check.
 * @returns {boolean} True if the value is not empty and contains at least two parts, false otherwise.
 */
function isNotEmpty(value) {
    if (value.trim() === '') {
        return false;
    }
    const nameParts = value.trim().split(' ');
    return nameParts.length >= 2;
}

/**
 * Validates if the input value is a valid email address based on a simple regex pattern.
 * 
 * @param {string} value - The email value to validate.
 * @returns {boolean} True if the value matches the email pattern, false otherwise.
 */
function isValidEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}

/**
 * Checks if the input password is at least 8 characters long.
 * 
 * @param {string} value - The password value to check.
 * @returns {boolean} True if the password is at least 8 characters long, false otherwise.
 */
function isPasswordLongEnough(value) {
    return value.length >= 8;
}

/**
 * Compares the value of the confirm password field with the original password field to check if they match.
 * 
 * @param {string} value - The value of the confirm password field.
 * @returns {boolean} True if the confirm password matches the original password, false otherwise.
 */
function isConfirmPasswordMatch(value) {
    const password = document.getElementById('signUpPassword').value;
    return value === password;
}

/**
 * Displays the error message for the privacy policy checkbox if it is not checked.
 */
function showCheckboxError() {
    const errorDiv = document.getElementById('checkboxError');
    errorDiv.style.display = 'block';
}

/**
 * Hides the error message for the privacy policy checkbox when it is checked.
 */
function hideCheckboxError() {
    const errorDiv = document.getElementById('checkboxError');
    errorDiv.style.display = 'none';
}

/**
 * Event listener for the privacy policy checkbox to hide the error message when the checkbox is checked.
 */
document.getElementById('privacy-policy').addEventListener('change', (event) => {
    if (event.target.checked) {
        hideCheckboxError();
    }
});

/**
 * Validates a text input field by adding an event listener for user input. 
 * If the value is valid according to the validation function, it hides the error message and removes the error class.
 * If the value is invalid, it shows the error message and adds the error class.
 *
 * @param {HTMLInputElement} inputField - The input field element to validate.
 * @param {HTMLElement} errorDiv - The div element containing the error message.
 * @param {Function} validationFn - The validation function to check the value of the input field.
 */
function validateTextField(inputField, errorDiv, validationFn) {
    inputField.addEventListener('input', () => {
        if (validationFn(inputField.value.trim())) {
            errorDiv.style.display = 'none';
            inputField.classList.remove('error');
        } else {
            errorDiv.style.display = 'block';
            inputField.classList.add('error');
        }
    });
}

/**
 * Adds live validation to an input field, either using text validation or checkbox validation.
 * For text fields, it calls `validateTextField`. For checkboxes, it checks if the checkbox is checked 
 * and adds/removes error styles accordingly.
 *
 * @param {HTMLInputElement} inputField - The input field element to validate.
 * @param {HTMLElement} errorDiv - The div element containing the error message.
 * @param {Function} validationFn - The validation function to check the input value or checkbox state.
 */
function addLiveValidation(inputField, errorDiv, validationFn) {
    if (inputField.type === 'checkbox') {
        inputField.addEventListener('change', () => {
            if (validationFn(inputField.checked)) {
                errorDiv.style.display = 'none';
                inputField.classList.remove('error');
            } else {
                errorDiv.style.display = 'block';
                inputField.classList.add('error');
            }
        });
    } else {
        validateTextField(inputField, errorDiv, validationFn);
    }
}

/**
 * Adds live validation to the corresponding input fields. The `addLiveValidation` function listens for changes or input events
 * in the specified input fields and dynamically shows or hides error messages based on the validation function.
 *
 * This is used for the following fields:
 * - Name field: Validates that the name is not empty and contains at least two words.
 * - Email field: Validates that the email is in the correct format.
 * - Password field: Validates that the password is at least 8 characters long.
 * - Confirm password field: Validates that the confirmed password matches the original password.
 */
addLiveValidation(document.getElementById('signUpName'), document.getElementById('inputNameError'), isNotEmpty);
addLiveValidation(document.getElementById('signUpEmail'), document.getElementById('inputEmailError'), isValidEmail);
addLiveValidation(document.getElementById('signUpPassword'), document.getElementById('inputPasswordError'), isPasswordLongEnough);
addLiveValidation(document.getElementById('signUpConfirmPassword'), document.getElementById('confirmPasswordError'), isConfirmPasswordMatch);