document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromLoginPage = urlParams.get('fromLogin');

    setTimeout(() => {
        const sidebarLinks = document.querySelector('.sideBarMenu');
        console.log(sidebarLinks);  // Hier prüfen, ob es gefunden wird
        if (fromLoginPage === 'true' && sidebarLinks) {
            sidebarLinks.style.display = 'none';
        }
    }, 30);  // Wartezeit von 500 ms, um sicherzustellen, dass alles geladen ist
});