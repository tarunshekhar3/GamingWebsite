// Smooth scroll for same-page anchors
// document.querySelectorAll('a[href^="#"]').forEach((link) => {
//   link.addEventListener("click", (e) => {
//     const targetId = link.getAttribute("href").substring(1);
//     if (!targetId) return;

//     const targetEl = document.getElementById(targetId);
//     if (targetEl) {
//       e.preventDefault();
//       targetEl.scrollIntoView({ behavior: "smooth" });
//     }
//   });
// });

// Simple fake newsletter handler
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector("input[type='email']");
    if (!input.value.trim()) {
      alert("Please enter a valid email.");
      return;
    }
    alert("Thank you for subscribing!");
    input.value = "";
  });
}

// Authentication UI Handler
document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("authButton");
  if (!authButton) return;

  const checkAuth = () => {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      // Change button to Logout
      authButton.textContent = `Logout (${user.name})`;
      authButton.href = "#";
      
      // Handle Logout
      authButton.onclick = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("currentUser");
          window.location.reload();
        }
      };
    } else {
      // Reset to default if not logged in
      authButton.textContent = "Login / Signup";
      authButton.href = "login/login.html";
      authButton.onclick = null; // Remove logout handler
    }
  };

  checkAuth();
});
