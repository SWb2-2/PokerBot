const express = require("express");
const round = require('./website/js/modules/rounds');
const dealer_module = require("./website/js/classes/dealer.js");
const Player = require("./website/js/classes/player.js");
const Data = require("./website/js/classes/data.js");
const store = require("./ai/storage_function.js");
const fs = require("fs");
const port = 3000;
const app = express();

let bluff = false;
let argument = process.argv.slice(2);

for(i = 0; i < argument.length; i++) {
    if(argument[i] === "--bluff") {
        bluff = true;
        console.log("Bluff enabled...");
    }
}

let dealer = new dealer_module;
let human_player = new Player(250, "player");
let ai_player = new Player(200, "robot");
let data = new Data;
let bigBlind = 1;

app.use(express.static("website"));
app.use(express.json({limit:"1mb"}));

//Happens once, when balance is given and rediricts, to the actual game
app.post('/balance', (req, res) => {
    fs.appendFileSync('./logFiles/history_without_bluff.txt', "\n–––– NEW PLAYER ––––\n");
    human_player.balance = Number(req.body.balance);
    ai_player.balance = Number(req.body.balance);
    bigBlind = human_player.balance * 0.02; // Big blind er 2% af det balancebeløbet.
    
    res.statusCode = 301;
    res.redirect("game.html");
    res.end("request accepted");
});

//The player makes a move, and it will be stored. 
app.post('/player_move', (req, res) => {
    human_player.player_move.move = req.body.move;
    human_player.player_move.amount = Number(req.body.amount);
    
    if(dealer.table_cards.length < 3) {
        store.store_player_move(human_player.player_move, ai_player.player_move.move, dealer.pot, data);
    }
    res.statusCode = 200;
    let response = round.process_move(human_player, ai_player, dealer);
    console.log("player move",response);
    res.json(JSON.stringify(response));
    res.end("request completed");
});

//Preflop happens, and playercards, and blinds are send back. 
app.get('/player_object', (req, res) => {
    fs.appendFileSync("./logFiles/history_without_bluff.txt", "\nNew Game: ");

    res.statusCode = 200;
    let player_object = round.pre_flop(human_player, ai_player, dealer); 
    res.json(JSON.stringify(player_object));
    res.end("request completed");
});

//Calls the ai, procces the given move, and sends it back. 
app.get('/ai_move', (req, res) => {
    res.statusCode = 200;
    ai_player.player_move.amount = 5;
    ai_player.player_move.move = "raise";
    logMove("AI", ai_player.player_move, dealer.table_cards, bluff);
    
    if(dealer.table_cards.length < 3) {
        store.store_ai_move(ai_player.player_move.move, data);
    }
    let response = round.process_move(ai_player, human_player, dealer);
    console.log("ai move: ", response);
    res.json(JSON.stringify(response));
    res.end("request accepted");
});

//A round is done, and cards are added to the table. 
app.get('/table_update', (req, res) => {
    let response = round.next_round(human_player, ai_player, dealer);
    res.statusCode = 200;
    console.log("table: ", response);
    res.json(JSON.stringify(response));
    res.end("request accepted");
});

//Round is ended, and gives the pot based on showdown, or a player has folded
app.get('/winner', (req, res) => {
    data.total_preflop += 1;
    let response = round.showdown(human_player, ai_player, dealer);
    
    logWinnings(response, bluff, bigBlind);
    response.pot = 0;
    console.log("winner ", response);
    
    res.statusCode = 200;
    res.json(JSON.stringify(response));
    res.end("request accepted");
});

app.get('/new_game', (req, res) => {
    res.statusCode = 301;
    res.redirect("index.html");
    res.end("request accepted");
});

function logMove(playerName, player_action, table, bluff) {
    if(bluff === false) {
        fs.appendFileSync("./logFiles/history_without_bluff.txt", `\n${playerName} Move: ${player_action.move}, Amount: ${player_action.amount}, Round: ${table.length}`);
    } else {
        fs.appendFileSync("./logFiles/history_with_bluff.txt", `\n${playerName} Move: ${player_action.move}, Amount: ${player_action.amout}, Round: ${table.length}, Bluff: ${player_action.bluff}`);
    }
}

function logWinnings(response, bluff, bigBlind) {
    let array = fs.readFileSync("./logFiles/averageMBB.txt");
    let rep = findNumber(array.toString(), 8);
    let rep2 = findNumber(array.toString(), rep.endOfNumber + 16);
    
    let bb_won = rep.number;
    let hands_played = rep2.number;
    if(response.winner === "robot") {   
        bb_won = bb_won + ((response.pot - ai_player.current_bet) / bigBlind);
        console.log((response.pot), ai_player.current_bet); 
    } else if(response.winner !== "draw") {
        bb_won = bb_won - ((ai_player.current_bet) / bigBlind);
    } else {
        bb_won += 0;
    }
    hands_played += 1;
    let mmb = (bb_won / hands_played);
    
    if(bluff === false) {
        fs.appendFileSync('./logFiles/history_without_bluff.txt', `\nMMB: ${mmb}`);
        fs.writeFileSync('./logFiles/averageMBB.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} /`);
    } else {
        fs.appendFileSync('./logFiles/history_with_bluff.txt', `\nMMB: ${mmb}`);
        fs.writeFileSync('./logFiles/averageMBB_bluff.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} /`);
    }
}

function findNumber(array, numberSpot) {
    let amount = "";
    while(array[numberSpot] !== "/") {
        amount += array[numberSpot];
        numberSpot += 1;
    }
    return {number: Number(amount), endOfNumber: numberSpot};
}

app.listen(port, () => console.log("Server is running..."));