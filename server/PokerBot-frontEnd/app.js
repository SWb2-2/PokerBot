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

/*
const rootFile = process.cwd();
console.log(rootFile);

function findPath(reqPath) {
    reqPath = directory + reqPath;
    //sætter de to stier sammen, nemlig fra serveren og ned til anmodede sti, som gerne skal ligge i directory Public
    let pathFromServer = path.join(rootFile, path.normalize(reqPath));
    return pathFromServer;
}

// Når et bestemt filnavn anmodes bruges denne funktion til at frembringe den til klienten fra serveren
function fileResponse(fileReq, response) {
    // find stien til den anmodede side...
    reqPath = findPath(fileReq);
    // Læs siden og se om alt er okay.
    fs.readFile(reqPath, (error, data) => {
        // Hvis ikke, returner en respons der siger, at siden ej kunne findes.
        if (error) {
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/txt');
            response.write("Sorry, could not find the requested site " + reqPath + ". Error: " + error);
            response.end();
        }
        // Ellers, hvis alt kører som det skal, skal klienten nu have siden. 
        // Dette gøres ved at udskrive data læst gennem fs via response.write
        else {
            response.statusCode = 200;
            response.setHeader('Content-Type', defineFileType(fileReq));
            response.write(data);
            response.end('\n');
        }
    });
}
// Finder ud af hvilken filtype der søges og sætter respons content-type som følge deraf
function defineFileType(fileName) {
    // Objekt med mulige filtyper:
    let listOfTypes = {
        'txt': 'text/txt',
        'css': 'text/css',
        'js': 'text/js',
        'html': 'text/html',
        'json': 'application/json'
    };
    // Filtype defineres af bogstaver efter punktum. Derfor søges index af dette i filnavnet.
    let startPoint = String(fileName).indexOf(".");
    let end = String(fileName).length;
    // Her laves subarray med slice, hvor kun fildefinitionen, altså det efter punktummet er med. 
    let fileEndName = Array.from(fileName).slice(startPoint + 1, end);
    console.log(fileEndName.join(""));
    // Slutteligt bruges metoden join til at slutte arrayet sammen igen, således der ikke er kommaer.
    // Og der søges i objektet, om der er en filtype der passer.
    return (listOfTypes[fileEndName.join('')] || console.log("Should not be here"));
}

*/
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
/*
app.get('/game.html', (req, res) => {
    fileResponse('game.html', res);
});
*/
app.post('/player_turn', (req, res) => {
    console.log(req.body);
    player1.player_move.move = req.body.move;
    player1.player_move.amount = Number(req.body.amount);
    
    let answer = round.process_move(player1, player2, dealer);
    console.log(answer);
    /*res.json({
        status: 201,
        note: "Post was successful",
        message: "Added: " + JSON.stringify(req.body),
        data: answer
    });*/
    res.statusCode = 200;
    res.send(answer);
    res.end();
/*
    answer = round.process_move(player1, player2, dealer);
    res.send(JSON.stringify(answer));
    res.statusCode = 200;
    res.end("request accepted");
    */
});
// Dette skal omskrives til bare at bruge req.body
app.post('/bot_turn', (req, res) => {
    let body = [];
    console.log(req.body);
    // Make a it function 
    if (req.method === "POST") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        req.on("data", (chunck) => {
            body.push(chunck);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            console.log(body);
        });
        console.log(body);
        // Call AI function here to get move and amount. 
        body["move"] = player2.player_move.move;
        body["amount"] = player2.player_move.amount;
        answer = round.process_move(player2, player1, dealer);
        res.send(JSON.stringify(answer));
        res.statusCode = 200;
        res.end("request accepted");
    }

});

app.get('/preflop', (req, res) => {
    
    let answer = round.pre_flop(player1, player2, dealer);
    res.send(JSON.stringify(answer));
    res.statusCode = 200;
    res.end("request accepted");
});
// Dette skal omskrives til bare at bruge req.body
app.get('/next_round', (req, res) => {
    let body = [];
    console.log(req.body);
   
        res.writeHead(200, {
            "Content-Type": "*",
        });
        req.on("data", (chunck) => {
            body.push(chunck);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            console.log(body);
        });
        console.log(body);
        answer = round.next_round(player1, player2, dealer);
        res.send(JSON.stringify(answer));
        res.statusCode = 200;
        res.end("request accepted");
});
// Dette skal omskrives til bare at bruge req.body
app.get('/showdown', (req, res) => {
    let body = [];
    console.log(req.body);
    
        res.writeHead(200, {
            "Content-Type": "*",
        });
        req.on("data", (chunck) => {
            body.push(chunck);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            console.log(body);
        });
        console.log(body);
        body["move"] = player1.player_move.move;
        body["amount"] = player1.player_move.amount;
        answer = round.showdown(player1, player2, dealer);
        res.send(JSON.stringify(answer));
        res.statusCode = 200;
        res.end("request accepted");
});

app.listen(port, () => console.log("Server is running..."));

