import { getCookie } from "../data/cart.js";

const csrftoken = getCookie("csrftoken");

async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      alert("Login Failed:" + JSON.stringify(data));
      return false;
    }

    if (data.user && data.user.username) {
      localStorage.setItem("username", data.user.username);
    }

    return true;
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
}

const loginButton = document.querySelector(".js-login-button");
if (loginButton) {
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const success = await loginUser();
    if (success) {
      window.location.href = "/amazon/";
    }
  });
}
