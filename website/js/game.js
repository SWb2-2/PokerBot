class Card {
    constructor (rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

class Player{
    constructor(balance) {
        this.balance = balance;
        this.hand = [];
        this.current_bet = 0;
        this.blind = blind; // "bb", "sb"
        this.player_move = {move: "", amount: 0}; 
    }
}

var blind = 10;

var testCard = new Card(11, 3);

var player_hand = [testCard, testCard];
var player = new Player(100);
player.hand = player_hand;
player.current_bet = blind;
player.blind = "bb";
let move_made = "no";

var flop = [testCard, testCard, testCard];
var cards = {table_cards: flop, whose_turn: player};

let color = ["heart.png","clover.png","spade.png","diamond.png"];

//####################################################################################################
// Card functions
function createCard(card_to_create){
    let cardColor = document.createElement("img");
    cardColor.src = "./Images/" + color[card_to_create.suit];

    let cardHolder = document.createElement("div");
    cardHolder.setAttribute("id", "card");

    switch (card_to_create.rank) {
        case 14:
            cardHolder.innerHTML = "A<br>";        
            break;
        case 13:
            cardHolder.innerHTML = "K<br>";        
            break;
        case 12:
            cardHolder.innerHTML = "Q<br>";        
            break;
        case 11:
            cardHolder.innerHTML = "J<br>";        
            break;
        default:
            cardHolder.innerHTML = card_to_create.rank + "<br>";
            break;
    }

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

function giveCardsToPlayers(player_cards){
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

//####################################################################################################
// Jumbotron functions

function showJumbotron(text) {
    document.getElementById("jumbo-text").innerHTML = text;
    document.getElementById("jumbotron").style.visibility = "visible";
}

function hideJumbotron() {
    document.getElementById("jumbotron").style.visibility = "hidden";
}

//####################################################################################################
// Player move functions

function makeButtonsActive(id){
    document.getElementById(id).className = "button-on";
    document.getElementById(id).disabled = false;
}

function makeButtonsInactive(id){
    id.className = "button-off";
    id.disabled = true;
}

function showButtons(robot_turn) {
    switch (robot_turn.ai_move) {
        case "check":
            makeButtonsActive("check");
            makeButtonsActive("fold");
            makeButtonsActive("raise");
            break;
        case "raise":
            makeButtonsActive("call");
            makeButtonsActive("fold");
            makeButtonsActive("raise");
            break;
        default:
            break;
    }
}

function hideAllButtons() {
    let buttonKeeper = document.querySelector("#player-options");

    buttonKeeper.querySelectorAll("button").forEach(child => makeButtonsInactive(child));
}

function sendPlayerMove(player_turn) {
    return {pot_size: 45, player_balance: 75, whose_turn: "not_player"};
}

function refreshPlayerStats(player_turn) {
    let player_stats = sendPlayerMove(player_turn);

    document.querySelector("#pot").innerHTML = player_turn.pot_size;
    document.querySelector("#player-bank #balance-field").innerHTML = player_turn.player_balance;
}

function getPlayerMove(id) {
    let player_move = {move: "", amount: 0};
    
    if (id === "raise") {
        //Add limit
        let bet = prompt("Input bet:", "5");
        if (bet == null || bet == "") {
            move_made = "no";
        }else{
            player_move.move = "raise";
            player_move.amount = bet;

            if (confirm("Are you sure you want to raise with " + bet + "?")) {
                move_made = "yes";
                refreshPlayerStats(player_move);
            }
        }
    } else{
        if (confirm("Are you sure you want to " + id + "?")) {
            move_made = "yes";
            player_move.move = id;
            player_move.amount = 0;
            refreshPlayerStats(player_move);
        }
    }
}

//####################################################################################################
// PokerBot move functions

function showMove(current_move) {
    let text = "Pokerbot has ";
    switch (current_move.ai_move) {
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
            showJumbotron(text + "raised");
            break;
        default:
            break;
    }
}

function getPokerbotPlay() {
    let bot_move = {ai_move:"raise", pot_size: 30, ai_balance: 75, whose_turn: "player"};
    return bot_move;
}

function makePokerbotMove(){
    hideAllButtons();

    showJumbotron("Pokerbots turn");
    hideJumbotron();

    let pokerBot_play = getPokerbotPlay();
    showMove(pokerBot_play);
    hideJumbotron();

    document.querySelector("#ai-bank #balance-field").innerHTML = pokerBot_play.ai_balance;
    document.querySelector("#pot").innerHTML = pokerBot_play.pot_size;

    return pokerBot_play;
}

//####################################################################################################
// Basic game functions

function setStartup(balance, blind_size, blind_type) {
    if (blind_type === "bb") {
        document.querySelector("#player-bank #balance-field").innerHTML = (balance-blind_size) + "$";
        document.querySelector("#ai-bank #balance-field").innerHTML = (balance-(blind_size/2)) + "$";
        document.querySelector("#pot").innerHTML = (blind_size*1.5) + "$";
    } else {
        document.querySelector("#player-bank #balance-field").innerHTML = (balance-blind_size) + "$";
        document.querySelector("#ai-bank #balance-field").innerHTML = (balance-(blind_size*2)) + "$";
        document.querySelector("#pot").innerHTML = (blind_size*3) + "$";
    }
}

function gameShowdown(showdown) {
    showJumbotron("Pokerbot has " + showdown.ai_best_hand);
    hideJumbotron();

    showJumbotron("Player has " + showdown.player_best_hand);
    hideJumbotron();

    showJumbotron("The winner is " + showdown.winner);
    hideJumbotron();

    document.querySelector("#player-bank #balance-field").innerHTML = showdown.player_balance + "$";
    document.querySelector("#ai-bank #balance-field").innerHTML = showdown.ai_balance + "$";
    document.querySelector("#pot").innerHTML = "0$";
}

function newGame() {
    if (confirm("Do you wanna play another game?")) {
        location.assert("index.html");
    }
}

//####################################################################################################
window.onload = function() {

    this.setStartup(this.player.balance, this.player.current_bet, this.player.blind);
    this.giveCardsToPlayers(player.hand);

    let pokerbot_move = this.makePokerbotMove();

    this.showButtons(pokerbot_move);

    while(this.move_made === "no") {
        console.log("wait");
    }

    this.giveTableCards(cards.table_cards);
}