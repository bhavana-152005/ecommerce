document.addEventListener("DOMContentLoaded", function () {
  initializeSignup();
  setupPasswordToggle("togglePassword", "password");
  setupPasswordToggle("toggleConfirmPassword", "confirmPassword");
  setupRoleChange();
});

function initializeSignup() {
  const role = sessionStorage.getItem("userRole");
  if (!role) return;

  window.location.href = role === "admin" ? "admin.html" : "index.html";
}

function setupPasswordToggle(toggleId, inputId) {
  const toggleBtn = document.getElementById(toggleId);
  const passwordInput = document.getElementById(inputId);

  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener("click", function () {
    const shouldShowPassword = passwordInput.type === "password";
    passwordInput.type = shouldShowPassword ? "text" : "password";
    this.setAttribute(
      "aria-label",
      shouldShowPassword
        ? "Hide password"
        : inputId === "confirmPassword"
          ? "Show confirm password"
          : "Show password"
    );
    this.setAttribute("aria-pressed", shouldShowPassword ? "true" : "false");
  });
}

function setupRoleChange() {
  const roleSelect = document.getElementById("role");
  const adminCodeContainer = document.getElementById("adminCodeContainer");

  if (!roleSelect || !adminCodeContainer) return;

  roleSelect.addEventListener("change", function () {
    adminCodeContainer.style.display = this.value === "admin" ? "block" : "none";
  });
}

async function signup() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;
  const adminCodeInput = document.getElementById("adminCode");
  const adminCode = adminCodeInput ? adminCodeInput.value.trim() : "";
  const errors = [];

  if (!username) {
    errors.push("Username is required");
  } else if (username.length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Please enter a valid email address");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!confirmPassword) {
    errors.push("Please confirm your password");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (role === "admin") {
    if (!adminCode) {
      errors.push("Admin registration code is required");
    } else if (adminCode !== "BELLEVOUIX2025") {
      errors.push("Invalid admin registration code");
    }
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  try {
    const data = await BelleApi.signup({ username, email, password, role, adminCode });
    const user = data.user;
    sessionStorage.setItem("userRole", user.role);
    sessionStorage.setItem("username", user.username);
    sessionStorage.setItem("userEmail", user.email || "");
    sessionStorage.setItem("userId", String(user.id || ""));
  } catch (error) {
    if (error.status) {
      alert(error.message || "Signup failed");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((user) => user.username === username || user.email === email);

    if (existingUser) {
      alert("An account with this username or email already exists");
      return;
    }

    users.push({
      id: Date.now(),
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("userEmail", email);
  }

  alert("Account created successfully! Welcome to Bellevouix.");
  window.location.href = role === "admin" ? "admin.html" : "index.html";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const style = document.createElement("style");
style.textContent = `
  .login-link {
    text-align: center;
    margin-top: 16px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .login-link a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
  }

  .login-link a:hover {
    text-decoration: underline;
  }

  #adminCodeContainer {
    animation: fadeIn 0.3s ease;
  }
`;
document.head.appendChild(style);
