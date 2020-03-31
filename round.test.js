const round = require('./rounds/roundModule.js');
const Dealer = require('./classes/dealer.js');
const Card = require('./classes/card.js');
const Player = require('./classes/player.js');

/*
test("Should return an object consisting of player1, the pot = 0, and whose_turn = Player ", () => {
let response = round.pre_flop(player1, player2, dealer);
expect(response).toStrictEqual({
    client: player1,
    pot: 0,
    whose_turn: "Player"})
});


test("Should return an object consisting of table_cards: 3, whose_turn: Player and end_of_game: false", () => {
    let response = round.next_round(player1, dealer);
    expect(response).toStrictEqual({
        table_cards: 3, 
        whose_turn: "Player", 
        end_of_game: false});
});

test("Should return an object consisting of table_cards: 4, whose_turn: Player and end_of_game: false", () => {
    let response = round.next_round(player1, dealer);
    expect(response).toStrictEqual({
        table_cards: 4, 
        whose_turn: "Player", 
        end_of_game: false});
});
*/ 
/*
test("Should return an object consisting of table_cards: 5, whose_turn: Player and end_of_game: true", () => {
    let player1 = new Player(100);
    let dealer = new Dealer;

    let response = round.next_round(player1, dealer);
    expect(response).toBe({
        table_cards: [new Card, new Card, new Card, new Card, new Card], 
        whose_turn: "AI", 
        end_of_game: true
    });
});*/
/*
test("When given a player who has called an opponents raise of 20 in a round that is not river, following object should be sent", () => {
    player2.player_move.amount = 20;
    dealer.pot = 20;
    let response = round.process_move(player1, player2. dealer);
    expect(response).toStrictEqual({
        pot: 40,
        player_balance: 180,
        end_of_round: true,
        game_finished: false,
        whose_turn: 'AI'
    })
});
*/ /*
test("When given a player who has called an opponents all-in of 200, player should have a current_bet = 180 when balance = 180", () => {
    player2.player_move.amount = 200;
    dealer.pot = 200;
    let response = round.process_move(player1, player2. dealer);
    expect(response).toBe({
        pot: 200,
        player_balance: 0,
        player_current_bet: 180,
        end_of_round: true,
        game_finished: false,
        whose_turn: 'AI'
    })
});
*/

test("Player2 raises with 20 so when player1 calls, they should place a bet of 20 as well whilst ending the round", () => {
    let player1 = new Player(200);
    let dealer = new Dealer;
    let player2 = new Player(200);
    
    player1.blind = 'sb';
    player2.current_bet = 20;
    player1.current_bet = 0;
    dealer.pot = 20;
    
    player2.player_move.move = 'raise';
    player1.player_move.move = "call";
    player1.name = "Player";
    player2.name = "AI";

    let response = round.process_move(player1, player2, dealer);
    expect(response).toStrictEqual({
        pot: 40,
        player_current_bet: 20,
        player_balance: 180,
        player_move: 'call',
        player_amount: 20,
        end_of_round: true,
        game_finished: false,
        whose_turn: 'Player'
    })
});


test("Player2 is all-in with 200 in the pot, and player1 wants to call though they only have 180.", () => {
    let player1 = new Player(180);
    let dealer = new Dealer;
    let player2 = new Player(200);
    
    player1.blind = 'sb';
    player2.current_bet = 200;
    player1.current_bet = 0;
    
    dealer.pot = 200;
    player2.player_move.move = 'raise';
    player1.player_move.move = "call";
    player1.name = "Player";
    player2.name = "AI";

    let response = round.process_move(player1, player2, dealer);
    expect(response).toStrictEqual({
        pot: 380,
        player_current_bet: 180,
        player_balance: 0,
        player_move: 'All-in',
        player_amount: 180,
        end_of_round: true,
        game_finished: false,
        whose_turn: 'Player'
    })
});

test("If player1 raises, but then player2 decides to reraise so that player1 folds, then game should end, and player2 given the pot", () => {
    let player1 = new Player(190);
    let dealer = new Dealer;
    let player2 = new Player(170);
    
    player1.blind = 'sb';
    player2.current_bet = 30;
    player1.current_bet = 10;
    dealer.pot = 40;
    
    player2.player_move.move = 'raise';
    player1.player_move.move = "fold";
    player1.name = "Player";
    player2.name = "AI";
    player2.hand.push("Hello");
    let response = round.process_move(player1, player2, dealer);
    expect(response).toStrictEqual({
        player_balance: 190,
        player2_balance: 210,
        pot: 40,
        end_of_round: true,
        game_finished: true,
        winner: "AI",
        bot_hand: ["Hello"]
    })
});

test("If a player checks and the other player has not made a move yet, the round should not end", () => {
    let player1 = new Player(200);
    let dealer = new Dealer;
    let player2 = new Player(190);
    
    player1.blind = 'sb';
    player2.current_bet = 10;
    player1.current_bet = 0;
    dealer.pot = 10;
    
    player2.player_move.move = '';
    player1.player_move.move = "raise";
    player1.player_move.amount = 20;
    player1.name = "Player";
    player2.name = "AI";

    let response = round.process_move(player1, player2, dealer);
    expect(response).toStrictEqual({
        pot: 30,
        player_current_bet: 20,
        player_balance: 180,
        player_move: 'raise',
        player_amount: 20,
        end_of_round: false,
        game_finished: false,
        whose_turn: 'AI'
    })
});

test("If player reraises with 20 against an opponents original raise of 10, round should not end and the turn returns to player2.", () => {
    let player1 = new Player(190);
    let dealer = new Dealer;
    let player2 = new Player(170);
    
    player1.blind = 'sb';
    player2.current_bet = 0;
    player1.current_bet = 0;
    dealer.pot = 0;
    
    player2.player_move.move = '';
    player1.player_move.move = "check";
    player1.name = "Player";
    player2.name = "AI";

    let response = round.process_move(player1, player2, dealer);
    expect(response).toStrictEqual({
        pot: 0,
        player_current_bet: 0,
        player_balance: 190,
        player_move: 'check',
        player_amount: 0,
        end_of_round: false,
        game_finished: false,
        whose_turn: 'AI'
    })
});

test("If there are five cards on the table, and the bets are even, the game should end", () => {
    let player1 = new Player(160);
    let dealer = new Dealer;
    let player2 = new Player(150);
    dealer.table_cards = [1, 2, 3, 4, 5];
    
    player1.blind = 'sb';
    player2.current_bet = 50;
    player1.current_bet = 40;
    dealer.pot = 90;
    
    player2.player_move.move = 'raise';
    player1.player_move.move = "call";
    player1.name = "Player";
    player2.name = "AI";

    let response = round.process_move(player1, player2, dealer);
    expect(response).toStrictEqual({
        pot: 100,
        player_current_bet: 50,
        player_balance: 150,
        player_move: 'call',
        player_amount: 10,
        end_of_round: true,
        game_finished: true,
        whose_turn: 'Player'
    })
});

test("When reaching showdown while both players are All-in and player1 has more money in the pot, player2 should only twice their own income", () => {
    let player1 = new Player(0);
    let dealer = new Dealer;
    let player2 = new Player(0);
    player2.name = "AI";
    player1.name = "Player";

    dealer.pot = 200;
    player1.current_bet = 150;
    player2.current_bet = 50;
    player1.player_move.move = 'all-in';
    player2.player_move.move = 'all-in';


    player1.hand.push(new Card(2, 1), new Card(3, 2));
    player2.hand.push(new Card(10, 0), (3, 1));
    dealer.table_cards.push(new Card(10, 1), new Card(6, 1), new Card(11, 2), new Card(8, 2), new Card(9, 2));
    player1.blind = 'sb';
    
    let response = round.showdown(player1, player2, dealer);
    expect(response).toStrictEqual({
        player_balance: 100,
        bot_balance: 100,
        pot: 200,
        winner: "AI",
        no_new_game: false
    });
}); 

test("Same as above, but where the roles are switched", () => {
    let player1 = new Player(0);
    let dealer = new Dealer;
    let player2 = new Player(0);
    player2.name = "AI";
    player1.name = "Player";

    dealer.pot = 200;
    player1.current_bet = 50;
    player2.current_bet = 150;
    player1.player_move.move = 'all-in';
    player2.player_move.move = 'all-in';


    player1.hand.push(new Card(10, 0), new Card(3, 2));
    player2.hand.push(new Card(2, 0), (3, 1));
    dealer.table_cards.push(new Card(10, 1), new Card(6, 1), new Card(11, 2), new Card(8, 2), new Card(9, 2));
    player1.blind = 'sb';
    
    let response = round.showdown(player1, player2, dealer);
    expect(response).toStrictEqual({
        player_balance: 100,
        bot_balance: 100,
        pot: 200,
        winner: "Player",
        no_new_game: false
    });
}); 

test("Same principle but with a bit more random number", () => {
    let player1 = new Player(0);
    let dealer = new Dealer;
    let player2 = new Player(0);
    player2.name = "AI";
    player1.name = "Player";

    dealer.pot = 209;
    player1.current_bet = 59;
    player2.current_bet = 150;
    player1.player_move.move = 'all-in';
    player2.player_move.move = 'all-in';


    player1.hand.push(new Card(10, 0), new Card(3, 2));
    player2.hand.push(new Card(2, 0), (3, 1));
    dealer.table_cards.push(new Card(10, 1), new Card(6, 1), new Card(11, 2), new Card(8, 2), new Card(9, 2));
    player1.blind = 'sb';
    
    let response = round.showdown(player1, player2, dealer);
    expect(response).toStrictEqual({
        player_balance: 118,
        bot_balance: 91,
        pot: 209,
        winner: "Player",
        no_new_game: false
    });
}); 

test("Generally, when a player wins, they should win the entire pot, whilst the losing player's balance remains unchanged because they already put money in the pot", () => {
    let player1 = new Player(120);
    let dealer = new Dealer;
    let player2 = new Player(100);
    player2.name = "AI";
    player1.name = "Player";

    dealer.pot = 500;
    player1.current_bet = 250;
    player2.current_bet = 250;
    player1.player_move.move = 'raise';
    player2.player_move.move = 'call';


    player1.hand.push(new Card(10, 0), new Card(3, 2));
    player2.hand.push(new Card(2, 0), (3, 1));
    dealer.table_cards.push(new Card(10, 1), new Card(6, 1), new Card(11, 2), new Card(8, 2), new Card(9, 2));
    player1.blind = 'sb';
    
    let response = round.showdown(player1, player2, dealer);
    expect(response).toStrictEqual({
        player_balance: 620,
        bot_balance: 100,
        pot: 500,
        winner: "Player",
        no_new_game: false
    });
}); 

test("When both players are all in, yet their hands are equally good, their current_bet should equal their balance", () => {
    let player1 = new Player(0);
    let dealer = new Dealer;
    let player2 = new Player(0);
    player2.name = "AI";
    player1.name = "Player";

    dealer.pot = 330;
    player1.current_bet = 309;
    player2.current_bet = 21;
    player1.player_move.move = 'all-in';
    player2.player_move.move = 'all-in';


    player1.hand.push(new Card(10, 0), new Card(3, 2));
    player2.hand.push(new Card(2, 0), (3, 1));
    dealer.table_cards.push(new Card(10, 1), new Card(7, 1), new Card(11, 2), new Card(8, 2), new Card(9, 2));
    player1.blind = 'sb';
    
    let response = round.showdown(player1, player2, dealer);
    expect(response).toStrictEqual({
        player_balance: 309,
        bot_balance: 21,
        pot: 330,
        winner: "draw",
        no_new_game: false
    });
}); 