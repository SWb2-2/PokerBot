class Card {
    constructor (rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

let screenWidth = document.screenWidth;
let screenHeight = document.screenHeight;

var testCard = new Card(10, 3);
var player_hand = [testCard, testCard];
var open_hand = [testCard, testCard, testCard];

let color = ["heart.png","clover.png","spade.png","diamond.png"];

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

function givePlayerCards(){
    for (let index = 0; index < player_hand.length; index++) {
        let card = createCard(player_hand[index]);
        document.getElementById("player-cards").appendChild(card);
    }
    
    document.getElementById("bot-cards").appendChild(createBotCard());
    document.getElementById("bot-cards").appendChild(createBotCard());
}

function giveTableCards(){
    for (let index = 0; index < open_hand.length; index++) {
        let card = createCard(open_hand[index]);
        document.getElementById("open-cards").appendChild(card);
    }
}