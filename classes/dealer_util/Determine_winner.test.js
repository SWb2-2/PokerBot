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

function find_all_hands(hand_info){
	determine_winner.find_high_card(hand_info);
	determine_winner.find_pair(hand_info);
	determine_winner.find_two_pairs(hand_info);
	determine_winner.find_three_of_a_kind(hand_info);
	determine_winner.find_straight(hand_info);
	determine_winner.find_flush(hand_info);
	determine_winner.find_full_house(hand_info);
	determine_winner.find_four_of_a_kind(hand_info);
	determine_winner.find_straight_flush(hand_info);
}

////////////////////////////////////////////////////////////////////////////////////////

//sort_hand
test("should sort cards from largest to smallest", () =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
						new Card(14,2), new Card(10,0)];
	determine_winner.sort_hand(hand_info);
	expect(hand_info.hand).toStrictEqual([new Card(14,0),  new Card(14,2), new Card(10,0), new Card(6,2),
											 new Card(5,2), new Card(2,2),new Card(2,3)])
});
test("should sort cards from largest to smallest", () =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(2,2),new Card(3,2),new Card(4,2),new Card(5,0),new Card(6,3),
						new Card(7,2), new Card(8,0)];
	determine_winner.sort_hand(hand_info);
	expect(hand_info.hand).toStrictEqual([new Card(8,0),  new Card(7,2), new Card(6,3), new Card(5,0),
											 new Card(4,2), new Card(3,2),new Card(2,2)])
});

//Count_all_ranks
test("Should add tally of each rank to array in hand_info." +
	 "Non present ranks should be 0", () =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(10,0)];
	determine_winner.count_all_ranks(hand_info);
	expect(hand_info.count_rank).toStrictEqual([/*empty*/,/*empty*/,2,0,0,1,1,0,0,0,1,0,0,0,2]);
});

test("Should add tally of each rank to array in hand_info." +
	 "Non present ranks should be 0", () =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(14,2),new Card(14,1),new Card(14,3),new Card(14,0),new Card(2,3),
					   new Card(10,2), new Card(10,0)];
	determine_winner.count_all_ranks(hand_info);
	expect(hand_info.count_rank).toStrictEqual([/*empty*/,/*empty*/,1,0,0,0,0,0,0,0,2,0,0,0,4]);
});

//Count_suits
test("Should add tally of each suit to array in hand_info", () =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(10,0)];
	determine_winner.count_suits(hand_info);
	expect(hand_info.count_suit).toStrictEqual([2,0,4,1]);
});

test("Should add tally of each suit to array in hand_info", () =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};	
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(11,2),new Card(14,2),new Card(2,2),
					   new Card(14,2), new Card(10,2)];
	determine_winner.count_suits(hand_info);
	expect(hand_info.count_suit).toStrictEqual([0,0,7,0]);
});


//Test hand_info.best_hands.length
test("After checking all hands, the only attainable hand is highest card."+
	 "best_hands is length 1, and only contains high card array", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(3,2),new Card(11,0),new Card(2,3),
					   new Card(13,2), new Card(10,0)];

	determine_winner.sort_hand(hand_info);
	determine_winner.count_all_ranks(hand_info);
	determine_winner.count_suits(hand_info);

	find_all_hands(hand_info);
	
	expect(hand_info.best_hands).toStrictEqual([[13,11,10,6,5]]);
	expect(hand_info.best_hands.length - 1).toEqual(high_card);
});
test("After checking all hands, the only attainable hand is highest card."+
	 "best_hands is length 1, and only contains high card array", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(2,2),new Card(3,2),new Card(4,2),new Card(5,0),new Card(6,3),
					   new Card(7,2), new Card(8,0)];

	determine_winner.sort_hand(hand_info);
	determine_winner.count_all_ranks(hand_info);
	determine_winner.count_suits(hand_info);

	find_all_hands(hand_info);
	
	expect(hand_info.best_hands).toStrictEqual([[8,7,6,5,4],/*empty pair*/,/*empty two pair*/,/*empty three*/
												,[8,7,6,5,4]]);
	expect(hand_info.best_hands.length - 1).toEqual(straight);
});

//Find_high_card
test("Insert array of 5 highest ranked cards into hand_info, given hand is sorted", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
		new Card(14,2), new Card(10,0)];
	determine_winner.sort_hand(hand_info);
	determine_winner.find_high_card(hand_info);
	expect(hand_info.best_hands[high_card]).toStrictEqual([14,14,10,6,5]);
});

//Find_pair
test("Should insert pair array into best_hands", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(11,1)];
	determine_winner.sort_hand(hand_info);
	determine_winner.find_pair(hand_info);
	expect(hand_info.best_hands[pair]).toStrictEqual([14,14,11,6,5])
});

//Find_two_pairs
test("Insert array of best two pairs and single highest card into hand_info at index two pairs",() =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(10,0)];
	determine_winner.sort_hand(hand_info);
	determine_winner.count_all_ranks(hand_info);
	determine_winner.find_two_pairs(hand_info);
	expect(hand_info.best_hands[two_pairs]).toStrictEqual([14,14,2,2,10]);
});
test("Insert array of best two pairs and single highest card into hand_info at index two pairs",() =>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(7,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
					   new Card(14,2), new Card(6,0)];
	determine_winner.sort_hand(hand_info);
	determine_winner.count_all_ranks(hand_info);
	determine_winner.find_two_pairs(hand_info);
	expect(hand_info.best_hands[two_pairs]).toStrictEqual([14,14,6,6,7]);
});


//find_similar
test("Should return the highest rank of a card that there is 2 of", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
		new Card(14,2), new Card(10,0)]
	determine_winner.sort_hand(hand_info);
	expect(determine_winner.find_similar(2,hand_info)).toBe(14);
	expect(determine_winner.find_similar(3,hand_info)).toBe(false);
	expect(determine_winner.find_similar(4,hand_info)).toBe(false);
});

//find_similar
test("Should return the highest rank of a card that there is 3 of", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,2),new Card(2,0),new Card(2,2),new Card(14,0),new Card(2,3),
		new Card(14,2), new Card(10,0)]
	determine_winner.sort_hand(hand_info);
	expect(determine_winner.find_similar(2,hand_info)).toBe(14);
	expect(determine_winner.find_similar(3,hand_info)).toBe(2);
	expect(determine_winner.find_similar(4,hand_info)).toBe(false);
});

//find_similar
test("Should return the highest rank of a card that there is 4 of", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(2,1),new Card(2,0),new Card(2,2),new Card(14,0),new Card(2,3),
		new Card(14,2), new Card(14,1)]
	determine_winner.sort_hand(hand_info);
	expect(determine_winner.find_similar(2,hand_info)).toBe(14);
	expect(determine_winner.find_similar(3,hand_info)).toBe(14);
	expect(determine_winner.find_similar(4,hand_info)).toBe(2);
});

//find_2,3,4_of_a_kind
test("Should insert array of highest rank of a card that there is 2 of", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,1),new Card(4,0),new Card(3,2),new Card(11,0),new Card(2,3),
					  new Card(14,2), new Card(14,1)]
	determine_winner.sort_hand(hand_info);
	determine_winner.find_2_3_4_of_a_kind(2,hand_info,pair);
	determine_winner.find_2_3_4_of_a_kind(3,hand_info,three_of_kind);
	determine_winner.find_2_3_4_of_a_kind(4,hand_info,four_of_kind);
	expect(hand_info.best_hands[pair]).toStrictEqual([14,14,11,5,4]);
	expect(hand_info.best_hands[three_of_kind]).toStrictEqual(undefined); //trying to index outside of largest index
	expect(hand_info.best_hands[four_of_kind]).toStrictEqual(undefined);
});

test("Should insert array of highest rank of a card that there is 2 of", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,1),new Card(2,0),new Card(2,2),new Card(2,0),new Card(2,3),
					  new Card(14,2), new Card(14,1)]
	determine_winner.sort_hand(hand_info);
	determine_winner.find_2_3_4_of_a_kind(2,hand_info,pair);
	determine_winner.find_2_3_4_of_a_kind(3,hand_info,three_of_kind);
	determine_winner.find_2_3_4_of_a_kind(4,hand_info,four_of_kind);
	expect(hand_info.best_hands[pair]).toStrictEqual([14,14,5,2,2]);
	expect(hand_info.best_hands[three_of_kind]).toStrictEqual([2,2,2,14,14]); //trying to index outside of largest index
	expect(hand_info.best_hands[four_of_kind]).toStrictEqual([2,2,2,2,14]);
});

test("Should insert array of highest rank of a card that there is 2 of", ()=>{
	let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
	hand_info.hand = [new Card(5,1),new Card(7,0),new Card(11,2),new Card(10,0),new Card(12,3),
					  new Card(14,2), new Card(13,1)]
	determine_winner.sort_hand(hand_info);
	determine_winner.find_2_3_4_of_a_kind(2,hand_info,pair);
	determine_winner.find_2_3_4_of_a_kind(3,hand_info,three_of_kind);
	determine_winner.find_2_3_4_of_a_kind(4,hand_info,four_of_kind);
	expect(hand_info.best_hands[pair]).toStrictEqual(undefined);
	expect(hand_info.best_hands[three_of_kind]).toStrictEqual(undefined); //trying to index outside of largest index
	expect(hand_info.best_hands[four_of_kind]).toStrictEqual(undefined);
});

