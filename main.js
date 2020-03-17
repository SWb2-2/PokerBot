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
        this.pot;
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
    }
    give_pot(player1, player2) {

        if(player2 === undefined) {
            player1.balance += this.pot;
        } else { //Grundet vis begge har lige gode hænder. 
            player1.balance += this.pot/2;
            player2.balance += this.pot/2;
        }
    }
    end_betting_round(player1, player2) {

        if(player1.current_bet === player2.current_bet) {
            this.pot += player1.current_bet + player2.current_bet;
            player1.current_bet = 0;
            player2.current_bet = 0;
            return true;
        }
        return false;
    }


    make_blind(player1, player1) {

    }

    determine_winner(player1, player2) {

    }

}

let dealer = new Dealer;

let player1 = new Player(100);
let player2 = new Player(100);

dealer.give_hand_cards(player1, player2);

dealer.create_deck_of_cards();

dealer.shuffle_array();

dealer.add_table_cards(3);

console.log(dealer);






// deck_cards = create_deck_of_cards();
// deck_cards = shuffle_array(deck_cards);

// console.log(deck_cards);
