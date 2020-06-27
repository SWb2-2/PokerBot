'use strict'

//Sends form from front end to backend containing the desired game balance
async function sendInfo (event) {
    let formElement = document.querySelector("#balance").value;

    let response = await fetch("http://localhost:3000/balance", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({balance:formElement})
    });

    if(response.redirected) {
        window.location.href = response.url;
        return true;
    }

    return false;
}

module.exports.sendInfo = sendInfo;