
let formElement = document.addEventListener('submit', (event) => {
    console.log("hello");
    let player = {
        balance: document.getElementById('balance').value
    };
    event.preventDefault();
    fetch("http://localhost:3000", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(player)
    }).then((response) => {
        console.log("hejsa");
        return response.text();
    });

    //let result = await response.json();

    //alert(result.message);

    location.assign("game.html");
});
/*
function sendInfo (event) {
    // let formElement = document.getElementById("formElem");
    console.log("hello");
    let player = {
        balance: document.getElementById('balance').value
    };
    event.preventDefault();
    fetch("http://localhost:3000", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(player)
    }).then((response) => {
        console.log("hejsa");
        return response.text();

    });

    //let result = await response.json();

    //alert(result.message);

    location.assign("game.html");
}*/