const Dealer = require("../../website/js/classes/dealer.js");
const Player = require("../../website/js/classes/player.js");
const Card = require("../../website/js/classes/card.js")



//Gives the calculated equity, of a given suited hand. 
/*const arr_suit =   [ undefined, 
                     undefined, 
                    [undefined, undefined, undefined, 38.28, 39.06, 40.00, 39.72, 40.07, 42.07, 44.48, 47.11, 49.77, 52.74, 55.76, 59.84],
                    [undefined, undefined, 38.28, undefined, 40.75, 41.79, 41.47, 41.94, 42.68, 45.29, 47.91, 50.58, 53.46, 56.55, 60.58],
                    [undefined, undefined, 39.06, 40.75, undefined, 43.45, 43.12, 43.64, 44.28, 45.80, 48.71, 51.33, 53.28, 57.29, 61.42],
                    [undefined, undefined, 40.00, 41.79, 43.45, undefined, 44.83, 45.37, 46.12, 47.49, 49.31, 52.10, 54.98, 58.15, 62.13],
                    [undefined, undefined, 39.72, 41.47, 43.23, 44.83, undefined, 46.73, 47.68, 49.04, 50.74, 52.64, 55.73, 58.79, 62.02],
                    [undefined, undefined, 40.07, 41.94, 43.64, 45.47, 46.73, undefined, 49.13, 50.55, 52.23, 54.06, 56.17, 59.59, 62.88],
                    [undefined, undefined, 42.07, 42.68, 44.28, 46.12, 47.68, 49.12, undefined, 51.96, 53.85, 55.67, 57.75, 60.16, 63.69],
                    [undefined, undefined, 44.48, 45.29, 45.80, 47.49, 49.04, 50.55, 51.96, undefined, 55.59, 57.42, 59.47, 61.89, 64.62],
                    [undefined, undefined, 47.11, 47.91, 48.71, 49.31, 50.74, 52.23, 53.85, 55.59, undefined, 59.38, 61.45, 63.69, 66.51],
                    [undefined, undefined, 49.77, 50.58, 51.33, 52.10, 52.64, 54.06, 55.67, 57.42, 59.38, undefined, 62.30, 64.61, 67.34],
                    [undefined, undefined, 52.74, 53.46, 53.28, 54.98, 55.73, 56.27, 57.75, 59.47, 61.45, 62.30, undefined, 65.52, 68.16],
                    [undefined, undefined, 55.75, 56.55, 57.29, 58.15, 58.79, 59.59, 60.16, 61.89, 63.69, 64.61, 65.52, undefined, 69.24],
                    [undefined, undefined, 59.84, 60.58, 61.42, 62.13, 62.02, 62.88, 63.69, 64.62, 66.51, 67.34, 68.16, 69.24, undefined]
                    ]

//Gives the calculated equity, of a given off suit hand. 
const arr_o_suit = [ undefined, 
                     undefined, 
                    [undefined, undefined, 50.89, 34.76, 35.60, 36.70, 36.30, 36.79, 38.91, 41.28, 44.07, 46.89, 49.95, 53.31, 57.55],
                    [undefined, undefined, 34.76, 54.08, 37.45, 38.52, 38.19, 38.68, 39.49, 42.32, 44.96, 47.74, 50.73, 54.07, 58.41],
                    [undefined, undefined, 35.60, 37.45, 57.23, 40.38, 40.01, 40.61, 41.33, 42.87, 45.76, 48.53, 51.65, 54.97, 59.16],
                    [undefined, undefined, 36.70, 38.52, 40.38, 60.40, 41.81, 42.39, 43.07, 44.70, 46.51, 49.60, 52.50, 55.88, 60.13],
                    [undefined, undefined, 36.30, 38.19, 40.01, 41.81, 63.13, 44.00, 44.81, 46.21, 48.06, 50.08, 53.26, 56.58, 59.80],
                    [undefined, undefined, 36.79, 38.68, 40.61, 42.39, 44.00, 66.21, 46.48, 47.83, 49.57, 51.61, 53.84, 57.35, 60.92],
                    [undefined, undefined, 38.91, 39.49, 41.33, 43.07, 44.81, 46.48, 68.93, 49.44, 51.33, 53.25, 55.45, 57.91, 61.71],
                    [undefined, undefined, 41.28, 42.32, 42.87, 44.70, 46.21, 47.83, 49.44, 71.95, 53.17, 55.15, 57.23, 59.74, 62.60],
                    [undefined, undefined, 44.07, 44.96, 45.76, 46.51, 48.06, 49.57, 51.33, 53.17, 75.68, 57.17, 59.29, 61.87, 64.72],
                    [undefined, undefined, 46.89, 47.74, 48.53, 49.60, 50.08, 51.61, 53.25, 55.15, 57.17, 77.68, 60.25, 62.67, 65.55],
                    [undefined, undefined, 49.95, 50.73, 51.65, 52.50, 53.26, 52.84, 55.45, 57.23, 59.29, 60.25, 80.32, 63.64, 66.54],
                    [undefined, undefined, 53.31, 54.07, 54.97, 55.88, 56.58, 57.35, 57.91, 59.74, 61.87, 62.67, 63.64, 82.82, 67.55],
                    [undefined, undefined, 57.55, 58.41, 59.16, 60.13, 59.80, 60.92, 61.71, 62.60, 64.72, 65.55, 66.54, 67.55, 85.84]
                    ]
*/
const arr_suit = /*00*/  [ undefined, 
                 /*01*/    undefined, 
                 /*02*/   [undefined, undefined, undefined, 35.23, 35.98, 36.97, 36.74, 37.33, 39.45, 41.98, 44.70, 47.55, 50.61, 53.79, 57.85],
                 /*03*/   [undefined, undefined, 35.23, undefined, 37.75, 38.73, 38.50, 39.08, 40.06, 42.76, 45.52, 48.31, 51.39, 54.61, 58.55],
                 /*04*/   [undefined, undefined, 35.98, 37.75, undefined, 40.37, 40.18, 40.87, 41.76, 43.28, 46.28, 49.17, 52.15, 55.33, 59.30],
                 /*05*/   [undefined, undefined, 36.97, 38.73, 40.37, undefined, 41.94, 42.55, 43.53, 45.05, 46.93, 50.01, 52.99, 56.21, 60.26],
                 /*06*/   [undefined, undefined, 36.74, 38.50, 40.18, 41.94, undefined, 44.18, 45.18, 46.58, 48.62, 50.58, 53.73, 56.91, 60.20],
                 /*07*/   [undefined, undefined, 37.33, 39.08, 40.87, 42.55, 44.18, undefined, 46.89, 48.35, 50.26, 52.22, 54.43, 57.85, 61.23],
                 /*08*/   [undefined, undefined, 39.45, 40.06, 41.76, 43.53, 45.18, 46.89, undefined, 50.06, 51.85, 53.90, 56.20, 58.59, 62.18],
                 /*09*/   [undefined, undefined, 41.98, 42.76, 43.28, 45.05, 46.58, 48.35, 50.06, undefined, 53.87, 55.78, 58.04, 60.47, 63.29],
                 /*10*/   [undefined, undefined, 44.70, 45.52, 46.28, 46.93, 48.62, 50.26, 51.95, 53.87, undefined, 57.94, 60.10, 62.63, 65.34],
                 /*11*/   [undefined, undefined, 47.55, 48.31, 49.17, 50.01, 50.58, 52.22, 53.90, 55.78, 57.94, undefined, 61.06, 63.47, 66.32],
                 /*12*/   [undefined, undefined, 50.61, 51.39, 52.15, 52.99, 53.73, 54.43, 56.20, 58.04, 60.10, 61.06, undefined, 64.48, 67.30],
                 /*13*/   [undefined, undefined, 53.79, 54.61, 55.33, 56.21, 56.91, 57.85, 58.59, 60.47, 62.63, 63.47, 64.48, undefined, 68.40],
                 /*14*/   [undefined, undefined, 57.85, 58.55, 59.30, 60.26, 60.20, 61.23, 62.18, 63.29, 65.34, 66.32, 67.30, 68.40, undefined]
                    ]

//Gives the calculated equity, of a given off suit hand. 
const arr_o_suit = /*00*/[ undefined, 
                   /*01*/  undefined,			 
                   /*02*/ [undefined, undefined, 50.00, 31.61, 32.41, 33.50, 33.17, 33.79, 36.11, 38.55, 41.69, 44.55, 47.80, 51.18, 55.41],
                   /*03*/ [undefined, undefined, 31.61, 32.41, 34.27, 35.36, 35.15, 35.73, 36.71, 39.56, 42.48, 45.42, 48.57, 52.03, 56.31],
                   /*04*/ [undefined, undefined, 32.41, 34.27, 56.50, 37.16, 36.94, 37.58, 38.54, 40.14, 43.38, 46.30, 49.44, 52.91, 57.11],
                   /*05*/ [undefined, undefined, 33.50, 35.46, 37.16, 59.69, 38.81, 39.40, 40.40, 42.03, 44.00, 47.22, 50.52, 53.72, 58.01],
                   /*06*/ [undefined, undefined, 33.17, 35.15, 36.94, 38.81, 62.57, 41.17, 42.15, 43.74, 45.73, 47.82, 51.25, 54.62, 58.01],
                   /*07*/ [undefined, undefined, 33.79, 35.73, 37.58, 39.40, 41.17, 65.50, 44.00, 45.54, 47.56, 49.57, 52.00, 55.54, 59.08],
                   /*08*/ [undefined, undefined, 36.11, 36.71, 38.54, 40.40, 42.15, 44.00, 68.43, 47.42, 49.38, 51.38, 53.67, 56.35, 60.12],
                   /*09*/ [undefined, undefined, 38.55, 39.56, 40.14, 42.03, 43.74, 45.54, 47.42, 71.55, 51.48, 53.41, 55.77, 58.39, 61.23],
                   /*10*/ [undefined, undefined, 41.69, 42.48, 43.38, 44.00, 45.73, 47.56, 49.38, 51.48, 74.79, 55.78, 58.00, 60.54, 63.53],
                   /*11*/ [undefined, undefined, 44.55, 45.42, 46.30, 47.22, 47.82, 49.57, 51.38, 53.41, 55.78, 77.42, 58.94, 61.51, 64.53],
                   /*12*/ [undefined, undefined, 47.80, 48.57, 49.44, 50.52, 51.25, 52.00, 53.67, 55.77, 58.00, 58.94, 80.01, 62.62, 65.54],
                   /*13*/ [undefined, undefined, 51.18, 52.03, 52.91, 53.72, 54.62, 55.54, 56.35, 58.39, 60.54, 61.51, 62.62, 82.63, 66.67],
                   /*14*/ [undefined, undefined, 55.41, 56.31, 57.11, 58.01, 58.01, 59.08, 60.12, 61.23, 63.53, 64.53, 65.54, 66.67, 85.54]
                    ]

// calculate_preflop();

// console.log(equity_range([new Card(4,2), new Card(2,2)], 100000,[], 30, 100));

//Sorts player's hand using insertion sort
//First sort the rank, and then the suit
function sort_hand_in_rank_and_suit(hand) {

	for(let i = 1; i < hand.length; i++) {

		let key = hand[i];
		let j = i - 1;
		while(j >= 0 && hand[j].rank > key.rank) {

			hand[j+1] = hand[j];
			j--;
		}
		hand[j+1] = key;
    }

    for(let i = 1; i < hand.length; i++) {

        let key = hand[i];
		let j = i - 1;
		while(j >= 0 && hand[j].suit > key.suit) {

			hand[j+1] = hand[j];
			j--;
		}
		hand[j+1] = key;
	}
}

//Create a deck of cards, without a number of cards. THe illegal cards, have to be in a sorted order. 
function create_specific_deck_of_cards(ill_cards) {
    const ace = 14;

    let deck = [];
    let i = 0; 

    for(let suit = 0; suit < 4; suit++) {
        
        for(let rank = 2; rank <= ace; rank++) {
            if(!(rank == ill_cards[i].rank && suit == ill_cards[i].suit)) {
                deck.push(new Card(rank, suit));
            } else {
                if(i < ill_cards.length - 1) {
                    i++;
                }
            }
        }
    }
    return deck;
}


//Find the equity of a given hand, based on the cards on the table, and the given range of the opponent. 
function equity_range(hand, numb_of_sim, table, range_low, range_high) {
    //makes sure the input is valid, and if not, make it valid. 
    if(table == undefined) {
        table = [];
    }
    if(range_high == undefined) {
        range_high = 100; 
    } else if(range_high < 36) {
        range_high = 39;
    }
    if(range_low == undefined) {
        range_low = 0; 
    } else if(range_low > 82) {
        range_low = 80;
    }
    if(range_low > range_high) {
        console.log("Error in func equity_range, invalid parameters")
        return Error; 
    }
    if(numb_of_sim == undefined) {
        numb_of_sim = 10000;
    }


    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;
    const player1_hand = hand;
    const table_cards = table;
    player1.balance = 1; 
    player2.balance = 2;
    player1.name = "player";
    player2.name = "ai";

    let win = 0; 
    let lose = 0; 
    let draw = 0; 

    let deck = [];

    //Find the cards, our new deck cannot contain, because they are already in play, and create the desired deck
    let ill_cards = [];       
    ill_cards.push(hand[0], hand[1]);
    for(let i = 0; i < table.length; i++) {
        ill_cards.push(table[i]);
    }
    sort_hand_in_rank_and_suit(ill_cards);
    deck = create_specific_deck_of_cards(ill_cards);


    //Test wether or not the given hand would win, a given number of times. 
    for(let i = 0; i < numb_of_sim; i++) {

        //reset the hands, and the player2 hand. 
        player1.hand = player1_hand;
        player2.hand = [];


        //Add the table_cards to the dealer again
        dealer.table_cards = [];
        for(let i = 0; i < table_cards.length; i++) {
            dealer.table_cards[i] = table_cards[i];
        }


        //Make sure the oppent get cards in the given range based on the preflop tables.  
        let flag = 1; 
        while(flag == 1) {
            //Give the dealer the correct deck
            dealer.deck_cards = [];
            for(let i = 0; i < deck.length; i++) {
                dealer.deck_cards[i] = deck[i];
            }

            dealer.shuffle_array();

            while(flag == 1 && dealer.deck_cards.length >= 7) {


                //Give the oppent two random cards, and add cards to the table, so there is 5 cards on the table. 
                player2.hand.push(dealer.deck_cards.pop(), dealer.deck_cards.pop());

                if(player2.hand[0].suit == player2.hand[1].suit) {  //The given playercards are suited. 

                    //Test if the cards range is correct, otherwise empty the hand, and shuffle the deck again. 
                    if(arr_suit [player2.hand[0].rank] [player2.hand[1].rank] > range_low  && arr_suit [player2.hand[0].rank] [player2.hand[1].rank] < range_high) {
                        flag = 0; 
                    } else {
                        player2.hand = []; 
                    }
                } else { //The given playercards are off suit. 

                    //Test if the cards range is correct, otherwise empty the hand, and shuffle the deck again. 
                    if(arr_o_suit [player2.hand[0].rank] [player2.hand[1].rank] > range_low && arr_o_suit [player2.hand[0].rank] [player2.hand[1].rank] < range_high ) {
                        flag = 0; 
                    } else {
                        player2.hand = []; 
                    }
                }
            }
        }

        //Fill the table with 5 cards. 
        while(dealer.table_cards.length < 5) {
            dealer.table_cards.push(dealer.deck_cards.pop());
        }


        //Determine the winner, and cataloge it. 
        let result = dealer.get_winner(player1, player2);


        if(result.winner == "player") {
            win++;
        } else if(result.winner == "ai") {
            lose++;
        } else if(result.winner == "draw") {
            draw++;
        }
    }

    //Calculate the winrates, and return. 
    let total = win + lose + draw;
    let winrate = (win / total) * 100;
    let draw_and_winrate = ((win + (draw*0.5)) / total) * 100;
    return {win: win, 
            lose: lose, 
            draw: draw, 
            winrate: winrate,
            draw_and_winrate: draw_and_winrate};
}


//Finds the winrate for all the possible hands in preflop, 
function calculate_preflop() {
	print_suit = [];
	print_pair = [];
	print_offsuit = [];
    let result_suit = [];
    let result_pair = [];
    let result_off_suit = [];


    //Find suit winrate 
    for(let i = 2; i <= 14; i++) {
        for(let k = i; k <= 14; k++) {
            if(k != i) {
                let current_winner = equity_range([new Card(i, 0), new Card(k, 0)], 2000000);
				result_suit.push({card_1: i, card_2: k, w_r: current_winner.draw_and_winrate});
            }
        }
	}
	
    console.log("\n\n SUIT WINRATE", result_suit, "\n\n");
    
    //Find pair and off suit winrate 
    for(let i = 2; i <= 14; i++) {
        for(let k = i; k <= 14; k++) {
            let current_winner = equity_range([new Card(i, 0), new Card(k, 1)], 2000000);
            if(k == i) {
                result_pair.push({rank: i, w_r: current_winner.draw_and_winrate});
            } else {
                result_off_suit.push({card_1: i, card_2: k, w_r: current_winner.draw_and_winrate});
            }
        }
    }
	console.log("\n\nOFF SUIT WINRATE", result_off_suit, "\n\nPAIRS", result_pair);
	
}

module.exports.calculate_preflop = calculate_preflop;
module.exports.sort_hand_in_rank_and_suit = sort_hand_in_rank_and_suit;
module.exports.create_specific_deck_of_cards = create_specific_deck_of_cards;
module.exports.equity_range = equity_range;
