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
        this.blind = ""; // "bb", "sb"
        this.player_move = {move: "", amount: 0}; 
    }
}

var blind = 10;

var testCard = new Card(11, 3);

var player_hand = [testCard, testCard];

let move_made = "no";

let color = ["heart.png","clover.png","spade.png","diamond.png"];

//####################################################################################################
// Table functions
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

function createBotBackCard(){
    let cardHolder = document.createElement("div");
    cardHolder.setAttribute("id", "card-back");

    return cardHolder;
}

function showBotCards(bot_cards) {
    deleteCards("bot-cards");
    for (let index = 0; index < bot_cards.length; index++) {
        let card = createCard(bot_cards[index]);
        document.querySelector("#bot-cards").appendChild(card);        
    }
}

function deleteCards(parent_id) {
    let parent = document.getElementById(parent_id);
    
    parent.querySelectorAll("*").forEach(child => child.remove());
}

function giveCardsToPlayers(player_cards){
    deleteCards("player-cards");
    deleteCards("bot-cards");
    deleteCards("open-cards");

    for (let index = 0; index < player_cards.length; index++) {
        let card = createCard(player_cards[index]);
        document.getElementById("player-cards").appendChild(card);
        document.getElementById("bot-cards").appendChild(createBotBackCard());
    }

    let turn = this.getFirstTurn();

    this.decideTurn(turn);
}

function giveTableCards(table){
    deleteCards("open-cards");

    for (let index = 0; index < table.table_cards.length; index++) {
        let card = createCard(table.table_cards[index]);
        document.getElementById("open-cards").appendChild(card);
    }

    decideTurn(table);
}

function getTablecards() {
    let flop = [testCard, testCard, testCard];
    let cards = {table_cards: flop, whose_turn: "player"};

    giveTableCards(cards);
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

function getPlayerSetup() {
    let player = new Player(100);
    player.hand = player_hand;
    player.current_bet = blind;
    player.blind = "bb";
    player.balance = 90;
    return player;
}

function makeButtonsActive(id){
    document.getElementById(id).className = "button-on";
    document.getElementById(id).disabled = false;
}

function makeButtonsInactive(id){
    id.className = "button-off";
    id.disabled = true;
}

function showButtons(previous_move) {
    let previous_player = "ai_move" in previous_move;

    if (previous_player === true) {
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
    } else{
        makeButtonsActive("check");
        makeButtonsActive("raise");
        makeButtonsActive("fold");
    }    
}

function hideAllButtons() {
    let buttonKeeper = document.querySelector("#player-options");
    buttonKeeper.querySelectorAll("button").forEach(child => makeButtonsInactive(child));
}

function playerTurnSetup(previous_move) {
    showJumbotron("Your turn");
    hideJumbotron();

    showButtons(previous_move);
}

async function sendPlayerMove(player_turn) {
    let player_stats = await fetch("http://localhost:3000/player_move", {
        method: "POST",
        body: JSON.stringify(player_turn)
    });

    player_stats = await player_stats.text;
    //player_stats = JSON.parse(player_stats);
    console.log(player_stats);
    return player_stats;
}

function refreshPlayerStats(player_turn) {
    let player_stats = sendPlayerMove(player_turn);

    document.querySelector("#pot").innerHTML = player_stats.pot_size;
    document.querySelector("#player-bank #balance-field").innerHTML = player_stats.player_balance;

    decideTurn(player_stats);
}

function makePlayerMove(id) {
    let player_move = {move: "", amount: 0};
    
    if (id === "raise") {
        let bet = prompt("Input bet:", "");
        let player_balance = document.querySelector("#player-bank #balance-field").innerHTML;
        player_balance = player_balance.replace("$", "");
        player_balance = Number(player_balance);
        
        if (bet == null || bet == "" || bet > player_balance) {
            alert("Cannot make bet, try again!");
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
    let bot_move = {ai_move:"check", pot_size: 20, ai_balance: 90, whose_turn: "showdown"};
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

    decideTurn(pokerBot_play);
}

//####################################################################################################
// Basic game functions

function getFirstTurn() {
    return {pot: 15, whose_turn: "player"};
}

function setStartup() {
    let player_stats = this.getPlayerSetup();

    if (player_stats.blind === "bb") {
        document.querySelector("#player-bank #balance-field").innerHTML = player_stats.balance + "$";
        document.querySelector("#ai-bank #balance-field").innerHTML = (player_stats.balance+(player_stats.current_bet/2)) + "$";
        document.querySelector("#pot").innerHTML = (player_stats.current_bet+player_stats.current_bet/2) + "$";
    } else {
        document.querySelector("#player-bank #balance-field").innerHTML = player_stats.balance + "$";
        document.querySelector("#ai-bank #balance-field").innerHTML = (player_stats.balance-player_stats.current_bet) + "$";
        document.querySelector("#pot").innerHTML = (player_stats.current_bet+player_stats.current_bet*2) + "$";
    }

    hideAllButtons();
    giveCardsToPlayers(player_stats.hand);
}

function getEndOfGame() {
    return {player_balance: 110, ai_balance: 90, pot_size: 0, winner: "player", player_best_hand: "flush", ai_best_hand:"straight", ai_cards: player_hand};
}

function checkBank(player_balance, ai_balance) {
    if (player_balance === 0) {
        showJumbotron("Game over, Pokerbot won!");
        newGame();
    } else if (ai_balance === 0) {
        showJumbotron("You won!");
        newGame();
    } else{
        setStartup();
    }
}

function gameEnd() {
    let winner_plays = getEndOfGame();
    let win_without_fold = "player_best_hand" in winner_plays;
    alert(win_without_fold);
    if (win_without_fold === true) {
        showBotCards(winner_plays.ai_cards);

        showJumbotron("Pokerbot has " + winner_plays.ai_best_hand);
        hideJumbotron();

        showJumbotron("You have " + winner_plays.player_best_hand);
        hideJumbotron();
    }
    
    showJumbotron("The winner is " + winner_plays.winner);
    hideJumbotron();

    document.querySelector("#player-bank #balance-field").innerHTML = winner_plays.player_balance + "$";
    document.querySelector("#ai-bank #balance-field").innerHTML = winner_plays.ai_balance + "$";
    document.querySelector("#pot").innerHTML = "0$";

    checkBank(winner_plays.player_balance, winner_plays.ai_balance);
}

function decideTurn(last_turn_respond) {
    switch (last_turn_respond.whose_turn) {
        case "player":
            playerTurnSetup(last_turn_respond);
            break;
        case "robot":
            makePokerbotMove();
            break;
        case "table":
            getTablecards();
            break;
        case "showdown":
            gameEnd();
            break;    
        default:
            break;
    }
}

function newGame() {
    if (confirm("Do you wanna play another game?")) {
        location.assert("index.html");
    }
}

//####################################################################################################
window.onload = function() {
    this.setStartup();
}