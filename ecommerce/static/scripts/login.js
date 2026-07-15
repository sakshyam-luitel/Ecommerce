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

const loginForm = document.querySelector(".auth-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const success = await loginUser();
    if (success) {
      window.location.href = "/amazon/";
    }
  });
}

const GOOGLE_CLIENT_ID = '447700047595-sb9rok1m174m9hnm9kgkm1h1hv06oge8.apps.googleusercontent.com';
const REDIRECT_URI = "http://localhost:8000/auth/google/callback";

function handleLogin() {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    window.location.href = authUrl.toString();
}

const loginButton = document.querySelector(".js-google-login-button");

loginButton.addEventListener("click", handleLogin);

