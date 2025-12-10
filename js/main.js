// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").substring(1);
    if (!targetId) return;

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  });
});

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
  if (authButton) {
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
  }

  // Scroll Animation Observer
  const reveals = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;

      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add("active");
      } else {
        reveal.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  // Trigger once on load
  revealOnScroll();

  // Mouse Parallax Effect (Background Only)
  document.addEventListener("mousemove", (e) => {
    const parallaxElements = document.querySelectorAll(".mouse-parallax");
    // Calculate percentage from center (0.5 center, 0 left/top, 1 right/bottom) relative to window
    // But for background-position calc, we want pixels offset from center
    const x = (window.innerWidth / 2 - e.pageX) / 20; // smaller divisor = more movement
    const y = (window.innerHeight / 2 - e.pageY) / 20;

    parallaxElements.forEach((el) => {
      const speed = el.getAttribute("data-speed") || 2;
      // Assume center/cover is default. We add offset.
      el.style.backgroundPosition = `calc(50% + ${x * speed}px) calc(50% + ${y * speed}px)`;
    });
  });

  // Re-init animations on route change
  window.addEventListener("contentChanged", () => {
    // Re-run reveal check immediately
    revealOnScroll();
    // If we had other localized init logic (like carousels), we'd call it here.
    // For example, the radio button slider relies on CSS :checked logic, which stays in DOM if extracted correctly.
    // But if we reload HTML, the radio input 'checked' state sets initial slide.
  });
});
