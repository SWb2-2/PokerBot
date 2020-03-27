let formElement = document.getElementById("formElem");

function sendInfo(event) {
    console.log("hello");
    //event.preventDefault();
    
    /*fetch("http://localhost:3000", {
        method: 'POST',
        body: "hejsa"
    }).then((response) => {
        console.log("hejsa");
        return response.text();
    });

    //let result = await response.json();

    //alert(result.message);
*/
    location.assign("game.html");
}