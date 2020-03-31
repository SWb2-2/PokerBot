const express = require("express");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const port = 3000;

const app = express();
let body = [];

class Player{
    constructor(balance) {
        this.balance = balance;
        this.hand = [];
        this.current_bet = 0;
        this.blind = "", // "bb", "sb"
        this.player_move = {move: "", amount: 0}; 
    }
};

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

class Card {
    constructor (rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

const round = require('./game/js/rounds/roundsModule');
let dealer = new Dealer;
let player1 = new Player(200);
let player2 = new Player(200);
player1.name = "Player";
player2.name = "AI";
//app.use(express.static("website"));
const directory = 'website/';
app.use(express.json({limit:"1mb"}));

// Player turn, når der sendes objekt fra 
app.use(express.static('game/'));

app.post('/', (req, res) => {
    player1.balance = Number(req.body.balance);
    player2.balance = Number(req.body.balance);
    console.log(req.body);
    res.json({
        status: 201,
        note: "Post was successful",
        message: `Player balance is now ${JSON.stringify(req.body.balance)}`
    });
    res.end();
})

app.post('/player_turn', (req, res) => {
    console.log(req.body);
    player1.player_move.move = req.body.move;
    player1.player_move.amount = Number(req.body.amount);
    
    let answer = round.process_move(player1, player2, dealer);
    console.log(answer);
    res.statusCode = 200;
    res.send(answer);
    res.end();
});
// Dette skal omskrives til bare at bruge req.body
app.get('/bot_turn', (req, res) => {
    // Call AI function. 
    answer = round.process_move(player2, player1, dealer);
    res.send(JSON.stringify(answer));
    res.statusCode = 200;
    res.end("request accepted");
});

app.get('/preflop', (req, res) => {
    
    let answer = round.pre_flop(player1, player2, dealer);
    res.send(JSON.stringify(answer));
    res.statusCode = 200;
    res.end("request accepted");
});

app.get('/next_round', (req, res) => {
    answer = round.next_round(player1, dealer);
    res.send(answer);
    res.statusCode = 200;
    res.end("request accepted");
});

app.get('/showdown', (req, res) => {
    answer = round.showdown(player1, player2, dealer);
    res.send(JSON.stringify(answer));
    res.statusCode = 200;
    res.end("request accepted");
});

app.listen(port, () => console.log("Server is running..."));

