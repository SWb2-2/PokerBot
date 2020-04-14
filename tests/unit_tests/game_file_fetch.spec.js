const Card = require("../../website/js/classes/card");
const Player = require("../../website/js/classes/player");
const game = require("../../website/js/game");

describe("Checking that fetch is being called and return is gotten", () => {
    test("Getting cards for table", async () => {
        const card_now = new Card(14,0);
        const fetch_response = JSON.stringify({table_cards: [card_now],whose_turn: "test"});

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    json: function() {
                        return fetch_response;
                    }
                });
            });
            return res;
        });

        const return_from_function = await game.getTableCards();

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(return_from_function.table_cards[0]).toEqual(card_now);
        expect(return_from_function.whose_turn).toBe("test");
    });
    test("Getting player setup", async () => {
        const human_player = new Player(200, "player");
        human_player.blind = "bb";
        human_player.hand = [new Card(11,3), new Card(12,3)];
        human_player.current_bet = 10;

        const ai_player = new Player(200, "robot");
        ai_player.blind = "sb";
        ai_player.hand = [new Card(13,3), new Card(14,3)];
        ai_player.current_bet = 5;
        
        const fetch_response = JSON.stringify({client: human_player, bot: ai_player, pot: 15, whose_turn: "test"});

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    json: function() {
                        return fetch_response;
                    }
                });
            });
            return res;
        });

        const return_from_function = await game.getPlayerSetup();

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(return_from_function.client).toEqual(human_player);
        expect(return_from_function.bot).toEqual(ai_player);
        expect(return_from_function.pot).toBe(15);
        expect(return_from_function.whose_turn).toBe("test");
    });
    test("Sending players move and receiving player stats", async () => {
        const fetch_response = JSON.stringify({pot:200,player_balance:10,player_current_bet:200,player_move:"check",player_amount:0,whose_turn:"test"});

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    json: function() {
                        return fetch_response;
                    }
                });
            });
            return res;
        });

        const return_from_function = await game.sendPlayerMove({move:"check", amount: 0});

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(return_from_function.pot).toBe(200);
        expect(return_from_function.player_balance).toBe(10);
        expect(return_from_function.player_current_bet).toBe(200);
        expect(return_from_function.player_move).toBe("check");
        expect(return_from_function.player_amount).toBe(0);
        expect(return_from_function.whose_turn).toBe("test");
    });
    test("Getting pokerbots last move and stats", async () => {
        const fetch_response = JSON.stringify({pot:200,player_balance:10,player_current_bet:200,player_move:"check",player_amount:0,whose_turn:"test"});

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    json: function() {
                        return fetch_response;
                    }
                });
            });
            return res;
        });

        const return_from_function = await game.getPokerbotPlay();

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(return_from_function.pot).toBe(200);
        expect(return_from_function.player_balance).toBe(10);
        expect(return_from_function.player_current_bet).toBe(200);
        expect(return_from_function.player_move).toBe("check");
        expect(return_from_function.player_amount).toBe(0);
        expect(return_from_function.whose_turn).toBe("test");
    });
    test("Getting winner, the players best hand and stats", async () => {
        const fetch_response = JSON.stringify({player_balance: 0,bot_balance: 200,pot: 0,winner: "robot",player_best_hand: "straight",ai_best_hand: "flush",ai_cards: [new Card(10,0)]});

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    json: function() {
                        return fetch_response;
                    }
                });
            });
            return res;
        });

        const return_from_function = await game.getEndOfGame();

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(return_from_function.pot).toBe(0);
        expect(return_from_function.player_balance).toBe(0);
        expect(return_from_function.bot_balance).toBe(200);
        expect(return_from_function.winner).toBe("robot");
        expect(return_from_function.player_best_hand).toBe("straight");
        expect(return_from_function.ai_best_hand).toBe("flush");
        expect(return_from_function.ai_cards[0]).toEqual(new Card(10,0))
    });
    test("Changing back to index page", async () => {
        window.confirm = () => {return true};

        delete window.location;

        window.location = {
            href: "index.html"
        };

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    redirected: true,
                    url: "index.html"
                });
            });
            return res;
        });

        await game.newGame();

        expect(global.fetch.mock.calls.length).toBe(1)
        expect(window.location.href).toBe("index.html");
    });
});