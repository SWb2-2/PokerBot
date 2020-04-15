const Card = require("../../website/js/classes/card");
const game = require("../../website/js/game");
const Player = require("../../website/js/classes/player");

describe("Create startup for game", () => {
    test("Giving cards to players", () => {
        document.body.innerHTML = '<div id="bot-cards"><div id="card-back"></div><div id="card-back"></div></div><div id="open-cards"><div id="card-back"></div></div><div id="player-cards"><div id="card-back"></div></div>';

        const player_cards = {client: {hand:[new Card(10,0)]}};
        
        game.giveCardsToPlayers(player_cards);

        const added_content_player = '<div id="card">10<br><img src="./Images/heart.png"></div>';
        const box_player = document.getElementById("player-cards");

        const added_content_bot = '<div id="card-back"></div>';
        const box_bot = document.getElementById("bot-cards");

        const box_table = document.getElementById("open-cards");

        expect(box_player.innerHTML).toBe(added_content_player);
        expect(box_bot.innerHTML).toBe(added_content_bot);
        expect(box_table.innerHTML).toBe("");
    });
    test("Getting players setup when player is big blind", async () => {
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

        await game.setStartup();

        expect(global.fetch.mock.calls.length).toBe(1);

        const balance_field = document.querySelector("#player-bank #balance-field strong");
        const current_bet_field = document.querySelector("#player-bank #bet strong");
        const blind_field = document.querySelector("#player-bank #blind strong");
        
        expect(balance_field.innerHTML).toBe("200$");
        expect(current_bet_field.innerHTML).toBe("10$");
        expect(blind_field.innerHTML).toBe("Big blind");

        const ai_balance_field = document.querySelector("#ai-bank #balance-field strong");
        const ai_current_bet_field = document.querySelector("#ai-bank #bet strong");
        const ai_blind_field = document.querySelector("#ai-bank #blind strong");

        expect(ai_balance_field.innerHTML).toBe("200$");
        expect(ai_current_bet_field.innerHTML).toBe("5$");
        expect(ai_blind_field.innerHTML).toBe("Small blind");

        const pot = document.querySelector("#pot");

        expect(pot.innerHTML).toBe("15$");

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
    });
    test("Getting players setup when player is small blind", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="bot-cards"><div id="card-back"></div><div id="card-back"></div></div><div id="open-cards"><div id="card-back"></div></div><div id="player-cards"><div id="card-back"></div></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div>';

        const human_player = new Player(200, "player");
        human_player.blind = "sb";
        human_player.hand = [new Card(11,3), new Card(12,3)];
        human_player.current_bet = 10;

        const ai_player = new Player(200, "robot");
        ai_player.blind = "bb";
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

        await game.setStartup();

        expect(global.fetch.mock.calls.length).toBe(1);

        const balance_field = document.querySelector("#player-bank #balance-field strong");
        const current_bet_field = document.querySelector("#player-bank #bet strong");
        const blind_field = document.querySelector("#player-bank #blind strong");
        
        expect(balance_field.innerHTML).toBe("200$");
        expect(current_bet_field.innerHTML).toBe("10$");
        expect(blind_field.innerHTML).toBe("Small blind");

        const ai_balance_field = document.querySelector("#ai-bank #balance-field strong");
        const ai_current_bet_field = document.querySelector("#ai-bank #bet strong");
        const ai_blind_field = document.querySelector("#ai-bank #blind strong");

        expect(ai_balance_field.innerHTML).toBe("200$");
        expect(ai_current_bet_field.innerHTML).toBe("5$");
        expect(ai_blind_field.innerHTML).toBe("Big blind");

        const pot = document.querySelector("#pot");

        expect(pot.innerHTML).toBe("15$");

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
    });
});