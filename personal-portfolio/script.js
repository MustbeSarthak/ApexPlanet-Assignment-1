/* ============================================================
   Personal Portfolio - script.js
   Vanilla JavaScript - basic page interactivity
   ============================================================ */

/**
 * Show the required welcome message when the
 * "Know More About Me" button is clicked.
 */
function showWelcomeMessage() {
  alert("Hello! Welcome to my portfolio. Thanks for visiting!");
}

// Attach the click handler once the DOM is ready.
document.addEventListener("DOMContentLoaded", function () {
  var knowMoreBtn = document.getElementById("knowMoreBtn");

  if (knowMoreBtn) {
    knowMoreBtn.addEventListener("click", showWelcomeMessage);
  }

  // Keep the footer year up to date.
  var currentYear = document.getElementById("currentYear");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
