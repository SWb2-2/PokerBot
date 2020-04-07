const rounds = require("../website/js/modules/rounds");
const Player = require("../website/js/classes/player");
const Dealer = require("../website/js/classes/dealer");
const Card = require("../website/js/classes/card");

describe("Play rounds in game", () => {
    test("Pre-flop round client setup", () => {
        const name = "player";
        const balance = 200;
        const human_blind = "bb";
        const blind = 10;
        const move = {move: "", amount: 0};

        const human_player = new Player(balance, "player");
        const ai_player = new Player(balance, "robot");
        const dealer_here = new Dealer();

        const pre_flop = rounds.pre_flop(human_player, ai_player, dealer_here);

        expect(pre_flop.client.name).toBe(name);
        expect(pre_flop.client.balance).toBe((balance-blind));
        expect(pre_flop.client.current_bet).toBe(blind);
        expect(pre_flop.client.blind).toBe(human_blind);
        expect(pre_flop.client.player_move).toEqual(move);
    });
    test("Pre-flop round client setup", () => {
        const name = "robot";
        const balance = 200;
        const ai_blind = "sb";
        const blind = 5;
        const move = {move: "", amount: 0};

        const human_player = new Player(balance, "player");
        const ai_player = new Player(balance, "robot");
        const dealer_here = new Dealer();

        const pre_flop = rounds.pre_flop(human_player, ai_player, dealer_here);

        expect(pre_flop.bot.name).toBe(name);
        expect(pre_flop.bot.balance).toBe((balance-blind));
        expect(pre_flop.bot.current_bet).toBe(blind);
        expect(pre_flop.bot.blind).toBe(ai_blind);
        expect(pre_flop.bot.player_move).toEqual(move);
    });
    test("Pre-flop round generel setup", () => {
        const balance = 200;
        const pot = 15;
        const turn = "robot";

        const human_player = new Player(balance, "player");
        const ai_player = new Player(balance, "robot");
        const dealer_here = new Dealer();

        const pre_flop = rounds.pre_flop(human_player, ai_player, dealer_here);

        expect(pre_flop.pot).toBe(pot);
        expect(pre_flop.whose_turn).toBe(turn);
    });
    test("Flop round setup", () => {
        const number_of_cards = 3;

        const balance = 200;

        human_player = new Player(balance, "player");
        ai_player = new Player(balance, "robot");
        dealer_here = new Dealer();

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards);        
    });
    test("Turn round setup", () => {
        const number_of_cards = 4;

        const balance = 200;

        human_player = new Player(balance, "player");
        ai_player = new Player(balance, "robot");
        dealer_here = new Dealer();
        const card = new Card(10,3);
        const table_cards = [card, card, card];
        dealer_here.table_cards = table_cards;

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards);        
    });
    test("River round setup", () => {
        const number_of_cards = 5;

        const balance = 200;

        human_player = new Player(balance, "player");
        ai_player = new Player(balance, "robot");
        dealer_here = new Dealer();
        const card = new Card(10,3);
        const table_cards = [card, card, card, card];
        dealer_here.table_cards = table_cards;

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards);        
    });
});