

function sendInfo (event) {
    let formElement = document.querySelector("form");
    console.log("hello");
    event.preventDefault();
    fetch("http://localhost:3000", {
        method: 'POST',
        body: new FormData(formElement)
    }).then((response) => {
        console.log("hejsa");
        return response.text();
    });

    //let result = await response.json();

    //alert(result.message);

    location.assign("game.html");
}