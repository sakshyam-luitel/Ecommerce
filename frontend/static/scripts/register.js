import { getCookie } from "../data/cart.js";
import { loginUser } from "./login.js?spa-v=4";
import {
  formatAuthError,
  showFormError,
  clearFormError,
} from "./utils/formError.js";

const csrftoken = getCookie('csrftoken')

const registerForm = document.querySelector('.js-register-form') || document.querySelector('.auth-form');

async function registerUser(){
    const username = document.getElementById('username')?.value
        || document.getElementById('register-username')?.value
    const email = document.getElementById('register-email')?.value
        || document.getElementById('email')?.value
    const password = document.getElementById('password')?.value
        || document.getElementById('register-password')?.value
    const passwordConfirm= document.getElementById('password-confirm')?.value
        || document.getElementById('register-password-confirm')?.value

    clearFormError(registerForm)

    if (password !== passwordConfirm) {
        showFormError(registerForm, "Passwords do not match.")
        return false
    }

    try{
        const response = await fetch('/api/auth/registration/',{
           method: "POST",
           credentials: "include",
           headers: {
            "Content-Type":"application/json",
            "X-CSRFToken":csrftoken
           },
           body: JSON.stringify({
            username: username,
            email: email,
            password1: password,
            password2: passwordConfirm
           })
        })
        if(!response.ok){
            const data = await response.json();
            console.log('Failed to add userdata:', data)
            showFormError(registerForm, formatAuthError(data))
            return false
        }
        const loginSucceeded = await loginUser(email, password);
        if (!loginSucceeded) {
            showFormError(registerForm, "Account created, but automatic sign in failed. Please sign in.");
            return false;
        }
        console.log('Registration and login successful')
        return true
    }
    catch(error){
        console.log("Error:", error)
        showFormError(registerForm, "Unable to reach the server. Please try again.")
        return false
    }
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const success = await registerUser();
        if (success) {
            window.navigateTo('/home/')
        }
    });
}