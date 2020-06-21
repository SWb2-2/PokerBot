const deler = require("./website/js/classes/dealer");
const player = require("./website/js/classes/player");
const Player = require("./website/js/classes/player");

//Gives the calculated equity, of a given suit hand.
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

//Gives the calculated equity, of a given off suit hand and pairs. 
const arr_o_suit = /*00*/[ undefined, 
      /*01*/  undefined,			 
      /*02*/ [undefined, undefined, 50.00, 31.61, 32.41, 33.50, 33.17, 33.79, 36.11, 38.55, 41.69, 44.55, 47.80, 51.18, 55.41],
      /*03*/ [undefined, undefined, 31.61, 53.31, 34.27, 35.36, 35.15, 35.73, 36.71, 39.56, 42.48, 45.42, 48.57, 52.03, 56.31],
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



let player1 = new Player;
let player2 = new Player;

let dealer = new deler;

let player1_good_hands = 0; 
let player2_good_hands = 0; 
let player1_bad_hands = 0;
let player2_bad_hands = 0;

for(let i = 0; i < 10000000; i++) {

    if(i%100000 == 0) {
        console.log(i);
    }
    dealer.create_deck_of_cards();
    dealer.shuffle_array();
    dealer.give_hand_cards(player1, player2)

    if(player1.hand[0].suit == player1.hand[1].suit) {
        if(arr_suit[player1.hand[0].rank][player1.hand[1].rank] >= 50) {
            player1_good_hands++;
        } else {
            player1_bad_hands++; 
        }
    } else {
        if(arr_o_suit[player1.hand[0].rank][player1.hand[1].rank] >= 50) {
            player1_good_hands++;
        } else {
            player1_bad_hands++; 
        }
    }

    if(player2.hand[0].suit == player2.hand[1].suit) {
        if(arr_suit[player2.hand[0].rank][player2.hand[1].rank] >= 50) {
            player2_good_hands++;
        } else {
            player2_bad_hands++; 
        }
    } else {
        if(arr_o_suit[player2.hand[0].rank][player2.hand[1].rank] >= 50) {
            player2_good_hands++;
        } else {
            player2_bad_hands++; 
        }
    }
    dealer.new_game(player1, player2);
}

console.log("player1", player1_good_hands, player1_bad_hands, "PLAYER2", player2_good_hands, player2_bad_hands); 



