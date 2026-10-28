// Built in object to create http request
const xhr = new XMLHttpRequest();
//send the http request by method get and url to send the message or request which is put in second parameter of the .open() method


//we add the event listener first which is like adding a event listener to a button when we press the button we put the  event listener first then click the button
xhr.addEventListener('load' , () =>{
    console.log(xhr.response);
});
xhr.open('GET' ,"https://supersimplebackend.dev" );
xhr.send(); // to send the http request
// when the http request is sent to the requested url then the response doesn't immediately appear on the requested computer it takes some time to load from the internet to the local machine

