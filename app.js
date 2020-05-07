const express = require("express");
const round = require('./website/js/modules/rounds');
const dealer_module = require("./website/js/classes/dealer.js");
const Player = require("./website/js/classes/player.js");
const Data = require("./website/js/classes/data.js");
const store = require("./ai/storage_function.js");
const ai = require("./ai/ai.js");
const log_functions = require('./logging/loggingFunctions');
const fs = require('fs');

const port = 3000;
const app = express();

let hasBluffed = false
let bluff = false;

let dealer = new dealer_module;
let human_player = new Player(250, "player");
let ai_player = new Player(200, "robot");
let data_preflop = new Data;
let data_postflop = new Data;
let data = new Data;
let player_info = {move: "", amount: 0};

let game_info = {
    ai_hand: [],
	table_cards: [],
    pot: 0,
    pot_before_player: dealer.bb.bb_size + dealer.bb.bb_size/2,
    bb_size: 0,
    player_move: { move: "check", amount: 13 },
	bluff: false
}

let args = process.argv.slice(2);
bluff = log_functions.checkCommandLine(args);

app.use(express.static("website"));
app.use(express.json({limit:"1mb"}));

//Happens once, when balance is given and rediricts, to the actual game
app.post('/balance', (req, res) => {
    if(bluff) {
        fs.appendFileSync('./logFiles/history_with_bluff.txt', "\n–––– NEW PLAYER ––––\n");
    } else {
        fs.appendFileSync('./logFiles/history_without_bluff.txt', "\n–––– NEW PLAYER ––––\n");
    }
    human_player.balance = Number(req.body.balance);
    ai_player.balance = Number(req.body.balance);
    res.statusCode = 301;
    res.redirect("game.html");
    res.end("request accepted");
});

//The player makes a move, and it will be stored. 
app.post('/player_move', (req, res) => {
    player_info.move = human_player.player_move.move = req.body.move;
    player_info.amount = human_player.player_move.amount = Number(req.body.amount);
    game_info.pot_before_player = dealer.pot;
    if(dealer.table_cards.length < 3) {
        if(!(human_player.player_move.move == "call" && dealer.pot == dealer.bb.bb_size * 3/2)) {
            store.store_player_move(human_player.player_move, ai_player.player_move.move, dealer.pot, data_preflop, true);
        } else {
            store.store_player_move({move: "check", amount: 0}, undefined, dealer.pot, data_preflop, true )
        }
    } else {
        store.store_player_move(human_player.player_move, ai_player.player_move.move, dealer.pot, data_postflop, false);
    } 
    store.store_player_move(human_player.player_move, ai_player.player_move.move, dealer.pot, data, false);

    res.statusCode = 200;
    let response = round.process_move(human_player, ai_player, dealer);
    // console.log("player move",response);
    res.json(JSON.stringify(response));
    res.end("request completed");
});

//Preflop happens, and playercards, and blinds are send back. 
app.get('/player_object', (req, res) => {
    if(bluff) {
        fs.appendFileSync("./logFiles/history_with_bluff.txt", "\nNew Game: ");
    } else {
        fs.appendFileSync("./logFiles/history_without_bluff.txt", "\nNew Game: ");
    }
    
    res.statusCode = 200;
    let player_object = round.pre_flop(human_player, ai_player, dealer); 
    res.json(JSON.stringify(player_object));
    res.end("request completed");
});

//Calls the ai, procces the given move, and sends it back. 
app.get('/ai_move', (req, res) => {
    res.statusCode = 200;

    game_info.ai_hand = ai_player.hand;
    game_info.table_cards = dealer.table_cards;
    game_info.pot = dealer.pot;
    game_info.player_move.move = player_info.move;
    game_info.player_move.amount = player_info.amount;
    game_info.bluff = bluff; 
    game_info.bb_size = dealer.bb.bb_size; 
    game_info.ai_balance = ai_player.balance;
    
    let k = ai.ai(game_info, data_preflop, data_postflop, data);
    
    ai_player.player_move.move = k.ai_move;
    ai_player.player_move.amount = k.amount;
    k.bluff === undefined ? ai_player.player_move.bluff = "false" : ai_player.player_move.bluff = k.bluff;
    
    if(k.bluff !== undefined && hasBluffed === false) {
        hasBluffed = true;
    }
    log_functions.logMove("AI", ai_player.player_move, dealer.table_cards, bluff);
    
    if(dealer.table_cards.length < 3) {
        store.store_ai_move(ai_player.player_move.move, data_preflop);
        data.hands_played_percentage = data_preflop.hands_played_percentage;
    } else {
        store.store_ai_move(ai_player.player_move.move, data_postflop);
    }
    store.store_ai_move(ai_player.player_move.move, data);
    Math.round(ai_player.amount * 10) / 10;
    let response = round.process_move(ai_player, human_player, dealer);
    // console.log("ai move: ", response);
    res.json(JSON.stringify(response));
    res.end("request accepted");
});

//A round is done, and cards are added to the table. 
app.get('/table_update', (req, res) => {
    let response = round.next_round(human_player, ai_player, dealer);

    if(response.whose_turn === ai_player.name) {
        player_info.move = ""; 
        player_info.amount = 0; 
    }


    res.statusCode = 200;
    // console.log("table: ", response);
    res.json(JSON.stringify(response));
    res.end("request accepted");
});

//Round is ended, and gives the pot based on showdown, or a player has folded
app.get('/winner', (req, res) => {
    data_preflop.total_preflop += 1;
    data_postflop.total_preflop += 1;
    data.total_preflop += 1;

    let response = round.showdown(human_player, ai_player, dealer);
    log_functions.logWinnings(ai_player.name, response, bluff, dealer.bb.bb_size, ai_player.current_bet, hasBluffed);
    // console.log("winner ", response);
    game_info.pot_before_player = dealer.bb.bb_size + dealer.bb.bb_size/2;
    res.statusCode = 200;
    res.json(JSON.stringify(response));
    res.end("request accepted");
});

app.get('/new_game', (req, res) => {
    res.statusCode = 301;
    res.redirect("index.html");
    res.end("request accepted");
});

app.listen(port, () => console.log("Server is running..."));