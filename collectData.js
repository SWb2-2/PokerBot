const round = require('./website/js/modules/rounds');
const dealer_module = require("./website/js/classes/dealer.js");
const Player = require("./website/js/classes/player.js");
const Data = require("./website/js/classes/data.js");
const store = require("./ai/storage_function.js");
const ai = require("./ai/ai.js");
const log_functions = require('./logging/loggingFunctions');
const fs = require('fs');


// let data_preflop = new Data;
// let data_postflop = new Data;
// let data = new Data;

// let data_math = new Data;
// let data_preflop_math = new Data;
// let data_postflop_math = new Data;

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
    pot_before_player: dealer.bb.bb_size + dealer.bb.bb_size/2,
    bb_size: 0,
    player_move: { move: "", amount: 0},
	bluff: true
}

game_info_math = {
    ai_hand: [],
	table_cards: [],
    pot: 0,
    pot_before_player: dealer.bb.bb_size + dealer.bb.bb_size/2,
    bb_size: 0,
    player_move: { move: "", amount: 0},
	bluff: false
}

function simulatePoker(aiBluff, aiMath, dealer, simulations) {
    for(let i = 0; i < simulations; i++) {
        let progress = true;
        logNewGame();
        player_info.move = "";
        player_info.amount = 0;
        let response = round.pre_flop(aiMath, aiBluff, dealer);
        response.whose_turn === "Bluff" ? progress = initiateBetting(aiBluff, aiMath, dealer) 
                                        : progress = initiateBetting(aiMath, aiBluff, dealer);
        while(progress !== false) {
            let res = round.next_round(aiBluff, aiMath, dealer);
            res.whose_turn === "Bluff" ? progress = initiateBetting(aiBluff, aiMath, dealer) 
                                       : progress = initiateBetting(aiMath, aiBluff, dealer);
        }
        let res2 = round.showdown(aiBluff, aiMath, dealer);
        log_functions.logWinnings(aiBluff.name, res2, aiBluff.bluff, dealer.bb.bb_size, aiBluff.current_bet, aiBluff.hasBluffed);
        log_functions.logWinnings(aiMath.name, res2, aiMath.bluff, dealer.bb.bb_size, aiMath.current_bet, false);
        updateData(aiBluff);
        updateData(aiMath);
        readyNewGame(game_info_math, game_info_bluff, aiBluff, aiMath, dealer);
    }
    // console.log("Data for math, then bluff: ", aiBluff.data, aiMath.data);
    // console.log("pre-flop data:  ", aiMath.data_postflop, aiBluff.data_postflop);
}

function initiateBetting(player1, player2, dealer) {
    resetMoves(player1.name, game_info_math, game_info_bluff, dealer);
    if(player2.name === "Bluff") {
        var player2_move = game_info_bluff.player_move;
        player2_move.ai_move = player2_move.move;
    } else {
        var player2_move = game_info_math.player_move;
        player2_move.ai_move = player2_move.move;
    }
    let whose_turn = "player1";
    while(whose_turn !== "table" && whose_turn !== "showdown") {
        player_info.move = player2_move.ai_move;
        player_info.amount = player2_move.amount;
        updateGameInfo(player1, game_info_bluff, game_info_math, dealer, player_info);
        let player1_move = getPlayerMove(player1);
        checkBluff(player1, player1_move);
        log_functions.logMove(player1.name, player1.player_move, dealer.table_cards, player1.bluff);
        storePlayer(player1, player2, dealer);
        let res1 = round.process_move(player1, player2, dealer);
        
        if(res1.whose_turn !== "showdown" && res1.whose_turn !== "table") {
            player_info.move = player1_move.ai_move;
            player_info.amount = player1_move.amount;
            updateGameInfo(player2, game_info_bluff, game_info_math, dealer, player_info);
            player2_move = getPlayerMove(player2);
            checkBluff(player2, player2_move);
            log_functions.logMove(player2.name, player2.player_move, dealer.table_cards, player2.bluff);
            storePlayer(player2, player1, dealer);
            whose_turn = round.process_move(player2, player1, dealer).whose_turn;
        } else {
            return isTable(player1, player2, dealer);
        }
    }
    return isTable(player2, player1, dealer);
}

function isTable(player1, player2, dealer) {
    if(dealer.decide_whose_turn(player1, player2, dealer) === "showdown" ) {
        return false;
    } else {
        return true;
    }
}

function updateGameInfo(active, game_info_bluff, game_info_math, dealer, player_info) {
    if(active.name === "Bluff") {
        game_info_bluff.ai_hand = active.hand;
        game_info_bluff.table_cards = dealer.table_cards;
        game_info_bluff.pot = dealer.pot;
        game_info_bluff.player_move.move = player_info.move;
        game_info_bluff.player_move.amount = player_info.amount;
        game_info_bluff.bb_size = dealer.bb.bb_size; 
        game_info_bluff.ai_balance = active.balance;
        game_info_bluff.pot_before_player = dealer.pot;
    } else {
        game_info_math.ai_hand = active.hand;
        game_info_math.table_cards = dealer.table_cards;
        game_info_math.pot = dealer.pot;
        game_info_math.player_move.move = player_info.move;
        game_info_math.player_move.amount = player_info.amount;
        game_info_math.bb_size = dealer.bb.bb_size; 
        game_info_math.ai_balance = active.balance;
        game_info_math.pot_before_player = dealer.pot;
    }
}

function storePlayer(active_player, inactive_player, dealer) {
    if(dealer.table_cards.length < 3) {
        if((active_player.player_move.move !== "call" || dealer.pot !== dealer.bb.bb_size * 3/2)) {
            store.store_ai_move(active_player.player_move.move, active_player.data_preflop);
            store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data_preflop, true);
            store.store_ai_move(active_player.player_move.move, active_player.data);
            store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data);
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
    // if(!(active_player.player_move.move === "call" && dealer.pot === dealer.bb.bb_size * 3/2) && dealer.table_cards.length >= 3) {
    //     store.store_ai_move(active_player.player_move.move, active_player.data);
    //     store.store_player_move(active_player.player_move, inactive_player.player_move.move, dealer.pot, inactive_player.data);
    // } 
}

function logNewGame() {
    fs.appendFileSync('./logFiles/history_without_bluff.txt', '\n\n ––––––– NEW GAME ––––––––– \n\n');
    fs.appendFileSync('./logFiles/history_with_bluff.txt', '\n\n ––––––– NEW GAME ––––––––– \n\n');
}

function checkBluff(active_player, player_move) {
    player_move.bluff === undefined ? active_player.player_move.bluff = "false" : active_player.player_move.bluff = player_move.bluff;
    active_player.player_move.move = player_move.ai_move;
    active_player.player_move.amount = player_move.amount;

    if(active_player.player_move.bluff !== "false" && active_player.hasBluffed === false) {
        active_player.hasBluffed = true;
    }
}

function updateData(player) {
    player.data_preflop.total_preflop += 1;
    player.data_postflop.total_preflop += 1;
    player.data.total_preflop += 1;
}

function getPlayerMove(active_player) {
    // For at sikre det er to ai's, der ikke bluffer mod hinanden. 
    if(active_player.name === "Bluff") {
        active_player.bluff = false;
        game_info_bluff.bluff = false;
        response = ai.ai(game_info_bluff, active_player.data_preflop, active_player.data_postflop, active_player.data);
        active_player.bluff = true;
        game_info_bluff.bluff = true;
        return response;
    } else {
        return ai.ai(game_info_math, active_player.data_preflop, active_player.data_postflop, active_player.data);
    }
}

function resetMoves(active_player_name, game_info_math, game_info_bluff, dealer) {
    game_info_bluff.player_move.move = "";
    game_info_bluff.player_move.amount = 0;
    game_info_bluff.player_move.ai_move = "";

    game_info_math.player_move.move = "";
    game_info_math.player_move.amount = 0;
    game_info_math.player_move.ai_move = "";
    
}

function readyNewGame(game_info_math, game_info_bluff, aiBluff, aiMath, dealer) {
        game_info_bluff.pot_before_player = dealer.bb.bb_size + dealer.bb.bb_size/2;
        game_info_math.pot_before_player = dealer.bb.bb_size + dealer.bb.bb_size/2;
        game_info_math.player_move.move = "";
        game_info_bluff.player_move.move = "";
        game_info_bluff.player_move.amount = 0;
        game_info_math.player_move.amount = 0;
        aiBluff.hasBluffed = false;
        aiBluff.balance = 100;
        aiMath.balance = 100;
}

simulatePoker(aiBluff, aiMath, dealer, 1000000);
