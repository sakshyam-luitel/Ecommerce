import { getCookie } from "../../data/cart.js";

const csrftoken = getCookie("csrftoken");

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    });
    if (!response.ok) {
      console.log("Failed to logout");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function setupLogoutButton() {
  const logoutButtons = document.querySelectorAll('.js-logout-button');
  logoutButtons.forEach(button => {
    button.addEventListener('click', async(event) => {
      event.preventDefault();
      await logout();
      localStorage.removeItem('username');
      window.location.href = '/';
    });
  });

  const savedUser = localStorage.getItem('username');
  const greetingElements = document.querySelector('.js-username-greeting');
    greetingElements.innerHTML = savedUser;
}
