function sendInfo (event) {
    let formElement = document.querySelector("#balance").value;
    console.log("hello");

    fetch("http://localhost:3000", {
        method: 'POST',
        body: JSON.stringify({balance:formElement})
    }).then((response) => {
        console.log("hejsa");
        return response.text();
    });

    //let result = await response.json();

    //alert(result.message);

    location.assign("game.html");
}