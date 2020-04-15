let color = ["heart.png","clover.png","spade.png","diamond.png"];

//####################################################################################################
// Table functions

/**
 * Funktionen laver et div element som skal forestille et kort.
 * @param {in}  card_to_create  : Objekt som er af typen "Card", og derved indeholder både en rank, angivet som et tal, 
 *                                og et suit angivet som en værdi mellem 0 og 3.
 * @param {out} cardHolder      : HTML-DOM-Objekt som er på formen "<div id="card">A<br><img src="./Images/heart.png"></div>", hvor "A" er kortets værdi, 
 *                                og "heart.png" er kuløren.
 */
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

/**
 * Funktionen laver et div element som skal forestille bagsiden af robbottens kort.
 * @param {out} cardHolder  : HTML-DOM-objekt som ser således ud "<div id="card-back"</div>"
 */
function createBotBackCard(){
    let cardHolder = document.createElement("div");
    cardHolder.setAttribute("id", "card-back");

    return cardHolder;
}

/**
 * Funktionen viser robbottens kort til spilleren, ved først at fjerne de kort der allerede ligger ved robbotten, og derefter ligger de nye kort ind.
 * @param {in} bot_cards    : Et array, som indeholder robbottens to kort som skal være objekter af typen "Card". 
 */
function showBotCards(bot_cards) {
    deleteCards("bot-cards");
    for (let index = 0; index < bot_cards.length; index++) {
        let card = createCard(bot_cards[index]);
        document.querySelector("#bot-cards").appendChild(card);        
    }
}

/**
 * Funktionen fjerner alle børn af det element som har et bestemt id.
 * @param {in} parent_id    : Id på det element som man ønsker at fjerne elementer i, variablen skal være en string.
 */
function deleteCards(parent_id) {
    let parent = document.getElementById(parent_id);
    
    parent.querySelectorAll("*").forEach(child => child.remove());
}

/**
 * Funktionen gør selve spillepladen klar til et nyt spil, ved først at fjerne de forhenværende kort og derefter give spillerne deres nye kort, 
 * når dette er gjort, bliver det den første spillers tur.
 * @param {in} player_cards : Objekt som indeholder et klient objekt af typen "Player", samt "whose_turn" som enten er "player" eller "robot". 
 * @param {out} first_turn  : Objekt som indeholder et fiktivt første move som er sat for at spillerens knapper er korrekt, samt hvems tur det er.
 */
async function giveCardsToPlayers(player_cards){
    deleteCards("player-cards");
    deleteCards("bot-cards");
    deleteCards("open-cards");

    for (let index = 0; index < player_cards.client.hand.length; index++) {
        let card = createCard(player_cards.client.hand[index]);
        document.getElementById("player-cards").appendChild(card);
        document.getElementById("bot-cards").appendChild(createBotBackCard());
    }

    let first_turn = {player_move: "raise", whose_turn: player_cards.whose_turn};
    
    decideTurn(first_turn);
}

/**
 * Funktionen indsætter bordets kort, ved først at sige at en nye runde begynder og derefter hente de nye kort fra serveren.
 * @param {out} table   : Objekt som indeholder et array med objekter af typen "Card", samt "whose_turn"
 */
async function giveTableCards(){
    deleteCards("open-cards");
    hideAllButtons();

    await showJumbotron("Next round");
    hideJumbotron();

    let table = await getTableCards();

    for (let index = 0; index < table.table_cards.length; index++) {
        let card = createCard(table.table_cards[index]);
        document.getElementById("open-cards").appendChild(card);
    }

    //await sleep(2000);

    decideTurn(table);
}

/**
 * Funktionen henter bordets kort fra serveren.
 * @param {out} cards   : Objekt som indeholder et array med objekter af typen "Card", samt "whose_turn" som enten er player, robot, showdown eller table.
 */
async function getTableCards() {
    let response = await fetch("http://localhost:3000/table_update", {
        method: "GET"
    });

    let cards = await response.json();
    cards = JSON.parse(cards);

    return cards;
}

//####################################################################################################
// Jumbotron functions

/**
 * Funktionen viser en box i HTML som hedder jumbotron, og indsætter den angivne tekst.
 * @param {in} text     : Teksten der skal skrives på HTML-elementet, som skal være angivet som en string.
 */
async function showJumbotron(text) {
    document.getElementById("jumbo-text").innerHTML = text;
    document.getElementById("jumbotron").style.visibility = "visible";
    //await sleep(2500);
}

/**
 * Funktionen skjuler jumbotronen så den ikke længere er synlig på skærmen.
 */
function hideJumbotron() {
    document.getElementById("jumbotron").style.visibility = "hidden";
}

//####################################################################################################
// Player move functions

/**
 * Funktionen henter start opsættet for spillet, som fx balance og spillerens kort.
 * @param {out} player  : Objekt som indeholder to objekter af typen "Player", en til robotten og en til spilleren, potten og whose_turn.
 */
async function getPlayerSetup() {
    let response = await fetch("http://localhost:3000/player_object", {
        method: "GET"
    });
    
    let player = await response.json();
    player = JSON.parse(player);
    
    return player;
}

/**
 * Funktionen indsætter spillerens stats.
 * @param {in} balance      : Spillerens nuværende balance angivet som et tal.
 * @param {in} current_bet  : Spillerens nuværende bet angivet som et tal.
 * @param {in} blind        : Spillerens blind type, som enten er "Small blind" eller "Big blind", denne skal være en string.
 */
function inputPlayerStats(balance, current_bet, blind) {
    document.querySelector("#player-bank #balance-field strong").innerHTML = balance + "$";
    document.querySelector("#player-bank #bet strong").innerHTML = current_bet + "$";
    if (blind !== undefined) {
        document.querySelector("#player-bank #blind strong").innerHTML = blind;
    }
}


/**
 * Funktionen gør en knap aktiv og derved brugbar.
 * @param {in} id   : Id til den knap som man ønsker at gøre aktiv.
 */
function makeButtonsActive(id){
    document.getElementById(id).className = "button-on";
    document.getElementById(id).disabled = false;
}

/**
 * Funktionen gør en knap inaktiv og derved ubrugbar.
 * @param {in} id   : Id til den knap som man ønsker at gøre inaktiv.
 */
function makeButtonsInactive(id){
    document.getElementById(id).className = "button-off";
    document.getElementById(id).disabled = true;
}

/**
 * Funktionen vælger ud fra det sidste træk hvilke knapper der skal blive aktive.
 * @param {in} previous_move    : Objekt som indeholder "player_move", som kan være check, raise eller call.
 */
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

/**
 * Funktionen gør alle knapper inaktive ved at loope knapperne igennem.
 */
function hideAllButtons() {
    let buttonKeeper = document.querySelector("#player-options");
    buttonKeeper.querySelectorAll("button").forEach(child => makeButtonsInactive(child.id));
}

/**
 * Funktionen viser at det er spillerens tur, samt sørger for at nogle af knapperne bliver aktive.
 * @param {*} previous_move     : Objekt som indeholder "player_move".
 */
async function playerTurnSetup(previous_move) {
    await showJumbotron("Your turn");
    hideJumbotron();

    showButtons(previous_move);
}

/**
 * Funktionen sender spillerens træk til serveren, og modtager derefter de opdaterede stats til spilleren.
 * @param {in} player_turn      : Objekt som indeholder "move" og "amount".
 * @param {out} player_stats    : Objekt som indeholder pot, player_balance, player_current_bet, player_move, player_amount, whose_turn.
 */
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

/**
 * Funktionen opdaterer spillerens stats og giver derefter turen videre.
 * @param {in} player_turn      : Objekt som indeholder "move" og "amount".
 * @param {out} player_stats    : Objekt som indeholder pot, player_balance, player_current_bet, player_move, player_amount, whose_turn.
 */
async function refreshPlayerStats(player_turn) {
    let player_stats = await sendPlayerMove(player_turn);

    document.querySelector("#pot").innerHTML = player_stats.pot + "$";
    inputPlayerStats(player_stats.player_balance, player_stats.player_current_bet);

    decideTurn(player_stats);
}

/**
 * Funktionen bliver kaldt af en HTML-knap, som indikerer hvilket træk spilleren vil lave. Hvis spilleren vil raise bliver der bedt om en værdi, 
 * hvor denne værdi bliver tjekket mod en maks værdi. Hvis trækket kan laves bliver spilleren spurgt om denne vil lave trækket.
 * @param {in} id               : Id på den knap som spilleren har trykket på.
 * @param {out} player_move     : Objekt som indeholder "move" som kommer fra den knap spilleren trykker på, og "amount" som er den mængde der skal raises med.
 */
async function makePlayerMove(id) {
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
                await refreshPlayerStats(player_move);
            }
        }
    } else{
        if (confirm("Are you sure you want to " + id + "?")) {
            player_move.move = id;
            player_move.amount = 0;
            await refreshPlayerStats(player_move);
        }
    }
}

//####################################################################################################
// PokerBot move functions

/**
 * Funktionen indsætter robottens nye stats i de givne HTML-elementer.
 * @param {in} balance      : Robottens nuværende balance, som er angivet med et tal.
 * @param {in} current_bet  : Robottens nuværende bet, som er angivet med et tal.
 * @param {in} blind        : Robottens blind som enten er "Small blind" eller "Big blind".
 */
function inputBotStats(balance, current_bet, blind) {
    document.querySelector("#ai-bank #balance-field strong").innerHTML = balance + "$";
    document.querySelector("#ai-bank #bet strong").innerHTML = current_bet + "$";
    if (blind !== undefined) {
        document.querySelector("#ai-bank #blind strong").innerHTML = blind;
    }
}

/**
 * Funktionen viser robottens træk på et HTML-element.
 * @param {in} current_move     : Objekt som indeholder "player_move", som enten er check, raise, fold eller call.
 */
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
    }
}

/**
 * Funktionen henter robottens træk fra serveren.
 * @param {out} ai_move     : Objekt som indeholder pot, player_balance, player_current_bet, player_move, player_amount, whose_turn.
 */
async function getPokerbotPlay() {
    let response = await fetch("http://localhost:3000/ai_move", {
        method: "GET"
    });
    
    let ai_move = await response.json();
    ai_move = JSON.parse(ai_move);

    return ai_move;
}

/**
 * Funktionen udfører robottens træk, ved først at hente det, derefter vise det til spilleren og til sidst opdatere robottens stats.
 * @param {out} pokerBot_play       : Objekt som indeholder pot, player_balance, player_current_bet, player_move, player_amount, whose_turn.
 */
async function makePokerbotMove(){
    hideAllButtons();

    await showJumbotron("Pokerbots turn");
    hideJumbotron();

    //await sleep(2000);

    let pokerBot_play = await getPokerbotPlay();
    await showMove(pokerBot_play);
    hideJumbotron();
    
    inputBotStats(pokerBot_play.player_balance, pokerBot_play.player_current_bet);
    document.querySelector("#pot").innerHTML = pokerBot_play.pot + "$";

    decideTurn(pokerBot_play);
}

//####################################################################################################
// Basic game functions

/**
 * Funktionen timeouter flowet uden at blokere for det ved at køre setTimeout og først resolve et promise når settimeout er resolvet.
 * @param {in} ms       : Antallet af millisekunder pausen i programmet skal vare, det skaæl være af typen integer.
 * @param {out}         : Den returnerer undefined når tiden er gået.
 */
async function sleep(ms) {
    return new Promise(res => {setTimeout(res, ms)});
}

/**
 * Funktionen sætter spillet op ved at uddele balance, blinds og sætte potten inden spillet begynder.
 * @param {out} player_stats    : Objekt som indeholder to objekter af typen "Player", et for robotten og et til spilleren, samt potten og whose_turn.
 */
async function setStartup() {
    let player_stats = await getPlayerSetup();

    inputPlayerStats(player_stats.client.balance, player_stats.client.current_bet, (player_stats.client.blind === "bb" ? "Big blind" : "Small blind"));
    inputBotStats(player_stats.bot.balance, player_stats.bot.current_bet, (player_stats.bot.blind === "bb" ? "Big blind" : "Small blind"));
    
    document.querySelector("#pot").innerHTML = player_stats.pot + "$";

    hideAllButtons();

    giveCardsToPlayers(player_stats);
}

/**
 * Funktionen henter vinderen af spillet samt detaljer om spillernes hænder og uddeling af potten.
 * @param {out}     : Objekt som enten indeholder player_balance,bot_balance,pot,winner,player_best_hand,ai_best_hand,ai_cards eller
 *                    player_balance,bot_balance,pot,winner.
 */
async function getEndOfGame() {
    let response = await fetch("http://localhost:3000/winner", {
        method: "GET"
    });
    
    let winner = await response.json();
    winner = JSON.parse(winner);
    return winner;
}

/**
 * Funktionen tjekker balancen for hver spiller og beslutter derudfra om der skal startes et nyt spil eller om spillet er helt slut.
 * @param {in} player_balance   : Spillerens balance som er angivet som en integer
 * @param {in} bot_balance      : Robottens balance som er angivet som en integer
 */
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

/**
 * Funktionen henter vinderen af spillet fra serveren og viser derefter spillernes kort, hvem der avndt og til sidst uddeles potten.
 * @param {out} winner_plays    : Objekt som enten indeholder player_balance,bot_balance,pot,winner,player_best_hand,ai_best_hand,ai_cards eller
 *                                player_balance,bot_balance,pot,winner.
 */
async function gameEnd() {
    let winner_plays = await getEndOfGame();
    let win_without_fold = "player_best_hand" in winner_plays;
    
    hideAllButtons();

    if (win_without_fold === true) {
        await showJumbotron("Showdown");
        hideJumbotron();

        //await sleep(2000);
        showBotCards(winner_plays.ai_cards);
        //await sleep(2000);

        await showJumbotron("Pokerbot has " + winner_plays.ai_best_hand);
        hideJumbotron();
        //await sleep(2000);
        await showJumbotron("You have " + winner_plays.player_best_hand);
        hideJumbotron();
    }
    
    let winner_name = winner_plays.winner === "robot" ? "Pokerbot" : "Player";
    //await sleep(2000);
    await showJumbotron("The winner is " + winner_name);
    hideJumbotron();

    inputPlayerStats(winner_plays.player_balance, 0);
    inputBotStats(winner_plays.bot_balance, 0);
    
    document.querySelector("#pot").innerHTML = "0$";

    checkBank(winner_plays.player_balance, winner_plays.bot_balance);
}

/**
 * Funktionen sørger for at føre turen videre fra de forskellige dele af spillet til den næste del.
 * @param {*} last_turn_respond     : Objekt som skal indeholde whose_turn og kan indeholde et objekt med player_move={move:, amount:}.
 */
async function decideTurn(last_turn_respond) {
    //await sleep(1000);
    switch (last_turn_respond.whose_turn) {
        case "player":
            await playerTurnSetup(last_turn_respond);
            break;
        case "robot":
            await makePokerbotMove();
            break;
        case "table":
            await giveTableCards();
            break;
        case "showdown":
            await gameEnd();
            break;    
        default:
            break;
    }
}

/**
 * Funktionen giver spilleren mulighed for at starte et nyt spil hvis dette ønskes. Hvis dette ønske skiftes siden tilbage til startsiden.
 */
async function newGame() {
    if (confirm("Do you wanna play another game?")) {
        let response = await fetch("http://localhost:3000/new_game", {
            method: 'GET'
        });
        
        if(response.redirected){
            window.location.href = response.url;
            return true;
        }
    }
    return false;
}

//####################################################################################################
window.onload = function() {
    this.setStartup();
}

module.exports.showBotCards = showBotCards;
module.exports.deleteCards = deleteCards;
module.exports.createCard = createCard;
module.exports.giveCardsToPlayers = giveCardsToPlayers;
module.exports.createBotBackCard = createBotBackCard;
module.exports.decideTurn = decideTurn;
module.exports.showJumbotron = showJumbotron;
module.exports.sleep = sleep;
module.exports.hideJumbotron = hideJumbotron;
module.exports.inputPlayerStats = inputPlayerStats;
module.exports.makeButtonsActive = makeButtonsActive;
module.exports.makeButtonsInactive = makeButtonsInactive;
module.exports.showButtons = showButtons;
module.exports.makePlayerMove = makePlayerMove;
module.exports.refreshPlayerStats = refreshPlayerStats;
module.exports.sendPlayerMove = sendPlayerMove;
module.exports.inputBotStats = inputBotStats;
module.exports.playerTurnSetup = playerTurnSetup;
module.exports.hideAllButtons = hideAllButtons;
module.exports.getPokerbotPlay = getPokerbotPlay;
module.exports.showMove = showMove;
module.exports.makePokerbotMove = makePokerbotMove;
module.exports.setStartup = setStartup;
module.exports.getPlayerSetup = getPlayerSetup;
module.exports.getTableCards = getTableCards;
module.exports.giveTableCards = giveTableCards;
module.exports.gameEnd = gameEnd;
module.exports.getEndOfGame = getEndOfGame;
module.exports.checkBank = checkBank;
module.exports.showBotCards = showBotCards;
module.exports.newGame = newGame;