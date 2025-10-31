// script.js

console.log("Campus OLX frontend loaded.");

document.addEventListener("DOMContentLoaded", () => {
  // Example: simple form handler
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks for your message! (Backend integration coming soon)");
      contactForm.reset();
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Login successful (for now, this is frontend only)");
      loginForm.reset();
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration complete (backend will be added later)");
      registerForm.reset();
    });
  }
});
