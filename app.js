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

class Dealer {
    constructor(){
        this.deck_cards = [];
        this.table_cards = [];
        this.pot = 0;
        }
    create_deck_of_cards() {
        for(let j = 0; j < 4; j++) {
    
            for(let i = 2; i <= 14; i++) {
                this.deck_cards.push(new Card(i, j));
            }
        }
    }
    add_table_cards(number) {

        for(let i = 0; i < number; i++) {
    
            this.table_cards.push(this.deck_cards.pop());
        }
    }
    give_hand_cards(player1, player2) {

        player1.hand.push(this.deck_cards.pop());
        player1.hand.push(this.deck_cards.pop());

        player2.hand.push(this.deck_cards.pop());
        player2.hand.push(this.deck_cards.pop());
    }
    shuffle_array() {

        let swap = 0; 
        let temp_storage;
        for(let i = 0; i < this.deck_cards.length; i++) {

            swap = Math.random() * this.deck_cards.length * this.deck_cards.length+1; 
            swap = Math.floor(swap % this.deck_cards.length);

            temp_storage = this.deck_cards[i];
            this.deck_cards[i] = this.deck_cards[swap];
            this.deck_cards[swap] = temp_storage;
        }
    }
    new_game(player1, player2) {

        this.deck_cards = [];
        this.table_cards = [];
        this.pot = 0; 
        player1.current_bet = 0; 
        player2.current_bet = 0;
        // Ny addition til new_game metoden herunder:
        player1.hand = [];
        player2.hand = [];
        
        player1.player_move.move = "";
        player2.player_move.move = "";
        
    }
    give_pot(player1, player2, equal) {
        if(player2 === undefined) {
            player1.balance += this.pot;
        // Denne else-if sørger for, at hvis en spiller har called en all-in, hvor all-in var større end deres egen balance,
        // så kan denne spiller ikke modtage mere end det dobbelte af det, de selv har satset. 
        } else if(player1.player_move.move === 'all-in' && player2.player_move.move === 'all-in') {
            // I tilfælde af, at begge spillere har lige gode hænder, returneres deres bets bare tilbage til balancen. 
            if(equal === true) {
                player1.balance = player1.current_bet;
                player2.balance = player2.current_bet;

            } else {
                let leftovers = player2.current_bet - player1.current_bet;                                   
                player1.balance += player2.current_bet - leftovers + player1.current_bet;
                player2.balance += leftovers;

            }
        } else { //Grundet hvis begge har lige gode hænder. 
            player1.balance += this.pot/2;
            player2.balance += this.pot/2;
        }
    }
    end_betting_round(player1, player2) { 
        // Ny addition til metodens logiske udtryk. Dette er for at sikre, at spillet ikke slutter, når den med det første træk checker
        if(player1.current_bet === player2.current_bet && (player1.player_move.move !== "" && player2.player_move.move !== "")) {
            // this.pot += player1.current_bet + player2.current_bet;
            // player1.current_bet = 0;
            // player2.current_bet = 0;
            return true;
        }
        if(player1.player_move.move === 'all-in' && player2.player_move.move !== "" || player2.player_move.move === "All-in") {
            this.pot = player1.current_bet + player2.current_bet;
            return true;
        }
        return false;
    }

    // Prop indtil videre
    make_blind(player1, player2) {
        player1.blind = "sb";
        player2.blind = "bb";
    }
    
    get_winner(player1, player2){

        return player1;
    }

}

const round = require('./website/js/modules/roundsModule');
let dealer = new Dealer;
let human_player = new Player(200);
let ai_player = new Player(200);
human_player.name = "Player";
ai_player.name = "AI";

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
        let player_objekt = round.pre_flop(human_player, ai_player, dealer); 
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