const Card = require("../../website/js/classes/card");
const game = require("../../website/js/game");
const Player = require("../../website/js/classes/player");

describe("Ending game correctly", () => {
    beforeEach(() => {
        window.confirm = () => {return true};
        window.alert = jest.fn();

        delete window.location;

        window.location = {
            href: "index.html"
        };
    });
    test("Get winner and devide pot, when someone folded", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="pot">0$</div><div id="bot-cards"></div><div id="open-cards"><div id="card-back"></div></div><div id="player-cards"><div id="card-back"></div></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div>';

        const fetch_response = JSON.stringify({player_balance: 0, bot_balance: 200, pot: 0, winner: "robot"});

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

        await game.decideTurn({whose_turn: "showdown"});

        expect(global.fetch.mock.calls.length).toBe(2)

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const call = document.getElementById("call");

        expect(check.disabled).toBe(true);
        expect(check.className).toBe("button-off");
        
        expect(fold.disabled).toBe(true);
        expect(fold.className).toBe("button-off");
        
        expect(raise.disabled).toBe(true);
        expect(raise.className).toBe("button-off");

        expect(call.disabled).toBe(true);
        expect(call.className).toBe("button-off");

        const bot_cards = document.querySelector("#bot-cards");
        
        expect(bot_cards.innerHTML).toBe('');

        const balance_field = document.querySelector("#player-bank #balance-field strong");
        const current_bet_field = document.querySelector("#player-bank #bet strong");
        
        expect(balance_field.innerHTML).toBe("0$");
        expect(current_bet_field.innerHTML).toBe("0$");

        const ai_balance_field = document.querySelector("#ai-bank #balance-field strong");
        const ai_current_bet_field = document.querySelector("#ai-bank #bet strong");

        expect(ai_balance_field.innerHTML).toBe("200$");
        expect(ai_current_bet_field.innerHTML).toBe("0$");

        const pot = document.querySelector("#pot");

        expect(pot.innerHTML).toBe("0$");
    });
    test("Get winner and devide pot, when someone won", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="pot">0$</div><div id="bot-cards"><div id="card-back"></div><div id="card-back"></div></div><div id="open-cards"><div id="card-back"></div></div><div id="player-cards"><div id="card-back"></div></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div>';

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

        await game.decideTurn({whose_turn: "showdown"});

        expect(global.fetch.mock.calls.length).toBe(2)

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const call = document.getElementById("call");

        expect(check.disabled).toBe(true);
        expect(check.className).toBe("button-off");
        
        expect(fold.disabled).toBe(true);
        expect(fold.className).toBe("button-off");
        
        expect(raise.disabled).toBe(true);
        expect(raise.className).toBe("button-off");

        expect(call.disabled).toBe(true);
        expect(call.className).toBe("button-off");

        const bot_cards = document.querySelector("#bot-cards");
        
        expect(bot_cards.innerHTML).toBe('<div id="card">10<br><img src="./Images/heart.png"></div>');

        const balance_field = document.querySelector("#player-bank #balance-field strong");
        const current_bet_field = document.querySelector("#player-bank #bet strong");
        
        expect(balance_field.innerHTML).toBe("0$");
        expect(current_bet_field.innerHTML).toBe("0$");

        const ai_balance_field = document.querySelector("#ai-bank #balance-field strong");
        const ai_current_bet_field = document.querySelector("#ai-bank #bet strong");

        expect(ai_balance_field.innerHTML).toBe("200$");
        expect(ai_current_bet_field.innerHTML).toBe("0$");

        const pot = document.querySelector("#pot");

        expect(pot.innerHTML).toBe("0$");
    });
    test("Game continues if both robots and players balance is not 0", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="bot-cards"><div id="card-back"></div><div id="card-back"></div></div><div id="open-cards"><div id="card-back"></div></div><div id="player-cards"><div id="card-back"></div></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div>';

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

        await game.checkBank(human_player.balance, ai_player.balance);

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(window.alert.mock.calls.length).toBe(1);
    });
    test("Game ends if robots balance is 0", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div>';

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    redirected: true,
                    url: "index.html"
                });
            });
            return res;
        });

        await game.checkBank(100, 0);

        const jumbotron = document.querySelector("#jumbo-text");

        expect(jumbotron.innerHTML).toBe("You won!");

        expect(global.fetch.mock.calls.length).toBe(1)
        expect(window.location.href).toBe("index.html");
    });
    test("Game ends if players balance is 0", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div>';

        global.fetch = jest.fn().mockImplementation(() => {
            var res = new Promise((resolve, reject) => {
                resolve({
                    redirected: true,
                    url: "index.html"
                });
            });
            return res;
        });

        await game.checkBank(0, 100);

        const jumbotron = document.querySelector("#jumbo-text");

        expect(jumbotron.innerHTML).toBe("Game over, Pokerbot won!");

        expect(global.fetch.mock.calls.length).toBe(1)
        expect(window.location.href).toBe("index.html");
    });
});