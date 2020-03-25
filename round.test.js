const round = require('./rounds/roundModule.js');
const Dealer = require('./classes/dealer.js');
const Card = require('./classes/card.js');
const Player = require('./classes/player.js');

let player1 = new Player(200);
let dealer = new Dealer;
let player2 = new Player(200);

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

test("Should return an object consisting of table_cards: 5, whose_turn: Player and end_of_game: false", () => {
    let response = round.next_round(player1, dealer);
    expect(response).toStrictEqual({
        table_cards: [], 
        whose_turn: "Player", 
        end_of_game: true});
});

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

test("When given a player who has called an opponents all-in of 200, player should have a current_bet = 180 when balance = 180", () => {
    player2.player_move.amount = 200;
    dealer.pot = 200;
    let response = round.process_move(player1, player2. dealer);
    expect(response).toStrictEqual({
        pot: 200,
        player_balance: 0,
        player_current_bet: 180,
        end_of_round: true,
        game_finished: false,
        whose_turn: 'AI'
    })
});

test("W", () => {
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
