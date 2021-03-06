const rounds = require("../../website/js/modules/rounds");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");
const Card = require("../../website/js/classes/card");

describe("Play rounds in game", () => {
    test("Pre-flop round blind is not predetermined", () => {
        const name = "player";
        const balance = 200;
        const human_blind = "bb";
        const blind = 4;
        const move = {move: "", amount: 0};

        const human_player = new Player(balance, "player");

        const ai_name = "robot";
        const ai_balance = 200;
        const ai_blind = "sb";
        const ai_blind_amount = 2;
        const ai_move = {move: "", amount: 0};

        const ai_player = new Player(ai_balance, "robot");
        // Da sb = 1/2 bb og bb = 2% af balance, som er 200, må samlet pot være 6.
        const pot = 6;
        const turn = "robot";

        const dealer_here = new Dealer();

        const pre_flop = rounds.pre_flop(human_player, ai_player, dealer_here);

        expect(pre_flop.client.name).toBe(name);
        expect(pre_flop.client.balance).toBe((balance-blind));
        expect(pre_flop.client.current_bet).toBe(blind);
        expect(pre_flop.client.blind).toBe(human_blind);
        expect(pre_flop.client.player_move).toEqual(move);

        expect(pre_flop.bot.name).toBe(ai_name);
        expect(pre_flop.bot.balance).toBe((ai_balance-ai_blind_amount));
        expect(pre_flop.bot.current_bet).toBe(ai_blind_amount);
        expect(pre_flop.bot.blind).toBe(ai_blind);
        expect(pre_flop.bot.player_move).toEqual(ai_move);

        expect(pre_flop.pot).toBe(pot);
        expect(pre_flop.whose_turn).toBe(turn);
    });
    test("Pre-flop round humanplayer is bb and ai is sb", () => {
        const name = "player";
        const balance = 200;
        const human_blind = "bb";
        const blind = 4;
        const move = {move: "", amount: 0};

        const human_player = new Player(balance, "player");
        human_player.blind = "sb";

        const ai_name = "robot";
        const ai_balance = 200;
        const ai_blind = "sb";
        const ai_blind_amount = 2;
        const ai_move = {move: "", amount: 0};

        const ai_player = new Player(ai_balance, "robot");
        ai_player.blind = "bb";
        const pot = 6;
        const turn = "robot";

        const dealer_here = new Dealer();

        const pre_flop = rounds.pre_flop(human_player, ai_player, dealer_here);

        expect(pre_flop.client.name).toBe(name);
        expect(pre_flop.client.balance).toBe((balance-blind));
        expect(pre_flop.client.current_bet).toBe(blind);
        expect(pre_flop.client.blind).toBe(human_blind);
        expect(pre_flop.client.player_move).toEqual(move);

        expect(pre_flop.bot.name).toBe(ai_name);
        expect(pre_flop.bot.balance).toBe((ai_balance-ai_blind_amount));
        expect(pre_flop.bot.current_bet).toBe(ai_blind_amount);
        expect(pre_flop.bot.blind).toBe(ai_blind);
        expect(pre_flop.bot.player_move).toEqual(ai_move);

        expect(pre_flop.pot).toBe(pot);
        expect(pre_flop.whose_turn).toBe(turn);
    });
    test("Pre-flop round humanplayer is sb and ai is bb", () => {
        const name = "player";
        const balance = 200;
        const human_blind = "sb";
        const blind = 2;
        const move = {move: "", amount: 0};

        const human_player = new Player(balance, "player");
        human_player.blind = "bb";

        const ai_name = "robot";
        const ai_balance = 200;
        const ai_blind = "bb";
        const ai_blind_amount = 4;
        const ai_move = {move: "", amount: 0};

        const ai_player = new Player(ai_balance, "robot");
        ai_player.blind = "sb";

        const pot = 6;

        const turn = "player";

        const dealer_here = new Dealer();

        const pre_flop = rounds.pre_flop(human_player, ai_player, dealer_here);

        expect(pre_flop.client.name).toBe(name);
        expect(pre_flop.client.balance).toBe((balance-blind));
        expect(pre_flop.client.current_bet).toBe(blind);
        expect(pre_flop.client.blind).toBe(human_blind);
        expect(pre_flop.client.player_move).toEqual(move);

        expect(pre_flop.bot.name).toBe(ai_name);
        expect(pre_flop.bot.balance).toBe((ai_balance-ai_blind_amount));
        expect(pre_flop.bot.current_bet).toBe(ai_blind_amount);
        expect(pre_flop.bot.blind).toBe(ai_blind);
        expect(pre_flop.bot.player_move).toEqual(ai_move);

        expect(pre_flop.pot).toBe(pot);
        expect(pre_flop.whose_turn).toBe(turn);
    });
    test("Flop round setup", () => {
        const number_of_cards = 3;

        const balance = 200;

        let human_player = new Player(balance, "player");
        human_player.blind = "sb";
        let ai_player = new Player(balance, "robot");
        ai_player.blind = "bb";
        let dealer_here = new Dealer();

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards);  
        // BB moves first post-flop, thus we expect it to be the ai and not the player, even though they get to make the first move in pre-flop
        expect(flop.whose_turn).toBe("robot");
    });
    test("Turn round setup", () => {
        const number_of_cards = 4;

        const balance = 200;

        let human_player = new Player(balance, "player");
        human_player.blind = "bb";
        let ai_player = new Player(balance, "robot");
        ai_player.blind = "sb";
        let dealer_here = new Dealer();
        const card = new Card(10,3);
        const table_cards = [card, card, card];
        dealer_here.table_cards = table_cards;

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards);
        expect(flop.whose_turn).toBe("player"); 
    });
    test("River round setup", () => {
        const number_of_cards = 5;

        const balance = 200;

        let human_player = new Player(balance, "player");
        let ai_player = new Player(balance, "robot");
        let dealer_here = new Dealer();
        const card = new Card(10,3);
        const table_cards = [card, card, card, card];
        dealer_here.table_cards = table_cards;

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards); 
        expect(flop.whose_turn).toBe("robot");      
    });
    test("Showdown with both players all-in", () => {
        const number_of_cards = 5;
        const balance = 0;

        let human_player = new Player(balance, "player");
        let ai_player = new Player(balance, "robot");
        let dealer_here = new Dealer();
        const card = new Card(10,3);
        const table_cards = [card, card, card, card];
        dealer_here.table_cards = table_cards;

        const flop = rounds.next_round(human_player, ai_player, dealer_here);

        expect(human_player.player_move.move).toBe("");
        expect(ai_player.player_move.move).toBe("");
        expect(flop.table_cards.length).toBe(number_of_cards); 
        expect(flop.whose_turn).toBe("showdown");      
    });
    test("Showdown normally", () => {
        const balance = 40;
        const pot = 160;

        let human_player = new Player(balance, "player");
        human_player.player_move = {move: "call", amount: 0};
        human_player.current_bet = 70;
        
        let ai_player = new Player(balance, "robot");
        ai_player.player_move = {move: "raise", amount: 20};
        ai_player.current_bet = 90;

        let dealer_here = new Dealer();
        dealer_here.pot = pot;

        const card = new Card(10,3);
        const table_cards = [card, card, card, card, card];
        dealer_here.table_cards = table_cards;

        const process_move = rounds.process_move(human_player, ai_player, dealer_here);

        expect(process_move.pot).toBe(180);
        expect(process_move.player_balance).toBe(20);
        expect(process_move.player_current_bet).toBe(90);
        expect(process_move.player_move).toBe("call");
        expect(process_move.player_amount).toBe(20);
        expect(process_move.whose_turn).toBe("showdown");      
    });
});