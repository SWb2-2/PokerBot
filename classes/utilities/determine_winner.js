const ace = 14,
	  hand_size = 7;

const high_card = 0,
	  pair = 1,
	  two_pairs = 2,
	  three_of_kind = 3,
	  straight = 4,
	  flush = 5,
	  full_house = 6,
	  four_of_kind = 7,
	  straight_flush = 8;

function determine_winner(player1, player2){

    // Initialization of hand_info objects: contains player's 7 available cards (table + hand), number of 
    //      of each rank in the hand, number of each suit, and array of best hands for each possible hand 
    //      (from highest card to straight flush). If no hand is found, the array is empty at that index
    let hand_info1 = {hand: [], count_rank: [], count_suit: [], best_hands: []};
    let hand_info2 = {hand: [], count_rank: [], count_suit: [], best_hands: []};

    // Combining players' hand with table cards
    for(let i = 0; i < 5; i++) {
        hand_info1.hand[i] = this.table_cards[i];
        hand_info2.hand[i] = this.table_cards[i];
    }
    hand_info1.hand.push(player1.hand[0], player1.hand[1]);
    hand_info2.hand.push(player2.hand[0], player2.hand[1]);

    //sorting hands from highest to lowest rank
    sort_hand(hand_info1);
    sort_hand(hand_info2);

    //counting number of each rank and suit in hand
    count_suits(hand_info1);
    count_suits(hand_info2);

    count_all_ranks(hand_info1);
    count_all_ranks(hand_info2);

    //array of each test function for each possible hand. Functions return the 5 best cards for each given hand
    let a_function = [];
    a_function[high_card] = find_high_card;  
    a_function[pair] = find_pair;
    a_function[two_pairs] = find_two_pairs;
    a_function[three_of_kind] = find_three_of_a_kind;
    a_function[straight] = find_straight;
    a_function[flush] = find_flush;
    a_function[full_house] = find_full_house;
    a_function[four_of_kind] = find_four_of_a_kind;
    a_function[straight_flush] = find_straight_flush;

    //finding 5 best cards for each possible hand
    for(let i = high_card; i < straight_flush; i++) {
        a_function[i](hand_info1);
        a_function[i](hand_info2);
    }

    console.log("player1 \n", hand_info1);
    console.log("player2 \n", hand_info2);
 

    //comparison of hands. Returns the winning player, otherwise returns false if it's a complete draw 
    //      (i.e. same hands for all possible hands)
    // length of best_hands array signifies the given hand, i.e. 0 = highcard, 8 = straight flush
    // if hands are similar, the highest cards are chacked 
    if(hand_info1.best_hands.length > hand_info2.best_hands.length) {
        return player1;
    } else if (hand_info1.best_hands.length < hand_info2.best_hands.length) {
        return player2;
    } else {   //if the best hands are equal, checks the highest cards
        for(let i = 0; i < 5; i++) {
            let strongest = hand_info1.best_hands.length - 1;
            if(hand_info1.best_hands[strongest][i] > hand_info2.best_hands[strongest][i]) {
                return player1;
            } else if (hand_info1.best_hands[strongest][i] < hand_info2.best_hands[strongest][i]) {
                return player2;
            }
        }
        return false;
    }
}


//Sorts player's hand using insertion sort
function sort_hand(hand_info) {

for(let i = 1; i < hand_size; i++) {

	let key = hand_info.hand[i];
	let j = i - 1;
	while(j >= 0 && hand_info.hand[j].rank < key.rank) {

		hand_info.hand[j+1] = hand_info.hand[j];
		j--;
	}
	hand_info.hand[j+1] = key;
}
return;
}

//Output: Counts the number of each rank in the hand, and stores it as an array in hand_info. 
    //The index in the array corresponds to the rank. 
function count_all_ranks(hand_info) {

	for(let i = 2; i <= ace; i++) {
		hand_info.count_rank[i] = 0; //initialization

		for(let j = 0; j < hand_size; j++) {
			if(hand_info.hand[j].rank == i) {
				hand_info.count_rank[i] += 1;
			}
		}
	}
	return;
}

 //Count the amount of each suit in the hand, and stores it as an array in hand_info. 
function count_suits(hand_info) {
let hand_size = hand_info.hand.length;

for(let i = 0; i <= 3; i++) { 
	hand_info.count_suit[i] = 0; //initialization

	for(let j = 0; j < hand_size; j++) {
		if(hand_info.hand[j].suit == i) {
			hand_info.count_suit[i] += 1; 
		}  
	}
}
return;
}

//Adds the 5 highest cards to best_hands at index high_card
function find_high_card(hand_info) {
	let best_highcards = [];

	for(let i = 0; i < 5; i++) {
		best_highcards.push(hand_info.hand[i].rank); 
	}
	hand_info.best_hands[high_card] = best_highcards;
	return;
}

//Uses the helperfunction find_2_3_4_of_a_kind to find a pair
//Output: highest pair, along with otherwise highest cards, are stored in best_hands at index pair
function find_pair(hand_info) {
	find_2_3_4_of_a_kind(2, hand_info, pair);
}

//Searches for 1 pair and adds it to the best_pairs array. 
//Searches for a second pair, and adds it to the best_pairs
//Given two pairs are found, adds a highcard to the best_pairs.
//Output: stores best_pairs array in best_hands under index two_pairs
function find_two_pairs(hand_info) {           
	let pair1 = false,
		pair2 = false;
	let best_pairs = []; 

	let i = ace;
	while(i >= 2 && pair1 == false) {
		if(hand_info.count_rank[i] >= 2) {
			pair1 = i;
			best_pairs.push(pair1, pair1);
		}
		i--;
	}

	while(i >= 2 && pair2 == false) {
		if(hand_info.count_rank[i] >= 2) {
			pair2 = i;
			best_pairs.push(pair2, pair2);
		}
		i--;
	} 

	if(pair1 && pair2){
		for(let i = 0; i < hand_size; i++) {
			if(hand_info.hand[i].rank != pair1 && hand_info.hand[i].rank != pair2 ) {
				best_pairs.push(hand_info.hand[i].rank);
				hand_info.best_hands[two_pairs] = best_pairs;
				break;
			}
		}
	}
	return;
}

//Uses the helper function find_2_3_4_of_a_kind to find a three of a kind
    //Output: highest 3oak, along with otherwise highest cards, are stored in best_hands at index three_of_kind
function find_three_of_a_kind(hand_info) {
	find_2_3_4_of_a_kind(3, hand_info, three_of_kind);
}

//Starts from the first card in the hand and tests if the next card is one less than the current. 
//If it is, add it to the current_straight, and tests for the next card. 
//If 5 cards are added to current_straight, it is stored in the best_hands. 
//Else if the next card is not one lower, the current_straight is reset. 
function find_straight(hand_info) {
	let current_straight = [];

	//Ace can be used in a straight as 14 or 1. 
	if(hand_info.hand[0] == ace) {
		hand_info.hand.push(1);   
	}

	for(let i = 0; i < hand_info.hand.length - 1; i++) {
		if(hand_info.hand[i].rank == hand_info.hand[i+1].rank + 1) {
			current_straight.push(hand_info.hand[i].rank);       //only current card to avoid adding next card twice in next iteration

			if(current_straight.length == 4) {
				current_straight.push(hand_info.hand[i+1].rank); //as its known its part of current straight
				hand_info.best_hands[straight] = current_straight;
				if(hand_info.hand.length > 7) {                  //removes the excess ace that was added in beginning
					hand_info.hand.pop();
				}
				break; 
			}
		} else if(hand_info.hand[i].rank == hand_info.hand[i+1].rank) {
			//if the next card is the same as the current, do nothing, because a straight might be coming after
		} else {
			current_straight = [];
		}
	}
	return;
}

//Goes through each of the 4 counted suits, and tests if the hand contains 5 cards of the given suit. 
	//If it does, run through the hand, and add the 5 highest of that suit to best_flush and store it in best_hands.
function find_flush(hand_info) {
	let best_flush = [];

	for(let i = 0; i < 4; i++) {
		if(hand_info.count_suit[i] >= 5) {

			for(let j = 0; j < hand_size; j++) {
				if(hand_info.hand[j].suit == i) {
					best_flush.push(hand_info.hand[j].rank);
				}
			}
			hand_info.best_hands[flush] = best_flush;
		}
	}
}

//Find the highest 3 of a kind, and add it to the best_full_house array. 
//Then look for a pair, starting from the beginning, and add it, given the pair is different from the threes 
//If a full house is found, add best_full_house to the best_hands at index full_house. 
function find_full_house(hand_info) {
	let threes = false, 
		pair = false;
	let best_full_house = [];
	let done = false;

	let i = 14;
	while(i >= 2 && threes == false) {
		if(hand_info.count_rank[i] >= 3) {
			threes = i;
			best_full_house.push(threes, threes, threes);
		}
		i--;
	}
	i = 14;
	while(i >= 2 && done == false) {

		if(hand_info.count_rank[i] >= 2) {
			pair = i;
			if(threes != pair) {
				best_full_house.push(pair, pair);
				done = true;
			}
		}
		i--;
	} 
	if(best_full_house.length == 5) {
		hand_info.best_hands[full_house] = best_full_house;
	}
}

//Uses the helper function find_2_3_4_of_a_kind to find a four of a kind
//Output highest 4oak, along with otherwise highest cards, are stored in best_hands at index four_of_kind
function find_four_of_a_kind(hand_info) {
	find_2_3_4_of_a_kind(4, hand_info, four_of_kind);
}

//Tests if a straight and a flush has been found, and if not return. 
//Searches through hand and checks if thenext card's rank is one lower than the current card and the suits are similar 
//If yes, adds both cards to best_straight_flush array
// if 5 cards are found, best_straight_flush is added to best_hands
function find_straight_flush(hand_info) {
	if(hand_info.best_hands[flush] == undefined && hand_info.best_hands[straight] == undefined) {
		return;
	}

	let best_straight_flush = [];

	if(hand_info.hand[0] == 14) {
		hand_info.hand.push(1);   
	}

	for(let i = 0; i < hand_info.hand.length - 1; i++) {
		if(hand_info.hand[i].rank == hand_info.hand[i+1].rank + 1  &&
		hand_info.hand[i].suit == hand_info.hand[i+1].suit) {

			best_straight_flush.push(hand_info.hand[i].rank);

			if(best_straight_flush.length == 4) { // When 4 cards have been added, we have tested 5 cards
													// So we push the last card in, adds it and return/
				best_straight_flush.push(hand_info.hand[i+1].rank);
				hand_info.best_hands[straight_flush] = best_straight_flush;
				if(hand_info.hand.length > 7) {
					hand_info.hand.pop();
				}
				return; 
			}
		} else if(hand_info.hand[i].rank == hand_info.hand[i+1].rank) {
			// If the next card is similar rank, do nothing, since a straight flush might still occur. 
		} else {
			best_straight_flush = [];
		}
	}
	return;
}

//Helper function that takes an amount, and returns the rank with that amount in player's hand. If none is found, returns false
//method: If the ranks of current card and next card in the hand are equal, the streak increments
//        If the streak equals the desired amount, returns the rank of the card 
function find_similar(amount, hand_info) {
	let streak = 1; 

	for(let i = 0; i < hand_size - 1; i++) { //6 to avoid subscripting beyond the last index of the array 
		if(hand_info.hand[i].rank == hand_info.hand[i+1].rank) {
			streak++;
			if(streak == amount) {
				return hand_info.hand[i].rank;
			}
		} else {
			streak = 1;
		}
	}
	return false;
}

//Helper function for pair, three of a kind and four of a kind
//input: the number of cards to be found, hand_info object, and the corresponding index of the kind in best_hands
//method: adds the given amount of cards (2, 3, or 4) to the best_kind array
//        fills the rest best_kind array with the highest cards that are not part of the kind
//output: best_kind array is added to best_hand array at the given index of the kind 
function find_2_3_4_of_a_kind(amount, hand_info, index) {
	let best_kind = [];
	let rank_of_kind = find_similar(amount, hand_info);

	if(rank_of_kind){
		for(let i = 0; i < amount; i++) {
			best_kind.push(rank_of_kind);
		}
		for(let i = 0; i < hand_info.hand.length; i++) {
			if(hand_info.hand[i].rank != rank_of_kind) {
				best_kind.push(hand_info.hand[i].rank);
				if(best_kind.length == 5) {
					hand_info.best_hands[index] = best_kind;
					break;
				}
			}
		}
	}
}

module.exports.determine_winner = determine_winner;
module.exports.sort_hand = sort_hand;
module.exports.count_all_ranks = count_all_ranks;
module.exports.count_suits = count_suits;
module.exports.find_high_card = find_high_card;
module.exports.find_pair = find_pair;
module.exports.find_two_pairs = find_two_pairs;
module.exports.find_three_of_a_kind = find_three_of_a_kind;
module.exports.find_straight = find_straight;
module.exports.find_flush = find_flush;
module.exports.find_full_house = find_full_house;
module.exports.find_four_of_a_kind = find_four_of_a_kind;
module.exports.find_straight_flush = find_straight_flush;
module.exports.find_similar = find_similar;
module.exports.find_2_3_4_of_a_kind = find_2_3_4_of_a_kind;