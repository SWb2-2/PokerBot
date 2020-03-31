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
let ai_player = new Player(200);
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
    human_player.player_move.amount = req.body.amount;
    console.log(req.body.move + "   " + req.body.amount);
    res.statusCode = 200;
    let response = round.process_move(human_player, ai_player, dealer);
    console.log(response);
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
    if (req.method === "GET") {
        res.statusCode = 200;
        res.json('{"ai_move": "raise", "pot_size": 25, "ai_balance": 0, "whose_turn": "player"}');
        res.end("request accepted");
    }
});

app.get('/table_update', (req, res) => {
    if (req.method === "GET") {
        res.statusCode = 200;
        res.json('{"table_cards":[{"rank":10, "suit":2},{"rank":7, "suit":1},{"rank":3, "suit":0}], "whose_turn":"showdown"}');
        res.end("request accepted");
    }
});

app.get('/winner', (req, res) => {
    if (req.method === "GET") {
        res.statusCode = 200;
        res.json('{"player_balance":110, "ai_balance":0, "pot_size":0, "winner":"player", "ai_cards":[{"rank":3,"suit":0}, {"rank":4, "suit":3}], "player_best_hand":"flush", "ai_best_hand":"straight"}');
        res.end("request accepted");
    }
});

app.listen(port, () => console.log("Server is running..."));