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

let player_objekt = new Player(90);
player_objekt.hand = [new Card(12,3), new Card(3,0)];
player_objekt.current_bet = 10;
player_objekt.blind = "bb";

app.use(express.static("website"));
app.use(express.urlencoded({extended:false}));

app.post('/balance', (req, res) => {
    let body = [];
    if (req.method === "POST") {
        req.on("data", (chunck) => {
            body.push(chunck);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
        });
        res.statusCode = 301;
        res.redirect("game.html");
        res.end("request accepted");
    }
});

app.post('/player_move', (req, res) => {
    let body = [];
    if (req.method === "POST") {
        req.on("data", (chunck) => {
            body.push(chunck);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            console.log(body);
        });
        res.statusCode = 200;
        res.json('{"pot_size": 20, "player_balance": 85, "whose_turn": "robot"}');
        res.end("request completed");
    }
});

app.get('/player_object', (req, res) => {
    if (req.method === "GET") {
        res.statusCode = 200;
        res.json(JSON.stringify(player_objekt));
        res.end("request completed");
    }
});

app.get('/setup_object', (req, res) => {
    if (req.method === "GET") {
        res.statusCode = 200;
        res.json('{"pot_size": 15, "whose_turn": "player"}');
        res.end("request accepted");
    }
});

app.get('/ai_move', (req, res) => {
    if (req.method === "GET") {
        res.statusCode = 200;
        res.json('{"ai_move": "raise", "pot_size": 25, "ai_balance": 0, "whose_turn": "table"}');
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