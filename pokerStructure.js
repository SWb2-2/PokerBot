// Ved ikke lige hvordan man eksporterer klasserne over fra main
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
            this.pot += player1.current_bet + player2.current_bet;
            player1.current_bet = 0;
            player2.current_bet = 0;
            return true;
        }
        return false;
    }

    // Prop indtil videre
    make_blind(player1, player2) {
        player1.blind = "SB";
        player2.blind = "BB";
    }
    // Prop
    determine_winner(player1, player2) {
        return player1;
    }

}

// Den overordnede funktion, hvor hver iteration i loopet svarer til et spil poker.
function initiatePoker(player1, player2, dealer) {
    while (player1.balance > 0 && player2.balance > 0) {
        preFlop(player1, player2, dealer);
        if (noFold(player1, player2)) {
            flopRound(player1, player2, dealer);
            while (noFold(player1, player2) && dealer.table_cards.length < 5) {
                turnRiverRound(player1, player2, dealer);
            }
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
    // Bestemer hvem der går først. Kunne også addes til bettingRound funktionen, men den bliver rimelig lang og redundant
    if (player1.blind === "sb") {
        bettingRound(player1, player2, dealer);
    } else {
        bettingRound(player2, player1, dealer);
    }
}

function flopRound(player1, player2, dealer) {
    dealer.add_table_cards(3);
    printHand("Table: ", dealer.table_cards);
    printHand("Player1: ", player1.hand);
    printHand("Player2: ", player2.hand);
    
    if (player1.blind === "sb") {
        bettingRound(player1, player2, dealer);
    } else {
        bettingRound(player2, player1, dealer);
    }
}

// Turn og river runde afvikles her. De er slået sammen, idet de udspilles på samme måde – et kort lægges på bordet og bettingrunde initieres.
function turnRiverRound(player1, player2, dealer) {
    // Vi kunne logisk set mikse alle rundefunktioner sammen ved at have en parameter k til at bestemme antallet af kort der lægges på bordet/ lave if else kæder.
    dealer.add_table_cards(1);
    printHand("Table: ", dealer.table_cards);
    printHand("Player1: ", player1.hand);
    printHand("Player2: ", player2.hand);
    
    if (player1.blind === "sb") {
        bettingRound(player1, player2, dealer);
    } else {
        bettingRound(player2, player1, dealer);
    }
}

function noFold(player1, player2) {
    // Hvis vi lige et sekund ignorerer hvor forfærdeligt det ser ud, 
    // bruges denne boolske funktion egentlig bare som en sentinelvalue for, om nogen harr foldet
    return player1.player_move.move !== "fold" && player2.player_move.move !== "fold";
}

// En bettingrunde. 
function bettingRound(player1, player2, dealer) {
    player1.player_move.move = "";
    player2.player_move.move = "";
        
    while (!dealer.end_betting_round(player1, player2)) { 
        if (playerProceed(player1, player2) === false || dealer.end_betting_round(player1, player2)) {
            break;
        }
        if (playerProceed(player2, player1) === false) {
            break;
        }
    }
}
// Tjekker, om spilleren vil med i spillet og i så fald, om de har et bet. 
function playerProceed(activePlayer, passivePlayer) {
    let bet = scanInput("integer");
    checkBet(activePlayer, passivePlayer, bet);
    bet = validateInput(activePlayer, passivePlayer, bet);
    
    if (noFold(activePlayer, passivePlayer) === false) {
        return false;
    } else {
        activePlayer.current_bet += bet;
        activePlayer.balance -= bet;
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
}
// Ud fra bettets størrelse bedømmes spillerens træk (Tænker dette bør blive ændret, men det virker indtil videre.)
function checkBet(player1, player2, bet) {
    if (player1.current_bet + bet > player2.current_bet) {
        player1.player_move.move = "raise";
    } else if (bet < 0) {
        player1.player_move.move = "fold";
    } else if (player1.current_bet + bet === player2.current_bet && player2.current_bet > 0) {
        player1.player_move.move = "call"
    } else 
        player1.player_move.move = "check";
}
// Fordeler penge til spillerne. Der er to kategorier, i.e. enten vinder man fordi den ene foldede, 
// eller også vandt man i showdown. Det er det, som de to overordnede if og else hhv. repræsenterer. 
function distributeMoney(player1, player2, dealer) {
    if (noFold(player1, player2) === false) {
        dealer.pot += player1.current_bet + player2.current_bet;
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
function validateInput(activePlayer, passivePlayer, input) {
    while (activePlayer.current_bet + input < passivePlayer.current_bet && activePlayer.player_move.move !== "fold" 
                                                                        && activePlayer.balance !== 0) {
        console.log("Invalid bet. Please enter new bet");
        input = scanInput("integer");
        checkBet(activePlayer, passivePlayer, input);
    }
    return input;
}

let player1 = new Player(200);
let player2 = new Player(200);
let dealer = new Dealer();
initiatePoker(player1, player2, dealer);