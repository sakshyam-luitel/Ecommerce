import { getCookie } from "../data/cart.js";

const csrftoken = getCookie("csrftoken");

export async function loginUser(email, password) {
  try {
    const response = await fetch(window.apiUrl("/api/auth/login/"), {
      method: "POST",
      credentials: "include",
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
    } else if (email) {
      localStorage.setItem("username", email);
    }

    return true;
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
}

const authSubmitButton = document.querySelector(".js-login-button");
const loginForm = authSubmitButton?.closest("form");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const success = await loginUser(
      document.getElementById("email").value,
      document.getElementById("password").value,
    );
    if (success) {
      window.navigateTo("/home/");
    }
  });
}

const GOOGLE_CLIENT_ID = globalThis.env?.GOOGLE_CLIENT_ID || "";
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

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

const googleLoginButton = document.querySelector(".js-google-login-button");

if (googleLoginButton) {
  googleLoginButton.addEventListener("click", handleLogin);
}
