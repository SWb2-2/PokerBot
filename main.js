const Dealer = require("./classes/class_dealer.js");
const Player = require("./classes/class_player.js");

let dealer = new Dealer;

let player1 = new Player(100);
let player2 = new Player(100);

dealer.create_deck_of_cards();
dealer.shuffle_array();
dealer.give_player_cards(player1, player2);
dealer.add_table_cards(5);

console.log("And the winner is", dealer.get_winner(player1, player2), "with the hand\n\n", 
dealer.get_winner(player1,player2).hand);