function activateLink(linkId, imgSrc = null) {
    const allLinks = document.querySelectorAll('.sideBarMenuButtons, .policyHref, .noticeHref');
    allLinks.forEach(link => {
        link.classList.remove('active', 'activeGrey');
        link.style.backgroundColor = '';
        link.style.color = '';
    });
    
    const link = document.getElementById(linkId);
    if (link) {
        link.classList.add('active');
        if (link.classList.contains('sideBarMenuButtons')) {
            const img = link.querySelector('img');
            if (img && imgSrc) {
                img.src = imgSrc;
            }
            link.style.backgroundColor = '#091931';
            link.style.color = '#FFFFFF';
        } else if (link.classList.contains('policyHref') || link.classList.contains('noticeHref')) {
            link.classList.add('activeGrey');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Standardmäßig den "Summary"-Button aktivieren
    activateLink('addTask');

    // Event Listener zu jedem Button hinzufügen
    const menuLinks = document.querySelectorAll('.sideBarMenuButtons');
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            activateLink(link.id);
        });
    });

    // Event Listener zu jedem Policy- und Notice-Link hinzufügen
    const policyLinks = document.querySelectorAll('.policyHref, .noticeHref');
    policyLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            activateLink(link.id);
        });
    });
});