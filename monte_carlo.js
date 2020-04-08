const Dealer = require("./classes/class_dealer.js");
const Player = require("./classes/class_player.js");
const Card = require("./classes/class_card.js")
// const sort_hand = require("./classes/dealer_util/Determine_winner2.js")
const ace = 14;

//Sorts player's hand using insertion sort
function sort_hand(hand) {

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

function create_specific_deck_of_cards(ill_cards) {
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



function equity(hand, table, range) {
    if(table == undefined) {
        table = [];
    }

    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;
    const player1_hand = hand;
    const table_cards = table;
    player1.balance = 1; 
    player2.balance = 2;

    let win = 0; 
    let lose = 0; 
    let draw = 0; 

    let deck = [];

    let ill_cards = [];       //Dette indeholder de kort som vi ikke vil havde i decket
    ill_cards.push(hand[0], hand[1]);
    for(let i = 0; i < table.length; i++) {
        ill_cards.push(table[i]);
    }

    sort_hand(ill_cards);
    deck = create_specific_deck_of_cards(ill_cards);

    for(let i = 0; i < 250000; i++) {

        //reset
        player1.hand = player1_hand;
        player2.hand = [];

        //Give the dealer the correct deck
        dealer.deck_cards = [];
        for(let i = 0; i < deck.length; i++) {
            dealer.deck_cards[i] = deck[i];
        }

        //Add the table_cards to the dealer again
        dealer.table_cards = [];
        for(let i = 0; i < table_cards.length; i++) {
            dealer.table_cards[i] = table_cards[i];
        }

        dealer.shuffle_array();

        //Give the oppent two random cards, and add cards to the table, so there is 5 cards on the table. 
        player2.hand.push(dealer.deck_cards.pop(), dealer.deck_cards.pop());
        while(dealer.table_cards.length < 5) {
            dealer.table_cards.push(dealer.deck_cards.pop());
        }


        //Determine the winner, and cataloge it. 
        let result = dealer.get_winner(player1, player2);

        if(result.winner.balance == 1) {
            win++;
        } else if(result.winner.balance == 2) {
            lose++;
        } else {
            draw++;
        }
    }
    return {win: win, 
            lose: lose, 
            draw: draw};
}

//Sure win
// let result = equity([new Card(14,2), new Card(14,3)], [new Card(14,1), new Card(14,0), new Card(4,2), new Card(7,0), new Card(12,1)]);

//Pocket Ace
// let result = equity([new Card(14,2), new Card(14,3)]);

//Suited 2-3
// let result = equity([new Card(2,2), new Card(3,2)]);

//Offsuit 2-3
// let result = equity([new Card(2,1), new Card(3,2)]);

//Pocket 2
let result = equity([new Card(2,1), new Card(2,2)]);



console.log(result);

let k = result.win + result.lose + result.draw;
let winrate = (result.win / k) * 100;
let draw_and_winrate = ((result.win + result.draw) / k) * 100;

console.log("Winrate: \n", winrate, "\n Draw and winrate; \n", draw_and_winrate);

