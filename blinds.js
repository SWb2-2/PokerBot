var player1;
var player2;

var bb = 10;    //evt. udregnes ud fra spil beløb
var sb = bb/2;
var pot = 0;

function give_blinds(player1,player2) {
    if (player1.blind === "bb"){
        player1.blind === "sb"
        player2.blind === "bb"
    } 
    else if (player1.blind === "sb"){
        player1.blind === "bb"
        player2.blind === "sb"
    }
    else{
        player1.blind === "bb"
        player2.blind === "sb"
    }
}
function pay_blinds(player1,player2) {
    if  (player1.blind === "bb" && player2.blind === "sb"){
        player1.current_bet += bb;
        player2.current_bet += sb;
        player1.balance -= bb;
        player2.balance -= sb;
        pot = bb + sb;
    }
    else if (player1.blind === "sb" && player2.blind === "bb"){
        player1.current_bet += sb;
        player2.current_bet += bb;
        player1.balance -= sb;
        player2.balance -= bb;
        pot = bb + sb;
    }
}      