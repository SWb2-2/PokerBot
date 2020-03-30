'use strict'

async function sendInfo (event) {
    let formElement = document.querySelector("#balance").value;

    await fetch("http://localhost:3000/balance", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({balance:formElement})
    }).then((response) => {
        if(response.redirected){
            window.location.href = response.url;
        }
    });

    return false;
}