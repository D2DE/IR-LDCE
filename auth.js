document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const logoutButton = document.getElementById("logout-button");
  const dashboardLink = document.getElementById("dashboard-link");

  const user = localStorage.getItem("user"); // assume user login info is stored here

  if (user) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutButton.style.display = "inline-block";
    dashboardLink.style.display = "inline-block";
  } else {
    loginLink.style.display = "inline-block";
    registerLink.style.display = "inline-block";
    logoutButton.style.display = "none";
    dashboardLink.style.display = "none";

    // if user is not logged in, redirect from dashboard
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html";
    }
  }

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
});
