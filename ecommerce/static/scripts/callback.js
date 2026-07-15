async function handleGoogleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const oauthError = params.get("error");

  // Google redirected back with an error (e.g. access_denied) instead of a code.
  if (oauthError) {
    alert("Google sign-in failed: " + oauthError);
    return false;
  }

  if (!code) {
    // No code in the URL — nothing to exchange (e.g. a stray page refresh
    // after we already stripped it). Bail out quietly.
    return false;
  }

  // Google authorization codes are single-use. If this handler runs twice for
  // the same code (a re-render, a refresh, a back-navigation) the second
  // exchange fails with invalid_grant -> "Failed to exchange code for access
  // token". Guard against that: strip the code from the URL immediately and
  // remember that we've started exchanging it.
  const alreadyUsed = sessionStorage.getItem("google_oauth_code") === code;
  window.history.replaceState({}, document.title, window.location.pathname);
  if (alreadyUsed) {
    return false;
  }
  sessionStorage.setItem("google_oauth_code", code);

  try {
    const response = await fetch("/api/v1/auth/google/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google login failed:", data);
      alert("Login Failed: " + JSON.stringify(data));
      // Let the user retry from scratch with a fresh code.
      sessionStorage.removeItem("google_oauth_code");
      return false;
    }

    if (data.user && data.user.username) {
      localStorage.setItem("username", data.user.username);
    }

    sessionStorage.removeItem("google_oauth_code");
    window.location.href = "/amazon/";
    return true;
  } catch (error) {
    console.error("Google callback error:", error);
    sessionStorage.removeItem("google_oauth_code");
    return false;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await handleGoogleCallback();

});
