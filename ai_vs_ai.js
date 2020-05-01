const round = require('./website/js/modules/rounds');
const Dealer = require("./website/js/classes/dealer.js");
const Player = require("./website/js/classes/player.js");
const Data = require("./website/js/classes/data.js");
const store = require("./ai/storage_function.js");
const ai = require("./ai/ai.js");
const log_functions = require('./logging/loggingFunctions');
const fs = require('fs');

let dealer = new Dealer; 

let ai_bluff = new Player(100, "ai_bluff"); 
let ai_bluffnt = new Player(100, "ai_bluffnt"); 

ai_bluff.blind = "sb";
ai_bluffnt.blind = "bb";


let data_bluff_preflop = new Data; 
let data_bluffnt_preflop = new Data; 
let data_bluff_postflop = new Data; 
let data_bluffnt_postflop = new Data; 
let data_bluff = new Data; 
let data_bluffnt = new Data; 


let game_info_bluff = {
    // current_bet: 0, 
    ai_hand: [],
	table_cards: [],
    pot: 0,
    pot_before_player: dealer.bb.bb_size + dealer.bb.bb_size/2,
    bb: "", 
    bb_size: 2,
    player_move: { move: "", amount: 0 },
    bluff: true, 
    // done_a_move: false 
}

let game_info_bluffnt = {
    // current_bet: 0, 
    ai_hand: [],
	table_cards: [],
    pot: 0,
    pot_before_player: dealer.bb.bb_size + dealer.bb.bb_size/2,
    bb: "", 
    bb_size: 2,
    player_move: { move: "", amount: 0 },
    bluff: false,
    // done_a_move: false
}

play_ai_vs_ai(); 

let round_done = false; 
let whose_turn; 
let move_ai_bluff; 
let move_ai_bluffnt;
let game_finish = false;
let fold = false; 
let is_round_done = false; 
let winner = ""; 


function play_ai_vs_ai() {

    //Make big and small_blind
    whose_turn = set_up(ai_bluff, ai_bluffnt, dealer); 

    //Gives cards, add blinds osv...
    set_up_preflop(ai_bluff, ai_bluffnt, game_info_bluff, game_info_bluffnt); 

    //This takes into acout the 4 bettingrounds. 
    for(let i = 0; i < 4 || fold == false; i++) {

        //Performs a betting round, until a player has folded, or contributed the same amount to the pot. 
        fold = do_a_betting_round(); 

        //A round is done, and table cards are added. 
        add_table_cards(); 
    }

    //The winner is found. If a player has folded, the other player wins. Else go to showdown.  
    winner = find_winner(ai_bluff, ai_bluffnt);
    console.log("One game played winner is ", winner);
}



function find_whose_turn() {

    let round = ai.find_round(dealer.table_cards);

    if(round == "preflop") {

        if(ai_bluff.blind == "sb") {
            return "ai_bluff"
        } else {
            return "ai_bluffnt"
        }
    } else {
        if(ai_bluff.blind == "sb") {
            return "ai_bluffnt"
        } else {
            return "ai_bluff"
        } 
    }
    console.log("ERROR INF FIND_WHOSE TURN"); 
}

function update_table_and_pot() {

    game_info_bluffnt.table_cards = game_info_bluff.table_cards = dealer.table_cards; 
    // game_info_bluffnt.pot = game_info_bluff.pot = dealer.pot; 
}


function do_a_betting_round() {

    let whose_turn = find_whose_turn(); 

    if(ai.find_round() == "preflop") {

        if(whose_turn == "ai_bluff") {
            game_info_bluff.player_move = {move: "raise", amount: 1}; 
        } else if (whose_turn == "ai_bluffnt") {
            game_info_bluffnt.player_move = {move: "raise", amount: 1}; 
        }
    } else {
        game_info_bluff.player_move = {move: "check", amount: 0}; 
        game_info_bluffnt.player_move = {move: "check", amount: 0}; 
    }

    let is_round_done = false; 

    while(is_round_done == false) {
            
        //THis is the bluffing bot 
        if(whose_turn == "ai_bluff") {

            update_game_info(ai_bluff); 
            move_ai_bluff = ai.ai(game_info_bluff, data_bluffnt_preflop, data_bluffnt_postflop, data_bluffnt);
            game_info_bluff.done_a_move = true; 
            game_info_bluffnt.player_move = {move: move_ai_bluff.ai_move, amount: move_ai_bluff.amount};

            //Hvis der raises, øges potten 
            if(move_ai_bluff.ai_move == "raise") {
                game_info_bluffnt.pot += move_ai_bluff.amount; 
                game_info_bluff.pot += move_ai_bluff.amount; 
            } else if(move_ai_bluff.ai_move == "fold") {
                fold == true;  
            }

            whose_turn = "ai_bluffnt"

            //THis is the not bluffing bot 
        } else if (whose_turn == "ai_bluffnt") {

            update_game_info(ai_bluffnt); 

            move_ai_bluffnt = ai.ai(game_info_bluffnt, data_bluff_preflop, data_bluff_postflop, data_bluff);
            game_info_bluffnt.done_a_move = true; 
            game_info_bluff.player_move = {move: move_ai_bluffnt.ai_move, amount: move_ai_bluffnt.amount};

            //Hvis der raises, øges potten 
            if(move_ai_bluffnt.ai_move == "raise") {
                game_info_bluffnt.pot += move_ai_bluff.amount; 
                game_info_bluff.pot += move_ai_bluff.amount; 
            } else if(move_ai_bluffnt.ai_move == "fold") {
                fold == true;  
            }

            whose_turn = "ai_bluff";

        }
        is_round_done = is_round_done_func(ai_bluff, ai_bluffnt);
    }
}














//Create new game, shuffle a new deck, make the bots pay their blinds, and give them cards. 
//Gives the cards to the game_info, and adds the pot to game_info.. 

function set_up_preflop(ai_bluff, ai_bluffnt, game_info_bluff, game_info_bluffnt) {
    
    dealer.new_game(ai_bluff, ai_bluffnt);
    dealer.create_deck_of_cards();
    dealer.shuffle_array();
    dealer.pay_blinds(ai_bluff, ai_bluffnt, dealer.bb.bb_size, dealer.bb.bb_size / 2); 
    dealer.give_hand_cards(ai_bluff, ai_bluffnt);
    game_info_bluffnt.pot = dealer.pot;
    game_info_bluff.pot = dealer.pot;
    game_info_bluff.ai_hand = ai_bluff.hand;
    game_info_bluffnt.ai_hand = ai_bluffnt.hand;

    if(ai_bluff.blind == "sb") {
        game_info_bluffnt.player_move = {move: "raise", amount: dealer.bb.bb_size / 2}; 
    } else if (ai_bluffnt.blind == "sb") {
        game_info_bluff.player_move = {move: "raise", amount: dealer.bb.bb_size / 2}; 
    }
    // console.log(dealer, ai_bluff, ai_bluffnt, game_info_bluff, game_info_bluffnt);

}

function find_winner(ai_bluff, ai_bluffnt) {

    if(ai_bluff.player_move.move == "fold") {
        dealer.give_pot(ai_bluffnt);
    } else if(ai_bluff.player_move.move == "fold") {
        dealer.give_pot(ai_bluff);
    }

    let k = dealer.get_winner(ai_bluff, ai_bluffnt) 

    if(k.winner == "ai_bluff") {
        dealer.give_pot(ai_bluff);
    } else if(k.winner == "ai_bluffnt") {
        dealer.give_pot(ai_bluffnt);  
    } else if(k.winner = "draw") {
        dealer.give_pot(ai_bluff, ai_bluffnt);
    } else {
        console.log("Error in determine winenr");
    }
    return k.winner; 
 }


function is_round_done_func(ai_bluff, ai_bluffnt) {
    // console.log(ai_bluff, ai_bluffnt)

    if(ai_bluff.player_move.move == "" || ai_bluffnt.player_move.move == "") {
        return false; 
    }

    if(ai_bluff.current_bet == ai_bluffnt.current_bet) {
        return true; 
    }



}

function add_table_cards() {
    dealer.table_cards.length < 3 ? dealer.add_table_cards(3) : dealer.add_table_cards(1);
    game_info_bluff.table_cards = game_info_bluffnt.table_cards = dealer.table_cards; 
}


function set_up(ai_bluff, ai_bluffnt) {

    if(dealer.bb.set_flag == false) {
        dealer.create_blind_amount(ai_bluff.balance);
    }

    return ai_bluff.blind === "sb" ? ai_bluff.name : ai_bluffnt.name
}



