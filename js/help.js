document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromLoginPage = urlParams.get('fromLogin');

    setTimeout(() => {
        const sidebarLinks = document.querySelector('.sideBarMenu');
        if (fromLoginPage === 'true' && sidebarLinks) {
            sidebarLinks.style.display = 'none';
        }

        const sidebarPolicyAndNotice = document.querySelector('.sideBarPolicyAndNotice');
        if (fromLoginPage === 'true' && sidebarPolicyAndNotice) {
            sidebarPolicyAndNotice.style.display = 'none';
        }

        const userProfile = document.querySelector('.userProfile');
        if (fromLoginPage === 'true' && userProfile) {
            userProfile.style.display = 'none';
        }

        const helpDiv = document.querySelector('.helpDiv');
        if (fromLoginPage === 'true' && userProfile) {
            helpDiv.style.display = 'none';
        }


    }, 40);
});