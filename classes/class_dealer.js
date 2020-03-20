const determine_winner = require("./dealer_util/Determine_winner.js");
const Card = require("./class_card.js");

const ace = 14;



module.exports = class Dealer {
    constructor(){
        this.deck_cards = [];
        this.table_cards = [];
        this.pot;
    }

    //Resets the dealer, and the players hand, and current bet.
    new_game(player1, player2) {

        this.deck_cards = [];
        this.table_cards = [];
        this.pot = 0; 

        player1.hand = [];
        player2.hand = [];
        player1.current_bet = 0; 
        player2.current_bet = 0;
    }

    //Places a new deck of 52 cards in deck_cards    
    create_deck_of_cards() {
        for(let suit = 0; suit < 4; suit++) {
            
            for(let rank = 2; rank <= ace; rank++) {
                this.deck_cards.push(new Card(rank, suit));
            }
        }
    }
    
    //Fischer yates shuffling algoritm. 
    //Works by shuffling the first element with a random element, then the second element, gets shuffled with a random element
    //This continues until every element have been swapped once, with a random element. 
    shuffle_array() {
        let swap = 0; 
        let temp_storage = 0;
        for(let i = 0; i < this.deck_cards.length; i++) {

            swap = Math.random() * this.deck_cards.length * this.deck_cards.length+1; 
            swap = Math.floor(swap % this.deck_cards.length);

            temp_storage = this.deck_cards[i];
            this.deck_cards[i] = this.deck_cards[swap];
            this.deck_cards[swap] = temp_storage;
        }
    }

    //Takes a number_of_cards from the deck, and place it on the table
    add_table_cards(number_of_cards) {

        for(let i = 0; i < number_of_cards; i++) {
    
            this.table_cards.push(this.deck_cards.pop());
        }
    }

    //Resets the players hands, and give them to cards. 
    give_player_cards(player1, player2) {

        player1.hand = [];
        player2.hand = [];

        player1.hand.push(this.deck_cards.pop());
        player1.hand.push(this.deck_cards.pop());

        player2.hand.push(this.deck_cards.pop());
        player2.hand.push(this.deck_cards.pop());
    }

    //Deteremines if the betting round is over based on they players current bets. 
    //If the bettinground is over, the bets are added to the pot, 
    //Othervise it returns false. 
    end_betting_round(player1, player2) {

        if(player1.current_bet === player2.current_bet) {
            this.pot += player1.current_bet + player2.current_bet;
            player1.current_bet = 0;
            player2.current_bet = 0;
            return true;
        }
        return false;
    }

    //Returns the winning player, and if they both win, return false. 
    get_winner(player1, player2){

        return determine_winner.bind(this)(player1, player2);
    }

    //If only 1 player is given, that is the winner of the given round and, that player is given the pot. 
    //If 2 players are given, they have similar strengths of hands, so they share the pot. 
    give_pot(player1, player2) {

        if(player2 === undefined) {
            player1.balance += this.pot;
        } else {
            player1.balance += this.pot/2;
            player2.balance += this.pot/2;
        }
    }
}