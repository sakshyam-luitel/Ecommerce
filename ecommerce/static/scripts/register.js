import { getCookie } from "../data/cart.js";
import {
  formatAuthError,
  showFormError,
  clearFormError,
} from "./utils/formError.js";

const csrftoken = getCookie('csrftoken')

const registerForm = document.querySelector('.js-register-form') || document.querySelector('.auth-form');

async function registerUser(){
    const username = document.getElementById('username').value
    const email= document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm= document.getElementById('password-confirm').value

    clearFormError(registerForm)

    if (password !== passwordConfirm) {
        showFormError(registerForm, "Passwords do not match.")
        return false
    }

    try{
        const response = await fetch('/api/auth/registration/',{
           method: "POST",
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
        console.log('Registration successful')
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
            window.location.href = '/'
        }
    });
}