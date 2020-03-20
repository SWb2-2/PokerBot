class Card {
    constructor (rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

let screenWidth = document.screenWidth;
let screenHeight = document.screenHeight;

var blind = 10;
var player_balance = 100;

var testCard = new Card(10, 3);
var player_hand = [testCard, testCard];
var flop = [testCard, testCard, testCard];
var turn = [testCard, testCard, testCard, testCard];
var river = [testCard, testCard, testCard, testCard, testCard];

let color = ["heart.png","clover.png","spade.png","diamond.png"];

//####################################################################################################
function createCard(card_to_create){
    let cardColor = document.createElement("img");
    cardColor.src = "./Images/" + color[card_to_create.suit];

    let cardHolder = document.createElement("div");
    cardHolder.setAttribute("id", "card");
    cardHolder.innerHTML = card_to_create.rank + "<br>";
    cardHolder.appendChild(cardColor);

    return cardHolder;
}

function createBotCard(){
    let cardHolder = document.createElement("div");
    cardHolder.setAttribute("id", "card-back");

    return cardHolder;
}

function deleteCards(parent_id) {
    let parent = document.getElementById(parent_id);
    
    parent.querySelectorAll("*").forEach(child => child.remove());
}

function showJumbotron(text) {
    document.getElementById("jumbo-text").innerHTML = text;
    document.getElementById("jumbotron").style.visibility = "visible";
}

function hideJumbotron() {
    document.getElementById("jumbotron").style.visibility = "hidden";
}

function showButtons(robot_move) {
    document.getElementById("player-options").style.visibility = "visible";
    switch (robot_move.move) {
        case "check":
            
            break;
    
        default:
            break;
    }
}

function hideButtons() {
    document.getElementById("player-options").style.visibility = "hidden";
}
//####################################################################################################
function setStartup(balance, bb) {
    let balance_div = document.getElementById("balance-field");
    balance_div.innerHTML = (balance-bb) + "$";

    let pot_div = document.getElementById("pot");
    pot_div.innerHTML = (bb+bb/2) + "$";
}

function givePlayerCards(player_cards){
    deleteCards("player-cards");
    deleteCards("bot-cards");

    for (let index = 0; index < player_cards.length; index++) {
        let card = createCard(player_cards[index]);
        document.getElementById("player-cards").appendChild(card);
        document.getElementById("bot-cards").appendChild(createBotCard());
    }
}

function giveTableCards(table_cards){
    deleteCards("open-cards");

    for (let index = 0; index < table_cards.length; index++) {
        let card = createCard(table_cards[index]);
        document.getElementById("open-cards").appendChild(card);
    }
}

function getPokerbotPlay() {
    let bot_move = {move: "raise", amount: 30};
    return bot_move;
}

function showMove(current_move) {
    let text = "Pokerbot has ";
    switch (current_move.move) {
        case "check":
            showJumbotron(text + "checked");
            break;
        case "call":
            showJumbotron(text + "called");
            break;
        case "fold":
            showJumbotron(text + "folded");
            break;
        case "raise":
            showJumbotron(text + "raised with " + current_move.amount);
            break;
        default:
            break;
    }
}

//####################################################################################################
window.onload = function() {
    this.setStartup(this.player_balance, this.blind);
    this.givePlayerCards(player_hand);

    this.showJumbotron("Pokerbots turn");
    this.setTimeout(this.hideJumbotron, 2000);
    let pokerBot_move = this.getPokerbotPlay();
    this.setTimeout(this.showMove, 4000, pokerBot_move);
    this.setTimeout(this.hideJumbotron, 6000);


}