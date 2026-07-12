async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!username || !password) {
    alert("Please enter both username and password to continue");
    return;
  }

  try {
    const data = await BelleApi.login({ username, password, role });
    const user = data.user;
    sessionStorage.setItem("userRole", user.role);
    sessionStorage.setItem("username", user.username);
    sessionStorage.setItem("userEmail", user.email || "");
    sessionStorage.setItem("userId", String(user.id || ""));
    window.location.href = user.role === "admin" ? "admin.html" : "index.html";
    return;
  } catch (error) {
    if (error.status) {
      alert(error.message || "Login failed");
      return;
    }

    // Keeps the UI usable when opened without the Java API server.
    if (role === "admin" && username === "admin" && password === "admin123") {
      sessionStorage.setItem("userRole", "admin");
      sessionStorage.setItem("username", "Admin");
      window.location.href = "admin.html";
      return;
    }

    if (role === "user" && username.length > 0 && password.length > 0) {
      sessionStorage.setItem("userRole", "user");
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("userEmail", "");
      window.location.href = "index.html";
      return;
    }

    alert(error.message || "Login failed");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const roleSelect = document.getElementById("role");
  const adminHint = document.querySelector(".admin-hint");

  if (roleSelect && adminHint) {
    function updateAdminHint() {
      if (roleSelect.value === "admin") {
        adminHint.classList.remove("hidden");
        adminHint.textContent = "Admin shortcut: use username admin and password admin123 for local admin access.";
      } else {
        adminHint.classList.add("hidden");
      }
    }
    roleSelect.addEventListener("change", updateAdminHint);
    updateAdminHint();
  }

  if (!togglePasswordBtn || !passwordInput) return;

  togglePasswordBtn.addEventListener("click", function () {
    const shouldShowPassword = passwordInput.type === "password";
    passwordInput.type = shouldShowPassword ? "text" : "password";
    this.setAttribute("aria-label", shouldShowPassword ? "Hide password" : "Show password");
    this.setAttribute("aria-pressed", shouldShowPassword ? "true" : "false");
  });
});
