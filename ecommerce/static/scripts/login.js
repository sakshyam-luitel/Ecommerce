import { getCookie } from "../data/cart.js";
import {
  formatAuthError,
  showFormError,
  clearFormError,
} from "./utils/formError.js";

const csrftoken = getCookie("csrftoken");

async function loginUser() {
  const form = document.querySelector(".auth-form");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  clearFormError(form);

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
      showFormError(form, formatAuthError(data));
      return false;
    }

    if (data.user && data.user.username) {
      localStorage.setItem("username", data.user.username);
    }

    return true;
  } catch (error) {
    console.log("Error:", error);
    showFormError(form, "Unable to reach the server. Please try again.");
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

const loginButton =
  document.getElementById("googleLoginBtn") ||
  document.querySelector(".js-google-login-button");

// The redirect_uri must exactly match GOOGLE_CALLBACK_URL in Django settings and
// be registered in the Google Cloud Console. We always return to /login/, which
// completes the login below regardless of which page started it (login or intro).
const GOOGLE_REDIRECT_URI = `${window.location.origin}/login/`;

function handleGoogleLogin() {
  const clientId = loginButton && loginButton.dataset.googleClientId;
  if (!clientId) {
    console.log("Google client ID is not configured.");
    return;
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  window.location.href = authUrl.toString();
}

if (loginButton) {
  loginButton.addEventListener("click", handleGoogleLogin);
}

// If Google redirected back with a ?code=, exchange it via the backend
// (dj-rest-auth sets the JWT cookies), then land on the storefront.
async function completeGoogleLogin() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return;

  const form = document.querySelector(".auth-form");
  try {
    const response = await fetch("/api/v1/auth/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) {
      showFormError(form, formatAuthError(data));
      return;
    }
    if (data.user && data.user.username) {
      localStorage.setItem("username", data.user.username);
    }
    window.location.href = "/amazon/";
  } catch (error) {
    console.log("Error:", error);
    showFormError(form, "Google sign-in failed. Please try again.");
  }
}

completeGoogleLogin();