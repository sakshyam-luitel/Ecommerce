import { getCookie } from "../data/cart.js";

const csrftoken = getCookie('csrftoken')

async function registerUser(){
    const username = document.getElementById('username').value
    const email= document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm= document.getElementById('password-confirm').value


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
            alert('Registration Failed: ' + JSON.stringify(data));
        } else {
            console.log('Registration successful')
            window.location.href = '/' // or wherever you intend to redirect
        }
    }
    catch(error){
        console.log("Error:", error)
    }
}

document.querySelector('.auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await registerUser();
    window.location.href = '/'
});