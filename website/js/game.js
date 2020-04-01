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

async function giveCardsToPlayers(player_cards){
    deleteCards("player-cards");
    deleteCards("bot-cards");
    deleteCards("open-cards");

    for (let index = 0; index < player_cards.client.hand.length; index++) {
        let card = createCard(player_cards.client.hand[index]);
        document.getElementById("player-cards").appendChild(card);
        document.getElementById("bot-cards").appendChild(createBotBackCard());
    }

    let first_turn = {player_move: "check", whose_turn: player_cards.whose_turn};
    decideTurn(first_turn);
}

async function giveTableCards(table){
    deleteCards("open-cards");

    for (let index = 0; index < table.table_cards.length; index++) {
        let card = createCard(table.table_cards[index]);
        document.getElementById("open-cards").appendChild(card);
    }

    await sleep(2000);

    decideTurn(table);
}

async function getTablecards() {
    await showJumbotron("Next round");
    hideJumbotron();
    
    let response = await fetch("http://localhost:3000/table_update", {
        method: "GET"
    });
    hideAllButtons();
    let cards = await response.json();
    cards = JSON.parse(cards);
    console.log(cards);

    giveTableCards(cards);
}

//####################################################################################################
// Jumbotron functions

async function showJumbotron(text) {
    document.getElementById("jumbo-text").innerHTML = text;
    document.getElementById("jumbotron").style.visibility = "visible";
    await sleep(2500);
}

function hideJumbotron() {
    document.getElementById("jumbotron").style.visibility = "hidden";
}

//####################################################################################################
// Player move functions

async function getPlayerSetup() {
    let response = await fetch("http://localhost:3000/player_object", {
        method: "GET"
    });
    
    let player = await response.json();
    player = JSON.parse(player);
    console.log(player);
    
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
    switch (previous_move.player_move) {
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
            makeButtonsActive("fold");
            makeButtonsActive("raise");
            makeButtonsActive("check");
            break;
    }
}

function hideAllButtons() {
    let buttonKeeper = document.querySelector("#player-options");
    buttonKeeper.querySelectorAll("button").forEach(child => makeButtonsInactive(child));
}

async function playerTurnSetup(previous_move) {
    await showJumbotron("Your turn");
    hideJumbotron();

    showButtons(previous_move);
}

async function sendPlayerMove(player_turn) {
    let response = await fetch("http://localhost:3000/player_move", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(player_turn)
    });
    
    let player_stats = await response.json();
    player_stats = JSON.parse(player_stats);
    
    return player_stats;
}

async function refreshPlayerStats(player_turn) {
    let player_stats = await sendPlayerMove(player_turn);
    
    document.querySelector("#pot").innerHTML = player_stats.pot + "$";
    document.querySelector("#player-bank #balance-field strong").innerHTML = player_stats.player_balance + "$";
    document.querySelector("#player-bank #bet strong").innerHTML = player_stats.player_current_bet + "$";

    decideTurn(player_stats);
}

function makePlayerMove(id) {
    let player_move = {move: "", amount: 0};
    
    if (id === "raise") {
        let player_current_bet = document.querySelector("#player-bank #bet strong").innerHTML;
        player_current_bet = player_current_bet.replace("$", "");
        player_current_bet = Number(player_current_bet);

        let ai_current_bet = document.querySelector("#ai-bank #bet strong").innerHTML;
        ai_current_bet = ai_current_bet.replace("$", "");
        ai_current_bet = Number(ai_current_bet);

        let player_balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        player_balance = player_balance.replace("$", "");
        player_balance = Number(player_balance) - (ai_current_bet - player_current_bet);

        let bet = prompt("Input bet (max bet is " + player_balance + "):", "");

        if (bet === null || bet === "" || bet > player_balance) {
            alert("Cannot make bet, try again!");
        }else{
            player_move.move = "raise";
            player_move.amount = bet;

            if (confirm("Are you sure you want to raise with " + bet + "?")) {
                refreshPlayerStats(player_move);
            }
        }
    } else{
        if (confirm("Are you sure you want to " + id + "?")) {
            player_move.move = id;
            player_move.amount = 0;
            refreshPlayerStats(player_move);
        }
    }
}

//####################################################################################################
// PokerBot move functions

async function showMove(current_move) {
    let text = "Pokerbot has ";
    switch (current_move.player_move) {
        case "check":
            await showJumbotron(text + "checked");
            break;
        case "call":
            await showJumbotron(text + "called");
            break;
        case "fold":
            await showJumbotron(text + "folded");
            break;
        case "raise":
            await showJumbotron(text + "raised with " + current_move.player_amount);
            break;
        default:
            break;
    }
}

async function getPokerbotPlay() {
    let response = await fetch("http://localhost:3000/ai_move", {
        method: "GET"
    });
    
    let ai_move = await response.json();
    ai_move = JSON.parse(ai_move);
    console.log(ai_move);

    return ai_move;
}

async function makePokerbotMove(){
    hideAllButtons();

    await showJumbotron("Pokerbots turn");
    hideJumbotron();

    await sleep(2000);

    let pokerBot_play = await getPokerbotPlay();
    await showMove(pokerBot_play);
    hideJumbotron();

    document.querySelector("#ai-bank #balance-field strong").innerHTML = pokerBot_play.player_balance + "$";
    document.querySelector("#ai-bank #bet strong").innerHTML = pokerBot_play.player_current_bet + "$";
    document.querySelector("#pot").innerHTML = pokerBot_play.pot + "$";

    decideTurn(pokerBot_play);
}

//####################################################################################################
// Basic game functions

async function sleep(ms) {
    return new Promise(res => {setTimeout(res, ms)});
}

async function setStartup() {
    let player_stats = await getPlayerSetup();

    document.querySelector("#player-bank #balance-field strong").innerHTML = player_stats.client.balance + "$";
    document.querySelector("#player-bank #bet strong").innerHTML = player_stats.client.current_bet + "$";
    document.querySelector("#player-bank #blind strong").innerHTML = (player_stats.client.blind === "bb" ? "Big blind" : "Small blind");

    document.querySelector("#ai-bank #balance-field strong").innerHTML = player_stats.bot.balance + "$";
    document.querySelector("#ai-bank #bet strong").innerHTML = player_stats.bot.current_bet + "$";
    document.querySelector("#ai-bank #blind strong").innerHTML = (player_stats.bot.blind === "bb" ? "Big blind" : "Small blind");
    
    document.querySelector("#pot").innerHTML = player_stats.pot + "$";

    hideAllButtons();

    giveCardsToPlayers(player_stats);
}

async function getEndOfGame() {
    let response = await fetch("http://localhost:3000/winner", {
        method: "GET"
    });
    
    let winner = await response.json();
    winner = JSON.parse(winner);
    console.log(winner);
    return winner;
}

async function checkBank(player_balance, bot_balance) {
    if (player_balance === 0) {
        await showJumbotron("Game over, Pokerbot won!");
        newGame();
    } else if (bot_balance === 0) {
        await showJumbotron("You won!");
        newGame();
    } else{
        alert("Starting new game!");
        setStartup();
    }
}

async function gameEnd() {
    let winner_plays = await getEndOfGame();
    let win_without_fold = "player_best_hand" in winner_plays;
    
    hideAllButtons();

    if (win_without_fold === true) {
        await showJumbotron("Showdown");
        hideJumbotron();

        await sleep(2000);
        showBotCards(winner_plays.ai_cards);
        await sleep(2000);

        await showJumbotron("Pokerbot has " + winner_plays.ai_best_hand);
        hideJumbotron();
        await sleep(2000);
        await showJumbotron("You have " + winner_plays.player_best_hand);
        hideJumbotron();
    }
    
    let winner_name = winner_plays.winner === "robot" ? "Pokerbot" : "Player";
    await sleep(2000);
    await showJumbotron("The winner is " + winner_name);
    hideJumbotron();
    console.log("hello" + winner_plays.bot_balance);
    document.querySelector("#player-bank #balance-field strong").innerHTML = winner_plays.player_balance + "$";
    document.querySelector("#ai-bank #balance-field strong").innerHTML = winner_plays.bot_balance + "$";
    document.querySelector("#player-bank #bet strong").innerHTML = "0$";
    document.querySelector("#pot").innerHTML = "0$";

    checkBank(winner_plays.player_balance, winner_plays.bot_balance);
}

async function decideTurn(last_turn_respond) {
    await sleep(1000);
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