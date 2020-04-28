const determine_winner = require("../modules/determine_winner.js");
const Card = require("./card.js");
module.exports = class Dealer {
    constructor(){
        this.deck_cards = [];
        this.table_cards = [];
        this.pot = 0;
        this.bb = {bb_size: 0, set_flag: false}; 
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

        player1.hand = [];
        player2.hand = [];
        
        player1.player_move.move = "";
        player2.player_move.move = "";
        
    }

    give_pot(player1, player2, winner) {
        if (winner === "draw") {
            player1.balance += player1.current_bet;
            player2.balance += player2.current_bet;
        } else{
            if (player1.current_bet === player2.current_bet) {
                winner === player1.name ? player1.balance += (player1.current_bet+player2.current_bet) : player2.balance += (player1.current_bet+player2.current_bet);
            } else if (player1.current_bet > player2.current_bet) {
                winner === player1.name ? player1.balance += (player2.current_bet*2) : player2.balance += (player2.current_bet*2);
                player1.balance += (player1.current_bet-player2.current_bet);
            } else {
                winner === player1.name ? player1.balance += (player1.current_bet*2) : player2.balance += (player1.current_bet*2);
                player2.balance += (player2.current_bet-player1.current_bet);                
            }
        }
    }

    decide_whose_turn(active_player, inactive_player, dealer) {
        let turn ="";
        if (active_player.player_move.move === "fold") {
            turn = "showdown";
        } else if (active_player.player_move.move == "raise" && inactive_player.balance !== 0) {
            turn = inactive_player.name;
        } else if (active_player.balance === 0  || inactive_player.balance === 0) {
            if (dealer.table_cards.length === 5) {
                turn = "showdown";
            } else {
                turn = "table";
            }
        } else if (active_player.player_move.move !== "" && inactive_player.player_move.move === "") {
            turn = inactive_player.name;
        } else if (active_player.player_move.move === "" && inactive_player.player_move.move === "") {
            turn = active_player.name;
        } else {
            if (dealer.table_cards.length === 5) {
                turn = "showdown";
            } else {
                turn = "table";
            }
        }
        return turn;
    }

    make_blind(player1, player2) {
        if (player1.blind === "bb"){
            player1.blind = "sb";
            player2.blind = "bb";
        } else if (player1.blind === "sb"){
            player1.blind = "bb";
            player2.blind = "sb";
        } else{
            player1.blind = "bb";
            player2.blind = "sb";
        }
    }
    
    pay_blinds(player1, player2, bb, sb) {
        if  (player1.blind === "bb"){
            player1.current_bet += bb;
            player2.current_bet += sb;
            player1.balance -= bb;
            player2.balance -= sb;
            this.pot = bb + sb;
        } else {
            player1.current_bet += sb;
            player2.current_bet += bb;
            player1.balance -= sb;
            player2.balance -= bb;
            this.pot = bb + sb;
        }
    }
    
    create_blind_amount(balance) {
        this.bb.bb_size = Math.ceil((balance / 50) - 0.001);
        this.bb.set_flag = true; 
    }
    
    get_winner(player1, player2){
        return determine_winner.determine_winner.bind(this)(player1, player2);
    }

}

