const express = require("express");

const port = 3000;
const app = express();

class Card {
    constructor (rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

class Player{
    constructor(balance) {
        this.balance = balance;
        this.hand = [];
        this.current_bet = 0;
        this.blind = "";
        this.player_move = {move: "", amount: 0}; 
    }
}

const round = require('./website/js/modules/roundsModule');
const dealer_module = require("./website/js/classes/dealer");
let dealer = new dealer_module;
let human_player = new Player(200);
let ai_player = new Player(250);
human_player.name = "player";
ai_player.name = "robot";

app.use(express.static("website"));
app.use(express.json({limit:"1mb"}));

app.post('/balance', (req, res) => {
    human_player.balance = Number(req.body.balance);
    ai_player.balance = Number(req.body.balance);
    res.statusCode = 301;
    res.redirect("game.html");
    res.end("request accepted");
});

app.post('/player_move', (req, res) => {
    human_player.player_move.move = req.body.move;
    human_player.player_move.amount = Number(req.body.amount);
    res.statusCode = 200;
    let response = round.process_move(human_player, ai_player, dealer);
    console.log("player move",response);
    res.json(JSON.stringify(response));
    res.end("request completed");
});

app.get('/player_object', (req, res) => {
    if (req.method === "GET") {
        res.statusCode = 200;
        let player_object = round.pre_flop(human_player, ai_player, dealer); 
        res.json(JSON.stringify(player_object));
        res.end("request completed");
    }
});

app.get('/ai_move', (req, res) => {
    res.statusCode = 200;
    ai_player.player_move.amount = 0;
    ai_player.player_move.move = "call";

    let response = round.process_move(ai_player, human_player, dealer);
    console.log("ai move: ", response);
    res.json(JSON.stringify(response));
    res.end("request accepted");

});

app.get('/table_update', (req, res) => {
    if(human_player.player_move.move !== "all-in" && ai_player.player_move !== "all-in") {
        human_player.player_move.move = "";
        ai_player.player_move.move = "";
    }
    let response = round.next_round(human_player, ai_player, dealer);
    res.statusCode = 200;
    console.log("table: ", response);
    res.json(JSON.stringify(response));
    res.end("request accepted");

});

app.get('/winner', (req, res) => {
    let response = round.showdown(human_player, ai_player, dealer);
    console.log("winner ", response);
    let obj = {
        player_balance: response.player_balance,
        ai_balance: response.bot_balance,
        pot_size: response.pot,
        winner: response.winner,
        ai_cards: ai_player.hand,
        player_best_hand: response.player_best_hand,
        ai_best_hand: response.ai_best_hand
    }
    res.statusCode = 200;
    res.json(JSON.stringify(obj));
    //res.json('{"player_balance":110, "ai_balance":0, "pot_size":0, "winner":"player", "ai_cards":[{"rank":3,"suit":0}, {"rank":4, "suit":3}], "player_best_hand":"flush", "ai_best_hand":"straight"}');
    res.end("request accepted");

});

app.listen(port, () => console.log("Server is running..."));