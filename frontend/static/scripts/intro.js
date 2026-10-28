const loginModal = document.querySelector(".js-login-modal");
const registerModal = document.querySelector(".js-register-modal");
const openLoginButtons = document.querySelectorAll(".js-open-login-modal");
const openRegisterButtons = document.querySelectorAll(".js-open-register-modal");
const closeLoginButtons = document.querySelectorAll(".js-close-login-modal");
const closeRegisterButtons = document.querySelectorAll(".js-close-register-modal");
const firstLoginInput = document.getElementById("email");
const firstRegisterInput = document.getElementById("register-username");

function lockScroll() {
  document.body.classList.add("no-scroll");
}

function unlockScroll() {
  const isLoginOpen = loginModal && loginModal.classList.contains("is-open");
  const isRegisterOpen = registerModal && registerModal.classList.contains("is-open");

  if (!isLoginOpen && !isRegisterOpen) {
    document.body.classList.remove("no-scroll");
  }
}

function openLoginModal() {
  if (!loginModal) {
    return;
  }

  loginModal.classList.add("is-open");
  loginModal.setAttribute("aria-hidden", "false");
  lockScroll();

  if (firstLoginInput) {
    firstLoginInput.focus();
  }
}

function closeLoginModal() {
  if (!loginModal) {
    return;
  }

  loginModal.classList.remove("is-open");
  loginModal.setAttribute("aria-hidden", "true");
  unlockScroll();
}

function openRegisterModal() {
  if (!registerModal) {
    return;
  }

  registerModal.classList.add("is-open");
  registerModal.setAttribute("aria-hidden", "false");
  lockScroll();

  if (firstRegisterInput) {
    firstRegisterInput.focus();
  }
}

function closeRegisterModal() {
  if (!registerModal) {
    return;
  }

  registerModal.classList.remove("is-open");
  registerModal.setAttribute("aria-hidden", "true");
  unlockScroll();
}

openLoginButtons.forEach((button) => {
  button.addEventListener("click", openLoginModal);
});

openRegisterButtons.forEach((button) => {
  button.addEventListener("click", openRegisterModal);
});

closeLoginButtons.forEach((button) => {
  button.addEventListener("click", closeLoginModal);
});

closeRegisterButtons.forEach((button) => {
  button.addEventListener("click", closeRegisterModal);
});

if (loginModal) {
  loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      closeLoginModal();
    }
  });
}

if (registerModal) {
  registerModal.addEventListener("click", (event) => {
    if (event.target === registerModal) {
      closeRegisterModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLoginModal();
    closeRegisterModal();
  }
});