const round = require('./website/js/modules/rounds');
const dealer_module = require("./website/js/classes/dealer.js");
const Player = require("./website/js/classes/player.js");
const Data = require("./website/js/classes/data.js");
const store = require("./ai/storage_function.js");
const ai = require("./ai/ai.js");
const log_functions = require('./logging/loggingFunctions');
const fs = require('fs');
const monte = require("./ai/ai_util/monte_carlo");



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


// Initializing players and dealer
let aiBluff = new Player(100, "Bluff");
let aiMath = new Player(100, "Math");
let dealer = new dealer_module();

aiBluff.data = new Data;
aiBluff.data_preflop = new Data;
aiBluff.data_postflop = new Data;
aiBluff.bluff = true;
aiBluff.hasBluffed = false;

aiMath.data = new Data;
aiMath.data_preflop = new Data;
aiMath.data_postflop = new Data;
aiMath.bluff = false;
aiMath.hasBluffed = false;

let player_info = {move: "", amount: 0};

let game_info_bluff = {
    ai_hand: [],
	table_cards: [],
    pot: 0,
    bb_size: 0,
    player_move: { move: "", amount: 0},
	bluff: true
}

let game_info_math = {
    ai_hand: [],
	table_cards: [],
    pot: 0,
    bb_size: 0,
    player_move: { move: "", amount: 0},
	bluff: false
}

let first1 = true;
let first2 = true;
let end_round = "" // Can be "sb" or "bb", based on who ended the bettin round. 
let math_strength; 
let bluff_strength; 
let number_of_bluffs = 0; 

//Overall structure of simulated poker game given player infos and dealer.
function simulatePoker(aiBluff, aiMath, dealer, simulations) {
	let args = process.argv.slice(2);
	game_info_bluff.bluff = log_functions.checkCommandLine(args);
	for(let i = 0; i < simulations; i++) {
        resetMoves();
        end_round = ""; 
        first1 = true;
        first2 = true;
        let progress = true;
        player_info.move = "";
        player_info.amount = 0;
        let response = round.pre_flop(aiMath, aiBluff, dealer);

        if(aiMath.hand[0].suit == aiMath.hand[1].suit) {
            if(arr_suit[aiMath.hand[0].rank][aiMath.hand[1].rank] >= 50) {
                aiMath.data.good_hands++;
                math_strength = true; 
            } else {
                aiMath.data.bad_hands++; 
                math_strength = false; 
            }
        } else {
            if(arr_o_suit[aiMath.hand[0].rank][aiMath.hand[1].rank] >= 50) {
                aiMath.data.good_hands++;
                math_strength = true; 
            } else {
                aiMath.data.bad_hands++; 
                math_strength = false; 
            }
        }

        if(aiBluff.hand[0].suit == aiBluff.hand[1].suit) {
            if(arr_suit[aiBluff.hand[0].rank][aiBluff.hand[1].rank] >= 50) {
                aiBluff.data.good_hands++;
                bluff_strength = true; 
            } else {
                aiBluff.data.bad_hands++; 
                bluff_strength = false; 
            }
        } else {
            if(arr_o_suit[aiBluff.hand[0].rank][aiBluff.hand[1].rank] >= 50) {
                aiBluff.data.good_hands++;
                bluff_strength = true; 
            } else {
                aiBluff.data.bad_hands++; 
                bluff_strength = false; 
            }
        }

		//preflop
        if (response.whose_turn === "Math") {
            progress = initiateBetting(aiMath, aiBluff, dealer); 
        } else if (response.whose_turn === "Bluff") {
            progress = initiateBetting(aiBluff, aiMath, dealer);
        } else {
            progress = isTable(aiBluff, aiMath, dealer);
		}
		
		//postflop
        while(progress !== false) {
            let res = round.next_round(aiBluff, aiMath, dealer);
            if (res.whose_turn === "Math") {
                progress = initiateBetting(aiMath, aiBluff, dealer); 
            } else if (res.whose_turn === "Bluff") {
                progress = initiateBetting(aiBluff, aiMath, dealer);
            } else {
                progress = isTable(aiBluff, aiMath, dealer);
            }
        }
		//Showdown
        let res2 = round.showdown(aiBluff, aiMath, dealer);


        if(res2.winner == "Bluff") {
            if(bluff_strength == true) {
                aiBluff.data.good_hands_winnings += (res2.storage_pot - aiBluff.current_bet) / dealer.bb.bb_size; 
            } else { 
                aiBluff.data.bad_hands_winnings += (res2.storage_pot - aiBluff.current_bet) / dealer.bb.bb_size; 
            }

            if(math_strength == true) {
                aiMath.data.good_hands_winnings -= aiMath.current_bet / dealer.bb.bb_size; 
            } else { 
                aiMath.data.bad_hands_winnings -=  aiMath.current_bet / dealer.bb.bb_size; 
            }

        } else if (res2.winner == "Math") {
            if(bluff_strength == true) {
                aiBluff.data.good_hands_winnings -=  aiBluff.current_bet / dealer.bb.bb_size; 
            } else { 
                aiBluff.data.bad_hands_winnings -= aiBluff.current_bet / dealer.bb.bb_size; 
            }  

            if(math_strength == true) {
                aiMath.data.good_hands_winnings += (res2.storage_pot - aiMath.current_bet) / dealer.bb.bb_size; 
            } else { 
                aiMath.data.bad_hands_winnings += (res2.storage_pot - aiMath.current_bet) / dealer.bb.bb_size; 
            }
        }


        log_functions.logWinnings(aiBluff.name, res2, aiBluff.bluff, dealer.bb.bb_size, aiBluff.current_bet, aiBluff.hasBluffed);
        log_functions.logWinnings(aiMath.name, res2, aiMath.bluff, dealer.bb.bb_size, aiMath.current_bet, false);
        updateData(aiBluff);
        updateData(aiMath);
        readyNewGame(aiBluff, aiMath);
    }
	// Logs the data for each player after all the given input simulations have been completed.
	console.log("–––––––––General data for bluff, then math: ––––––––– \n", aiBluff.data, aiMath.data);
    console.log("–––––––––Pre-flop data for bluff, then math: ––––––––– \n", aiBluff.data_preflop, aiMath.data_preflop);
    console.log("–––––––––Post-flop data for bluff, then math: ––––––––– \n", aiBluff.data_postflop, aiMath.data_postflop);

    logData(aiMath, aiBluff);
}

//logs preflop, postflop, and general data of ais in file
function logData(aiMath, aiBluff) {
    fs.writeFileSync("./logFiles/data4Math", JSON.stringify(aiMath.data) + " Pre_flop " + JSON.stringify(aiMath.data_preflop) + "Post flop " + JSON.stringify(aiMath.data_postflop));
    fs.writeFileSync("./logFiles/data4Bluff", JSON.stringify(aiBluff.data) + "Pre_flop " + JSON.stringify(aiBluff.data_preflop) + "Postflop" + JSON.stringify(aiBluff.data_postflop));
}

//Runs bettingsrounds for a given round until someone folds or players have equal current bets. 
// Returns boolean value which indicates whether it is time for showdown or not. 
function initiateBetting(player1, player2, dealer) {

   //preflop, when there have been called as sb. 
   if((dealer.table_cards.length === 3) && (dealer.pot === dealer.bb.bb_size * 2)) {

        if(player2.name == "Bluff") {
            game_info_bluff.player_move.move = ""; 
        } else if (player2.name == "Math") {
            game_info_math.player_move.move = ""; 
        } 
    }

    if(end_round === "bb" && dealer.table_cards.length > 0) {  //Player 2 vil altid være sb herinde. 

        if(player2.name == "Bluff") {
            game_info_bluff.player_move.move = ""; 
        } else if (player2.name == "Math") {
            game_info_math.player_move.move = ""; 
        }
    }

    if(player2.player_move.move == "raise") {
        if(player2.name == "Bluff") {
            game_info_bluff.player_move.move = ""; 
        } else if (player2.name == "Math") {
            game_info_math.player_move.move = ""; 
        }
    }

	let player2_move = {ai_move: "", amount: 0};
    let whose_turn = dealer.decide_whose_turn(player1,player2);
	// Loop contains the betting round, where dealer object decides whether or not round is over.  
	while(whose_turn !== "table" && whose_turn !== "showdown") {
		player_info.move = player2_move.ai_move;
        player_info.amount = player2_move.amount;
        updateGameInfo(player1, dealer, player_info);
        let player1_move = getPlayerMove(player1, first1);

        if(player1_move.bluff != undefined) {
            aiBluff.data.number_of_bluffs++; 
        }

		first1 = false;
        checkBluff(player1, player1_move);
        log_functions.logMove(player1.player_move, player1.bluff);
        storePlayer(player1, player2, dealer);
        let res1 = round.process_move(player1, player2, dealer);

        player1.blind === "sb" ? end_round = "sb" : end_round = "bb"; 
        
        if(res1.whose_turn !== "showdown" && res1.whose_turn !== "table") {
            player_info.move = player1_move.ai_move;
            player_info.amount = player1_move.amount;
            updateGameInfo(player2, dealer, player_info);
            player2_move = getPlayerMove(player2, first2);
            
            if(player2_move.bluff != undefined) {
                aiBluff.data.number_of_bluffs++; 
            }
            
            first2 = false;
            checkBluff(player2, player2_move);
            log_functions.logMove(player2.player_move, player2.bluff);
            storePlayer(player2, player1, dealer);
            whose_turn = round.process_move(player2, player1, dealer).whose_turn;

            player2.blind === "sb" ? end_round = "sb" : end_round = "bb"; 

        } else {
            return isTable(player1, player2);
        }
    }
    return isTable(player2, player1);
}

//determines whether it is table's turn (need to put down table card) or it is showdown(hand is done)
function isTable(player1, player2) {
    if(dealer.decide_whose_turn(player1, player2) === "showdown" ) {
        return false;
    } else {
        return true;
    }
}

//updates game info objects with information about the current game situation
function updateGameInfo(active, dealer, player_info) {
    if(active.name === "Bluff") {
        game_info_bluff.ai_hand = active.hand;
        game_info_bluff.table_cards = dealer.table_cards;
        game_info_bluff.pot = dealer.pot;
        game_info_bluff.player_move.move = player_info.move;
        game_info_bluff.player_move.amount = player_info.amount;
        game_info_bluff.bb_size = dealer.bb.bb_size; 
        game_info_bluff.ai_balance = active.balance;
    } else {
        game_info_math.ai_hand = active.hand;
        game_info_math.table_cards = dealer.table_cards;
        game_info_math.pot = dealer.pot;
        game_info_math.player_move.move = player_info.move;
        game_info_math.player_move.amount = player_info.amount;
        game_info_math.bb_size = dealer.bb.bb_size; 
        game_info_math.ai_balance = active.balance;
    }
}

//Stores player information based on which round it is, that is preflop or postflop
function storePlayer(active_player, inactive_player, dealer) {
    if(dealer.table_cards.length < 3) {
        if((active_player.player_move.move !== "call" || dealer.pot !== dealer.bb.bb_size * 3/2)) {
            store.store_ai_move(active_player.player_move.move, active_player.data_preflop);
            store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data_preflop, true);
            store.store_ai_move(active_player.player_move.move, active_player.data);
			store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data);
		//If player calls as small blind (pays the blind), it won't be counted as a call, but rather a check
        } else {
            store.store_ai_move({move: "check", amount: 0}, active_player.data_preflop);
            store.store_player_move({move: "check", amount: 0}, inactive_player.player_move.move, dealer.pot, inactive_player.data_preflop, true);
            store.store_ai_move({move: "check", amount: 0}, active_player.data);
            store.store_player_move({move: "check", amount: 0}, inactive_player.player_move.move, dealer.pot, inactive_player.data);
        }
        active_player.data.hands_played_percentage = active_player.data_preflop.hands_played_percentage;
    } else {
        store.store_ai_move(active_player.player_move.move, active_player.data_postflop);
        store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data_postflop, false);
        store.store_ai_move(active_player.player_move.move, active_player.data);
        store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data);
    } 
}

//checks whether ai has bluffed
function checkBluff(active_player, player_move) {
    player_move.bluff === undefined ? active_player.player_move.bluff = "false" : active_player.player_move.bluff = player_move.bluff;
    active_player.player_move.move = player_move.ai_move;
    active_player.player_move.amount = player_move.amount;

    if(active_player.player_move.bluff !== "false" && active_player.hasBluffed === false) {
        active_player.hasBluffed = true;
    }
}

//updates total moves in preflop in all data objects
function updateData(player) {
    player.data_preflop.total_preflop += 1;
    player.data_postflop.total_preflop += 1;
    player.data.total_preflop += 1;
}

//gets player move from either ai 'Bluff' or 'Math'. Parameter first means that it is the first move in the round. 
function getPlayerMove(active_player, first) {
    if(active_player.name === "Bluff") {

        // console.log(dealer.table_cards.length, end_round, game_info_bluff.player_move.move);

        return ai.ai(game_info_bluff, active_player.data_preflop, active_player.data_postflop, active_player.data, first);
	} else {
        return ai.ai(game_info_math, active_player.data_preflop, active_player.data_postflop, active_player.data, first);
    }
}

//Resets old moves in beginning of player round
function resetMoves() {
    game_info_bluff.player_move.move = "";
    game_info_bluff.player_move.amount = 0;
    game_info_bluff.player_move.ai_move = "";

    game_info_math.player_move.move = "";
    game_info_math.player_move.amount = 0;
    game_info_math.player_move.ai_move = "";

    aiMath.data.current_range.range_Low = 34; 
    aiMath.data.current_range.range_high = 86; 

    aiBluff.data.current_range.range_Low = 34; 
    aiBluff.data.current_range.range_high = 86; 
    
}

//Initializes game info for next hand
function readyNewGame(aiBluff, aiMath) {
        game_info_math.player_move.move = "";
        game_info_bluff.player_move.move = "";
        game_info_bluff.player_move.amount = 0;
        game_info_math.player_move.amount = 0;
        aiBluff.hasBluffed = false;
        aiBluff.balance = 100;
        aiMath.balance = 100;
}

simulatePoker(aiBluff, aiMath, dealer, 200);


