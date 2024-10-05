let greetingText = greeting();


/** 
 * greets the user or guest with different texts in dependence of the time of day.
 * @param {date} time - determines the current time of the day.
 * @param {string} greeting - contains the greeting text depending on the time of day.
*/
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


/** 
 * checks whether the screen width is less than or equal to 768px.
 * if true it shows the greeting text in mobile format and after a few seconds it shows the user summary.
 * if false it shows the user summary directly.
 */
function checkIfMobileOrDesktopGreeting() {
    if (window.innerWidth <= 840) {
        mobileGreeting();
        setTimeout(() => {
            desktopGreeting();
          }, 3700);
    } else if (window.innerWidth > 840) {
        desktopGreeting();
    }
}


/**
 * hides the user summary and shows the mobile greeting text.
 */
function mobileGreeting() {                                  
    let mainContent = document.getElementById('right');
    let greetingMobile = document.getElementById('greetingMobile');
    mainContent.style.display = 'none';
    setTimeout(() => {
        greetingMobile.style = 'opacity: 0; transition: opacity 3s ease-in-out;';
      }, 1000);
}


/**
 * hides the mobile greeting text and shows the user summary.
 */
function desktopGreeting() {                                  
    let mainContent = document.getElementById('right');
    let greetingMobile = document.getElementById('greetingMobile');
    mainContent.style.display = 'flex';
    greetingMobile.style.display = 'none'; 
}