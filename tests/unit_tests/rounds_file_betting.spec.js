const rounds = require("../../website/js/modules/rounds");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");

describe("Play betting rounds in game", () => {
    test("Current player has raised", () => {
        const dealer_here = new Dealer();
        dealer_here.pot = 20;

        const active_player = new Player(190, "player");
        active_player.current_bet = 10;
        active_player.player_move = {move: "raise", amount: 20};

        const inactive_player = new Player(190, "robot");
        inactive_player.current_bet = 10;
        inactive_player.player_move = {move: "", amount: 0};

        const process_move = rounds.process_move(active_player, inactive_player, dealer_here);

        expect(process_move.pot).toBe(40);
        expect(process_move.player_balance).toBe(170);
        expect(process_move.player_current_bet).toBe(30);
        expect(process_move.player_move).toBe("raise");
        expect(process_move.player_amount).toBe(20);
        expect(process_move.whose_turn).toBe("robot");
    });
    test("Current player has checked", () => {
        const dealer_here = new Dealer();
        dealer_here.pot = 20;

        const active_player = new Player(190, "player");
        active_player.current_bet = 10;
        active_player.player_move = {move: "check", amount: 0};

        const inactive_player = new Player(190, "robot");
        inactive_player.current_bet = 10;
        inactive_player.player_move = {move: "", amount: 0};

        const process_move = rounds.process_move(active_player, inactive_player, dealer_here);

        expect(process_move.pot).toBe(20);
        expect(process_move.player_balance).toBe(190);
        expect(process_move.player_current_bet).toBe(10);
        expect(process_move.player_move).toBe("check");
        expect(process_move.player_amount).toBe(0);
        expect(process_move.whose_turn).toBe("robot");
    });
    test("Current player has called", () => {
        const dealer_here = new Dealer();
        dealer_here.pot = 40;

        const active_player = new Player(190, "player");
        active_player.current_bet = 10;
        active_player.player_move = {move: "call", amount: 0};

        const inactive_player = new Player(170, "robot");
        inactive_player.current_bet = 30;
        inactive_player.player_move = {move: "raise", amount: 20};

        const process_move = rounds.process_move(active_player, inactive_player, dealer_here);

        expect(process_move.pot).toBe(60);
        expect(process_move.player_balance).toBe(170);
        expect(process_move.player_current_bet).toBe(30);
        expect(process_move.player_move).toBe("call");
        expect(process_move.player_amount).toBe(20);
        expect(process_move.whose_turn).toBe("table");
    });
    test("Current player has called an all-in", () => {
        const dealer_here = new Dealer();
        dealer_here.pot = 200;

        const active_player = new Player(170, "player");
        active_player.current_bet = 10;
        active_player.player_move = {move: "call", amount: 0};

        const inactive_player = new Player(190, "robot");
        inactive_player.current_bet = 190;
        inactive_player.player_move = {move: "raise", amount: 185};

        const process_move = rounds.process_move(active_player, inactive_player, dealer_here);

        expect(process_move.pot).toBe(370);
        expect(process_move.player_balance).toBe(0);
        expect(process_move.player_current_bet).toBe(180);
        expect(process_move.player_move).toBe("call");
        expect(process_move.player_amount).toBe(170);
        expect(process_move.whose_turn).toBe("table");
    });
    test("Current player has folded", () => {
        const dealer_here = new Dealer();
        dealer_here.pot = 20;

        const active_player = new Player(190, "player");
        active_player.current_bet = 10;
        active_player.player_move = {move: "fold", amount: 0};

        const inactive_player = new Player(190, "robot");
        inactive_player.current_bet = 10;
        inactive_player.player_move = {move: "", amount: 0};

        const process_move = rounds.process_move(active_player, inactive_player, dealer_here);

        expect(process_move.pot).toBe(20);
        expect(process_move.player_balance).toBe(190);
        expect(process_move.player_current_bet).toBe(10);
        expect(process_move.player_move).toBe("fold");
        expect(process_move.player_amount).toBe(0);
        expect(process_move.whose_turn).toBe("showdown");
    });
});