const determine_winner = require("./utilities/determine_winner.js");
const Card = require("./card.js");
module.exports = class Dealer {
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
    give_pot(player1, player2, equal) {
        if(player2 === undefined) {
            player1.balance += this.pot;
        // Denne else-if sørger for, at hvis en spiller har called en all-in, hvor all-in var større end deres egen balance,
        // så kan denne spiller ikke modtage mere end det dobbelte af det, de selv har satset. 
        } else if (player1.player_move.move === 'All-in' && player2.player_move.move === 'All-in') {
            // I tilfælde af, at begge spillere har lige gode hænder, returneres deres bets bare tilbage til balancen. 
            if (equal === true) {
                player1.balance = player1.current_bet;
                player2.balance = player2.current_bet;

            } else {
                let leftovers = player2.current_bet - player1.current_bet;                                   
                player1.balance += player2.current_bet - leftovers + player1.current_bet;
                player2.balance += leftovers;

            }
        } else { //Grundet hvis begge har lige gode hænder. 
            player1.balance += this.pot/2;
            player2.balance += this.pot/2;
        }
    }
    end_betting_round(player1, player2) { 
        // Ny addition til metodens logiske udtryk. Dette er for at sikre, at spillet ikke slutter, når den med det første træk checker
        if (player1.current_bet === player2.current_bet && (player1.player_move.move !== "" && player2.player_move.move !== "")) {
            // this.pot += player1.current_bet + player2.current_bet;
            // player1.current_bet = 0;
            // player2.current_bet = 0;
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
        player2.blind = "bb";
    }
    
    get_winner(player1, player2){

        return determine_winner.determine_winner.bind(this)(player1, player2);
    }

}

