let greetingText = greeting();

function greeting() {
    let time = new Date().getHours();
    let greeting;
    if (time >= 0 && time < 6) {
        greeting = "Good night, ";
      } else if (time >= 6 && time < 12) {
        greeting = "Good morning, ";
      } else if (time >= 12 && time < 18) {
        greeting = "Good afternoon, ";
      } else {
        greeting = "Good evening, ";
      }
    return greeting;
}


function checkIfMobileOrDesktopGreeting() {
    if (window.innerWidth <= 768) {
        mobileGreeting();
        setTimeout(() => {
            desktopGreeting();
          }, 3700);
    } else if (window.innerWidth > 768) {
        desktopGreeting();
    }
}


function mobileGreeting() {                                  
    let mainContent = document.getElementById('right');
    let greetingMobile = document.getElementById('greetingMobile');
    mainContent.style.display = 'none';
    setTimeout(() => {
        greetingMobile.style = 'opacity: 0; transition: opacity 3s ease-in-out;';
      }, 1000);
}


function desktopGreeting() {                                  
    let mainContent = document.getElementById('right');
    let greetingMobile = document.getElementById('greetingMobile');
    mainContent.style.display = 'flex';
    greetingMobile.style.display = 'none'; 
}