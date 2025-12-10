const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Tab switching
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");

  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");

  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});


// Text-based toggles
document.getElementById("switchToSignup").onclick = () => {
  signupTab.click();
};

document.getElementById("switchToLogin").onclick = () => {
  loginTab.click();
};

// --- Authentication Logic ---

const showMessage = (form, message, type) => {
  // Remove existing messages
  const existingMsg = form.querySelector('.auth-message');
  if (existingMsg) existingMsg.remove();

  const msgDiv = document.createElement('div');
  msgDiv.className = `auth-message ${type}`;
  msgDiv.textContent = message;
  
  // Basic styling for the message
  msgDiv.style.marginTop = '10px';
  msgDiv.style.padding = '10px';
  msgDiv.style.borderRadius = '5px';
  msgDiv.style.textAlign = 'center';
  if (type === 'success') {
    msgDiv.style.backgroundColor = '#d4edda';
    msgDiv.style.color = '#155724';
  } else {
    msgDiv.style.backgroundColor = '#f8d7da';
    msgDiv.style.color = '#721c24';
  }

  form.appendChild(msgDiv);
  
  // Auto-remove after 3 seconds
  setTimeout(() => msgDiv.remove(), 3000);
};

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;

  // Check if user already exists
  const existingUser = localStorage.getItem(email);
  if (existingUser) {
    showMessage(signupForm, 'User already exists with this email!', 'error');
    return;
  }

  // Save new user
  const user = { name, email, password };
  localStorage.setItem(email, JSON.stringify(user));
  
  showMessage(signupForm, 'Signup successful! Please login.', 'success');
  
  // Switch to login tab after success
  setTimeout(() => {
    loginTab.click();
    signupForm.reset();
  }, 1500);
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  const storedUserJson = localStorage.getItem(email);
  
  if (!storedUserJson) {
    showMessage(loginForm, 'User not found. Please signup first.', 'error');
    return;
  }

  const storedUser = JSON.parse(storedUserJson);

  if (storedUser.password === password) {
    showMessage(loginForm, 'Login successful!', 'success');
    // Save session
    localStorage.setItem('currentUser', JSON.stringify(storedUser));
    
    // Redirect to home page after short delay
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  } else {
    showMessage(loginForm, 'Incorrect password.', 'error');
  }
});
