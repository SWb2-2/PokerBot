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
        this.blind = "", // "bb", "sb"
        this.player_move = {move: "", amount: 0}; 
    }
}

class Dealer {
    constructor(){
        this.deck_cards = [];
        this.table_cards = [];
        this.pot = 0;
        }
    create_deck_of_cards() {
        for(let j = 0; j < 4; j++) {
    
            for(let i = 2; i <= 14; i++) {
                this.deck_cards.push(new Card(i, j));
            }
        }
    }
    add_table_cards(number) {

        for(let i = 0; i < number; i++) {
    
            this.table_cards.push(this.deck_cards.pop());
        }
    }
    give_hand_cards(player1, player2) {

        player1.hand.push(this.deck_cards.pop());
        player1.hand.push(this.deck_cards.pop());

        player2.hand.push(this.deck_cards.pop());
        player2.hand.push(this.deck_cards.pop());
    }
    shuffle_array() {

        let swap = 0; 
        let temp_storage;
        for(let i = 0; i < this.deck_cards.length; i++) {

            swap = Math.random() * this.deck_cards.length * this.deck_cards.length+1; 
            swap = Math.floor(swap % this.deck_cards.length);

            temp_storage = this.deck_cards[i];
            this.deck_cards[i] = this.deck_cards[swap];
            this.deck_cards[swap] = temp_storage;
        }
    }
    new_game(player1, player2) {

        this.deck_cards = [];
        this.table_cards = [];
        this.pot = 0; 
        player1.current_bet = 0; 
        player2.current_bet = 0;
        // Ny addition til new_game metoden herunder:
        player1.hand = [];
        player2.hand = [];
        
        player1.player_move.move = "";
        player2.player_move.move = "";
        
    }
    give_pot(player1, player2) {
        if(player2 === undefined) {
            player1.balance += this.pot;
        } else { //Grundet hvis begge har lige gode hænder. 
            player1.balance += this.pot/2;
            player2.balance += this.pot/2;
        }
    }
    end_betting_round(player1, player2) { 
        // Ny addition til metodens logiske udtryk. Dette er for at sikre, at spillet ikke slutter, når den med det første træk checker
        if (player1.current_bet === player2.current_bet && (player1.player_move.move !== "" && player2.player_move.move !== "")) {
            console.log(player1.current_bet, player2.current_bet);
            this.pot += player1.current_bet + player2.current_bet;
            player1.current_bet = 0;
            player2.current_bet = 0;
            return true;
        }
        if (player1.player_move.move === 'All-in' && player2.player_move.move !== "" || player2.player_move.move === "All-in") {
            this.pot = player1.current_bet + player2.current_bet;
            return true;
        }
        return false;
    }

    // Prop indtil videre
    make_blind(player1, player2) {
        player1.blind = "sb";
        player2.blind = "BB";
    }
    // Prop
    determine_winner(player1, player2) {
        return player1;
    }

}

// Den overordnede funktion, hvor hver iteration i loopet svarer til et spil poker.
function pokerGame(player1, player2, dealer) {
    while (player1.balance > 0 && player2.balance > 0) {
        preFlop(player1, player2, dealer);
        let addCards = 3;
        while (noFold(player1, player2) && dealer.table_cards.length < 5) {
            nextRound(player1, player2, dealer, addCards);
            addCards = 1;
        }
        distributeMoney(player1, player2, dealer);
        console.log(player1.balance, player2.balance);
        dealer.new_game(player1, player2);
    }
}

function preFlop(player1, player2, dealer) {
    dealer.create_deck_of_cards();
    dealer.shuffle_array();
    dealer.make_blind(player1, player2);
    dealer.give_hand_cards(player1, player2);
    
    printHand("Player1: ", player1.hand);
    printHand("Player2: ", player2.hand);

    if (player1.blind === "sb") {
        bettingRound(player1, player2, dealer);
    } else {
        bettingRound(player2, player1, dealer);
    }
}

function nextRound(player1, player2, dealer, tableCards) {
    dealer.add_table_cards(tableCards);
    printHand("Table: ", dealer.table_cards);
    printHand("Player1: ", player1.hand);
    printHand("Player2: ", player2.hand);
    console.log(player1.player_move.move, player2.player_move.move);
    if (player1.player_move.move !== 'All-in' && player2.player_move.move !== 'All-in') {
        if (player1.blind === "sb") {
            bettingRound(player1, player2, dealer);
        } else {
            bettingRound(player2, player1, dealer);
        }
    }
}

function noFold(player1, player2) {
    // Hvis vi lige et sekund ignorerer hvor forfærdeligt det ser ud, 
    // bruges denne boolske funktion egentlig bare som en sentinelvalue for, om nogen harr foldet
    return player1.player_move.move !== "Fold" && player2.player_move.move !== "Fold";
}

// En bettingrunde. 
function bettingRound(player1, player2, dealer) {
    player1.player_move.move = "";
    player2.player_move.move = "";
    
    while (!dealer.end_betting_round(player1, player2)) { 
        // Det er her, vi skal modtage en spillers input:
        player1.player_move.move = scanInput('string'); 
        if (checkMove(player1, player2, dealer) === false || dealer.end_betting_round(player1, player2)) {
            break;
        }
        // Og en anden spillers her:
        player2.player_move.move = scanInput('string'); 
        if (checkMove(player2, player1, dealer) === false) {
            break;
        }
    }
}

// Scanner input via det nedstående module. Det ser lidt skørt ud, men det betyder bare, at den søger et heltal.
function scanInput(string) {
    const inputReader = require('wait-console-input');
    if (string === "integer") {
        let inputBet = inputReader.readInteger( "Enter a bet: ", {
        reInputOnError: true,
        separator: 'enter',
        size: 5
        });
    console.log(`Player placed following bet: ${inputBet}`);
    return inputBet;
    }
    else {
            let playerMove = inputReader.readLine( "What do you wish to do?: ", {
            reInputOnError: true,
            separator: 'enter',
            size: 5
            });
        console.log(`Player ${playerMove}s`);
        return playerMove; 
    }
}
// Ud fra trækket bestemmes, hvad spilleren næst kan gøre. Her valideres også deres træk, dvs. man kan ikke raise med mere end det man har osv. 
// Overvejer at splitte dem ud i funktioner, fordi den bliver lidt voldsom for sig selv.
//kommentar: Hvad hvis man vil raise med at gå all in? Vi validere inputtet inden wi sætter player move til all-in, så det får de aldrig lov til 
function checkMove(player1, player2, dealer) {
    if (player1.player_move.move === 'Raise') {
        
        player1.player_move.amount = scanInput("integer");
        player1.player_move.amount = validateInput(player1, player2);
        player1.current_bet += player1.player_move.amount;
        player1.balance -= player1.player_move.amount;
        
        if (player1.balance === 0) {
            player1.player_move.move = "All-in";
        }
        return true;
    } 
    else if (player1.player_move.move === 'Fold') {
        dealer.pot += player1.current_bet + player2.current_bet;
        player1.current_bet = -1;
        return false;
    } 
    else if (player1.player_move.move === 'Call') {
        player1.player_move.amount = player2.current_bet - player1.current_bet;
        player1.current_bet += player2.current_bet - player1.current_bet;
        player1.balance -= player1.player_move.amount;
        console.log(player1.balance, player1.current_bet);
        
        if (player1.balance <= 0) {
            player1.player_move.move = "All-in";
            player1.current_bet = player1.balance + player1.current_bet;
            player1.balance = 0;
        }
        return true;
    } 
    else if (player1.player_move.move === 'Check') {
        if (player2.player_move.move !== '' && player2.player_move.move !== 'Check') {
            console.log("You cannot check in your given position.");
            player1.player_move.move = scanInput("string");
            return checkMove(player1, player2, dealer);
        }
        return true;
    }
    else {
        console.log("Move not in register");
        player1.player_move.move = scanInput("string");
        return checkMove(player1, player2, dealer);
    }
}

// Fordeler penge til spillerne. Der er to kategorier, i.e. enten vinder man fordi den ene foldede, 
// eller også vandt man i showdown. Det er det, som de to overordnede if og else hhv. repræsenterer. 
// kommentar: Hvad hvis man folder når bets er lige store? dvs, nogle callede og du så folder næste runde?
function distributeMoney(player1, player2, dealer) {
    if (noFold(player1, player2) === false) {
        // dealer.pot += player1.current_bet + player2.current_bet;
        player1.current_bet > player2.current_bet ? dealer.give_pot(player1) 
                                                  : dealer.give_pot(player2);
    } else {
        let winner = dealer.determine_winner(player1, player2);
        if (winner.length > 1) {
            dealer.give_pot(player1, player2);
        } else {
            dealer.give_pot(winner);
        }
    }
}
// Funktion til at printe en spillers hånd
function printHand(player, hand) {
    console.log("\n", player, "\n");
    for (let element of hand) {
        console.log(element);
    }
}
// Validerer input, således det ikke er tilladt at smide et bet, der er mindre end modstanderens raise
function validateInput(activePlayer, passivePlayer) {
    let input = activePlayer.player_move.amount;
    if ((activePlayer.player_move.move !== 'All-in')) {
        while(input > activePlayer.balance || input < 0 || input <= passivePlayer.current_bet) {
            console.log("Invalid bet. Please enter new bet");
            input = scanInput("integer");
           
        }
        return input;
    }
}

let player1 = new Player(200);
let player2 = new Player(200);
let dealer = new Dealer();
pokerGame(player1, player2, dealer);
