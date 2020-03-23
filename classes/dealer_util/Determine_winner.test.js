const determine_winner = require("./Determine_winner2.js");
const Dealer = require("../class_dealer.js");
const Player = require("../class_player.js");
const Card = require("../class_card.js");


//////////////////////////////////////TEST ENVIRONMENT/////////////////////////////////////
const high_card = 0,
pair = 1,
two_pairs = 2,
three_of_kind = 3,
straight = 4,
flush = 5,
full_house = 6,
four_of_kind = 7,
straight_flush = 8;

let dealer = new Dealer;
let player1 = new Player(100);
let player2 = new Player(100);

let hand_info1 = {hand: [], count_rank: [], count_suit: [], best_hands: []};
////////////////////////////////////////////////////////////////////////////////////////

test("should sort cards from largest to smallest", () =>{
	hand_info1.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
						new Card(14,2), new Card(10,0)];
	determine_winner.sort_hand(hand_info1);
	expect(hand_info1.hand).toStrictEqual([new Card(14,0),  new Card(14,2), new Card(10,0), new Card(6,2),
								  		   new Card(5,2), new Card(2,2),new Card(2,3)])
});

test("Should add tally of each rank to array in hand_info." +
	 "Non present ranks should be 0", () =>{
	hand_info1.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(10,0)];
	determine_winner.count_all_ranks(hand_info1);
	expect(hand_info1.count_rank).toStrictEqual([/*empty*/,/*empty*/,2,0,0,1,1,0,0,0,1,0,0,0,2]);
});

test("Should add tally of each suit to array in hand_info", () =>{
	hand_info1.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(10,0)];
	determine_winner.count_suits(hand_info1);
	expect(hand_info1.count_suit).toStrictEqual([2,0,4,1]);
});

test("After checking all hands, the only attainable hand is highest card."+
	 "best_hands is length 1, and only contains high card array", ()=>{
	hand_info1.hand = [new Card(5,2),new Card(6,2),new Card(3,2),new Card(11,0),new Card(2,3),
					   new Card(13,2), new Card(10,0)];

	determine_winner.sort_hand(hand_info1);
	determine_winner.count_all_ranks(hand_info1);
	determine_winner.count_suits(hand_info1);
	
	//kunne gøres til en function, for at gøre det mere læsbart. "find_all_hands"
	determine_winner.find_high_card(hand_info1);
	determine_winner.find_pair(hand_info1);
	determine_winner.find_two_pairs(hand_info1);
	determine_winner.find_three_of_a_kind(hand_info1);
	determine_winner.find_straight(hand_info1);
	determine_winner.find_flush(hand_info1);
	determine_winner.find_full_house(hand_info1);
	determine_winner.find_four_of_a_kind(hand_info1);
	determine_winner.find_straight_flush(hand_info1);
	
	expect(hand_info1.best_hands).toStrictEqual([[13,11,10,6,5]]);
	expect(hand_info1.best_hands.length - 1).toEqual(high_card);
});

test("Insert array of 5 highest ranked cards into hand_info, given hand is sorted", ()=>{
	hand_info1.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
		new Card(14,2), new Card(10,0)];
	determine_winner.sort_hand(hand_info1);
	determine_winner.find_high_card(hand_info1);
	expect(hand_info1.best_hands[high_card]).toStrictEqual([14,14,10,6,5]);
});

test("Insert array of best two pairs and single highest card into hand_info at index two pairs",() =>{
	hand_info1.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(10,0)];
	determine_winner.sort_hand(hand_info1);
	determine_winner.find_two_pairs(hand_info1);
	expect(hand_info1.best_hands[two_pairs]).toStrictEqual([14,14,2,2,10]);
});


