/**
 * Initializes the page once the DOM is fully loaded.
 *
 * This function adds a delay to the execution of functions based on the current page.
 * - `highlightActiveLink()` and `hideHelpAndUserProfileOnSpecialPages()` are executed with a short delay.
 * - `updateUserProfileIcon()` has a dynamic delay, depending on the current page.
 *   On the 'summary' page, the delay is longer to account for slower load times.
 *
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        highlightActiveLink();
        hideHelpAndUserProfileOnSpecialPages();
    }, 20);
    const currentPage = window.location.pathname;
    let delay = 100;
    if (currentPage.includes("summary")) {
        delay = 600;
    }
    setTimeout(() => {
        updateUserProfileIcon();
    }, delay);
});

/**
 * Hides the "Help" and "User Profile" section on specific pages.
 *
 * This function checks the current page URL and hides the `.helpAndUserProfile`
 * div if the page is either the "Legal Notice" or the "Privacy Policy" page.
 *
 * Pages checked:
 * - Legal Notice (`legalnotice`)
 * - Privacy Policy (`privacypolicy`)
 *
 * @function hideHelpAndUserProfileOnSpecialPages
 */
function hideHelpAndUserProfileOnSpecialPages() {
    const helpAndUserProfileDiv = document.querySelector(".helpAndUserProfile");

    const currentPage = window.location.pathname.toLowerCase();

    if (currentPage.includes("legalnotice") || currentPage.includes("privacypolicy")) {
        helpAndUserProfileDiv.style.display = "none";
    }
}

/**
 * Retrieves the user's email from local storage.
 *
 * This function returns the email address stored in the browser's localStorage.
 *
 * @function getUserEmail
 * @returns {string|null} The user's email address, or null if not found.
 */
function getUserEmail() {
    return localStorage.getItem("email");
}

/**
 * Updates the user profile icon with the user's initials or 'G' for guest.
 *
 * This function retrieves the user's initials and email from localStorage and updates the
 * profile icon accordingly. If the user is logged in as a guest, it sets the profile icon
 * to 'G'. If the user is registered, it displays the user's initials. If no data is available,
 * it leaves the icon empty.
 *
 * @function updateUserProfileIcon
 * @returns {void}
 */
function updateUserProfileIcon() {
    const userProfileIcon = document.getElementById("userProfileIcon");
    const userInitials = localStorage.getItem("userInitials");
    const userEmail = localStorage.getItem("email");
    if (!userProfileIcon) {
        console.error("userProfileIcon element not found!");
        return;
    }
    if (userEmail === "guest@join.com") {
        userProfileIcon.textContent = "G";
    } else if (userInitials) {
        userProfileIcon.textContent = userInitials;
    } else {
        userProfileIcon.textContent = "";
    }
}

/**
 * Toggles the visibility of the user menu.
 * When the user clicks on the profile icon, the user menu is displayed or hidden.
 * If the user clicks outside the menu or on any menu link, the menu will close automatically.
 */
function toggleUserMenu() {
    const userMenu = document.getElementById("userMenuBox");
    const userProfileIcon = document.getElementById("userProfileIcon");
    if (!userMenu || !userProfileIcon) {
        console.error("User menu box or icon not found!");
        return;
    }
    const isMenuVisible = userMenu.style.display === "block";
    userMenu.style.display = isMenuVisible ? "none" : "block";
    document.addEventListener("click", function (event) {
        const isClickInsideMenu = userMenu.contains(event.target);
        const isClickOnIcon = userProfileIcon.contains(event.target);
        if (!isClickInsideMenu && !isClickOnIcon) {
            userMenu.style.display = "none";
        }
    });
    const menuLinks = userMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            userMenu.style.display = "none";
        });
    });
}

/**
 * Highlights the active link in the navigation based on the current page.
 *
 * This function checks the current page's URL and applies the 'active' class
 * to the corresponding navigation link, either for the Privacy Policy or Legal Notice pages.
 *
 * @function highlightActiveLink
 * @returns {void}
 */
function highlightActiveLink() {
    const currentPage = window.location.href;
    const privacyLink = document.getElementById("privacyPolicy");
    const legalNoticeLink = document.getElementById("legalNotice");

    if (currentPage.includes("privacypolicy.html")) {
        privacyLink.classList.add("active");
    } else if (currentPage.includes("legalnotice.html")) {
        legalNoticeLink.classList.add("active");
    }
}
