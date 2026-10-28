// Shared helpers for showing auth/form errors inline in the UI instead of alert().

// Flatten a DRF/dj-rest-auth error payload into a human-readable string.
// Handles strings, arrays (e.g. ["Unable to log in..."]) and nested field maps
// (e.g. {email: ["already registered"], password1: ["too short"]}).
export function formatAuthError(data) {
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;

  const messages = [];
  const collect = (val) => {
    if (Array.isArray(val)) {
      val.forEach(collect);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(collect);
    } else if (val !== null && val !== undefined) {
      messages.push(String(val));
    }
  };
  collect(data);

  return messages.length
    ? messages.join(" ")
    : "Something went wrong. Please try again.";
}

// Show `message` in a `.auth-error` box at the top of `form`, creating it if
// needed. Styled by `.auth-error` in login.css.
export function showFormError(form, message) {
  if (!form) return;
  let box = form.querySelector(".auth-error");
  if (!box) {
    box = document.createElement("div");
    box.className = "auth-error";
    box.setAttribute("role", "alert");
    form.insertBefore(box, form.firstChild);
  }
  box.textContent = message;
  box.classList.add("is-visible");
}

export function clearFormError(form) {
  const box = form && form.querySelector(".auth-error");
  if (box) {
    box.classList.remove("is-visible");
  }
}
