const determine_winner = require("./Determine_winner2");
const Dealer = require("../class_dealer.js");
const Player = require("../class_player.js");

let dealer = new Dealer;

let player1 = new Player(100);
let player2 = new Player(100);

dealer.create_deck_of_cards();
dealer.shuffle_array();
dealer.give_player_cards(player1, player2);
dealer.add_table_cards(5);

let hand_info1 = {hand: [], count_rank: [], count_suit: [], best_hands: []};
let hand_info2 = {hand: [], count_rank: [], count_suit: [], best_hands: []};


for(let i = 0; i < 5; i++) {
	hand_info1.hand[i] = dealer.table_cards[i];
	hand_info2.hand[i] = dealer.table_cards[i];
}
hand_info1.hand.push(player1.hand[0], player1.hand[1]);
hand_info2.hand.push(player2.hand[0], player2.hand[1]);

test("should work", () => {
	const result = determine_winner.plus(2,2);
	expect(result).toBe(5);
});