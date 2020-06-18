const round = require('./website/js/modules/rounds');
const dealer_module = require("./website/js/classes/dealer.js");
const Player = require("./website/js/classes/player.js");
const Data = require("./website/js/classes/data.js");
const store = require("./ai/storage_function.js");
const ai_bluff = require("./ai/ai_bluff.js");
const ai_math = require("./ai/ai.js");
const log_functions = require('./logging/loggingFunctions');
const fs = require('fs');

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

var first_bluff = true;
var first_math = true;

var math = {preflop_raise_count: 0, 
            preflop_count: 0,
            postflop_count: 0,
            preflop_raise_range: 0,
            preflop_range: 0,
            postflop_range: 0, 
            total_count: 0,
            total_range: 0,
            raise: 0,
            raise_range: 0,
            call: 0,
            call_range: 0,
            check: 0, 
            check_range: 0}

var bluff = {preflop_raise_count: 0, 
            preflop_count: 0,
            postflop_count: 0,
            preflop_raise_range: 0,
            preflop_range: 0,
            postflop_range: 0,
            total_count: 0,
            total_range: 0,
            raise: 0,
            raise_range: 0,
            call: 0,
            call_range: 0,
            check: 0, 
            check_range: 0}

// let first1 = true;
// let first2 = true;
let end_round = "" // Can be "sb" or "bb", based on who ended the bettin round. 


//Overall structure of simulated poker game given player infos and dealer.
function simulatePoker(aiBluff, aiMath, dealer, simulations) {
	let args = process.argv.slice(2);
	game_info_bluff.bluff = log_functions.checkCommandLine(args);
	for(let i = 0; i < simulations; i++) {


        if(i%100 == 0) {
            console.log("\nMath raise range:",  math.preflop_raise_range / math.preflop_raise_count,
            "Math no raise preflop:",  math.preflop_range / math.preflop_count,
            "Math postflop: ",  math.postflop_range / math.postflop_count , 
            "math total", math.total_range / math.total_count,
            "math raise total", math.raise_range / math.raise,
            "math call range", math.call_range / math.call ,
            "math check",  math.check_range / math.check, 
            "math empty",  math.empty_range / math.empty,
            "\nBluf raise range:", bluff.preflop_raise_range / bluff.preflop_raise_count,
            "bluf no raise preflop:",  bluff.preflop_range / bluff.preflop_count,
            "bluf postflop: ",  bluff.postflop_range / bluff.postflop_count , 
            "bluf total", bluff.total_range / bluff.total_count,
            "bluf raise total", bluff.raise_range / bluff.raise,
            "bluf call range", bluff.call_range / bluff.call ,
            "bluf check",  bluff.check_range / bluff.check, 
            "bluf empty",  bluff.empty_range / bluff.empty);
        }

        first_bluff = true;
        first_math = true;
        resetMoves();
        end_round = ""; 
        first1 = true;
        first2 = true;
        let progress = true;
        player_info.move = "";
        player_info.amount = 0;
        let response = round.pre_flop(aiMath, aiBluff, dealer);

		//preflop
        if (response.whose_turn === "Math") {
            progress = initiateBetting(aiMath, aiBluff, dealer); 
            // progress = initiateBetting(aiMath, aiBluff, dealer, first_bluff, first_math); 
        } else if (response.whose_turn === "Bluff") {
            progress = initiateBetting(aiBluff, aiMath, dealer);
            // progress = initiateBetting(aiBluff, aiMath, dealer, first_bluff, first_math);
        } else {
            progress = isTable(aiBluff, aiMath, dealer);
		}
		
		//postflop
        while(progress !== false) {
            let res = round.next_round(aiBluff, aiMath, dealer);
            if (res.whose_turn === "Math") {
                progress = initiateBetting(aiMath, aiBluff, dealer); 
                // progress = initiateBetting(aiMath, aiBluff, dealer, first_bluff, first_math); 
            } else if (res.whose_turn === "Bluff") {
                progress = initiateBetting(aiBluff, aiMath, dealer);
                // progress = initiateBetting(aiBluff, aiMath, dealer, first_bluff, first_math);
            } else {
                progress = isTable(aiBluff, aiMath, dealer);
            }
        }
		//Showdown
        let res2 = round.showdown(aiBluff, aiMath, dealer);
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
        // let player1_move = getPlayerMove(player1, first_bluff);
        let player1_move = getPlayerMove(player1);

        if(player1.name === "Bluff") {
            first_bluff = false; 
        } else if (player1.name === "Math") {
            first_math = false; 
        } else {
            console.log("erroe")
        }

        checkBluff(player1, player1_move);
        log_functions.logMove(player1.player_move, player1.bluff);
        storePlayer(player1, player2, dealer);
        let res1 = round.process_move(player1, player2, dealer);

        player1.blind === "sb" ? end_round = "sb" : end_round = "bb"; 
        
        if(res1.whose_turn !== "showdown" && res1.whose_turn !== "table") {
            player_info.move = player1_move.ai_move;
            player_info.amount = player1_move.amount;
            updateGameInfo(player2, dealer, player_info);
            player2_move = getPlayerMove(player2);
            // player2_move = getPlayerMove(player2, first_math);


            if(player2.name === "Bluff") {
                first_bluff = false; 
            } else if (player2.name === "Math") {
                first_math = false; 
            } else {
                console.log("erroe")
            }

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



//gets player move from ai
function getPlayerMove(active_player) {
    if(active_player.name === "Bluff") {

        let j = ai_bluff.ai_bluff(game_info_bluff, active_player.data_preflop, active_player.data_postflop, active_player.data, first_bluff);
        
        if(j.range0.round == "preflop_raise") {

            bluff.preflop_raise_count++;
            bluff.preflop_raise_range += j.range0.range_Low;

        } else if(j.range0.round == "preflop_no_raise") {

            bluff.preflop_count++;
            bluff.preflop_range += j.range0.range_Low;

        } else if(j.range0.round == "postflop") {

            bluff.postflop_count++;
            bluff.postflop_range += j.range0.range_Low;

        }
        bluff.total_count++;
        bluff.total_range += j.range0.range_Low;

        if(j.range0.opponent_move == "raise") {
            bluff.raise++;
            bluff.raise_range += j.range0.range_Low;

        } else if(j.range0.opponent_move == "call") {
            bluff.call++;
            bluff.call_range += j.range0.range_Low;

        } else if(j.range0.opponent_move == "check") {
            bluff.check++;
            bluff.check_range += j.range0.range_Low;
        } else if(j.range0.opponent_move == "empty") {
            bluff.empty++;
            bluff.empty_range += j.range0.range_Low;
        }

        return j; 
        
    } else {
        let j = ai_math.ai_math(game_info_bluff, active_player.data_preflop, active_player.data_postflop, active_player.data, first_math);
        
        if(j.range0.round == "preflop_raise") {

            math.preflop_raise_count++;
            math.preflop_raise_range += j.range0.range_Low;

        } else if(j.range0.round == "preflop_no_raise") {

            math.preflop_count++;
            math.preflop_range += j.range0.range_Low;

        } else if(j.range0.round == "postflop") {

            math.postflop_count++;
            math.postflop_range += j.range0.range_Low;

        }
        math.total_count++;
        math.total_range += j.range0.range_Low;


        if(j.range0.opponent_move == "raise") {
            math.raise++;
            math.raise_range += j.range0.range_Low;

        } else if(j.range0.opponent_move == "call") {
            math.call++;
            math.call_range += j.range0.range_Low;

        } else if(j.range0.opponent_move == "check") {
            math.check++;
            math.check_range += j.range0.range_Low;
        } else if(j.range0.opponent_move == "empty") {
            math.empty++;
            math.empty_range += j.range0.range_Low;
        }

        return j; 
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

simulatePoker(aiBluff, aiMath, dealer, 100000);