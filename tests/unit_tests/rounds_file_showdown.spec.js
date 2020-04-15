const rounds = require("../../website/js/modules/rounds");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");
const Card = require("../../website/js/classes/card");

describe("Playing showdown", () => {
    test("Player has folded", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.current_bet = 10;
        human_player.player_move = {move: "fold", amount: 0};

        let ai_player = new Player(balance, "robot");
        ai_player.current_bet = 10;

        let dealer_here = new Dealer();
        dealer_here.pot = 20;

        const showdown = rounds.showdown(human_player, ai_player, dealer_here);

        expect(showdown.player_balance).toBe(190);
        expect(showdown.bot_balance).toBe(210);
        expect(showdown.pot).toBe(0);
        expect(showdown.winner).toBe(ai_player.name);
    });
    test("Robot has folded", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.current_bet = 10;

        let ai_player = new Player(balance, "robot");
        ai_player.current_bet = 10;
        ai_player.player_move = {move: "fold", amount: 0};

        let dealer_here = new Dealer();
        dealer_here.pot = 20;

        const showdown = rounds.showdown(human_player, ai_player, dealer_here);

        expect(showdown.player_balance).toBe(210);
        expect(showdown.bot_balance).toBe(190);
        expect(showdown.pot).toBe(0);
        expect(showdown.winner).toBe(human_player.name);
    });
    test("Player has won", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.current_bet = 10;
        human_player.hand = [new Card(14, 1), new Card(13,1)];

        let ai_player = new Player(balance, "robot");
        ai_player.current_bet = 10;
        ai_player.hand = [new Card(2,2), new Card(3,2)];

        let dealer_here = new Dealer();
        dealer_here.pot = 20;
        dealer_here.table_cards = [new Card(12,1), new Card(10,1), new Card(9, 1), new Card(4,1), new Card(5,0)];

        const showdown = rounds.showdown(human_player, ai_player, dealer_here);

        expect(showdown.player_balance).toBe(210);
        expect(showdown.bot_balance).toBe(190);
        expect(showdown.pot).toBe(0);
        expect(showdown.winner).toBe(human_player.name);
        expect(showdown.player_best_hand).toBe("flush");
        expect(showdown.ai_best_hand).toBe("high card");
        expect(showdown.ai_cards).toEqual(ai_player.hand);
    });
    test("Robot has won", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.current_bet = 10;
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.current_bet = 10;
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.pot = 20;
        dealer_here.table_cards = [new Card(12,1), new Card(10,1), new Card(9, 1), new Card(4,0), new Card(5,0)];

        const showdown = rounds.showdown(human_player, ai_player, dealer_here);

        expect(showdown.player_balance).toBe(190);
        expect(showdown.bot_balance).toBe(210);
        expect(showdown.pot).toBe(0);
        expect(showdown.winner).toBe(ai_player.name);
        expect(showdown.player_best_hand).toBe("high card");
        expect(showdown.ai_best_hand).toBe("flush");
        expect(showdown.ai_cards).toEqual(ai_player.hand);
    });
    test("It is a draw", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.current_bet = 10;
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.current_bet = 10;
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.pot = 20;
        dealer_here.table_cards = [new Card(12,3), new Card(10,3), new Card(9, 3), new Card(4,3), new Card(5,3)];

        const showdown = rounds.showdown(human_player, ai_player, dealer_here);

        expect(showdown.player_balance).toBe(200);
        expect(showdown.bot_balance).toBe(200);
        expect(showdown.pot).toBe(0);
        expect(showdown.winner).toBe("draw");
        expect(showdown.player_best_hand).toBe("flush");
        expect(showdown.ai_best_hand).toBe("flush");
        expect(showdown.ai_cards).toEqual(ai_player.hand);
    });
});