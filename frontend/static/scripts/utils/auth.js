import { getCookie } from "../../data/cart.js";

const csrftoken = getCookie("csrftoken");

export async function logout() {
  try {
    const response = await fetch(window.apiUrl("/api/auth/logout/"), {
      method: "POST",
      credentials: "include",
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

  localStorage.removeItem("username");
  window.navigateTo("/");
}

export async function setupLogoutButton() {
  const logoutButtons = document.querySelectorAll('.js-logout-button');
  logoutButtons.forEach(button => {
    button.addEventListener('click', async(event) => {
      event.preventDefault();
      await logout();
    });
  });

  const savedUser = localStorage.getItem('username');
  const greetingElements = document.querySelector('.js-username-greeting');
  if (greetingElements) {
    greetingElements.innerHTML = savedUser || 'Guest';
  }
}
