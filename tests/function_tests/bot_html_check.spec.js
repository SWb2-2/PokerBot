const Card = require("../../website/js/classes/card");
const game = require("../../website/js/game");

describe("Checking if bot HTML is updating correctly", () => {
    test("Pokerbot has checked", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';
        
        const move = "check";
        const amount = 0;

        const fetch_response = JSON.stringify({pot:0,player_balance:200,player_current_bet:0,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.decideTurn({whose_turn: "robot"});

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const call = document.getElementById("call");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Pokerbot has checked");

        expect(check.disabled).toBe(true);
        expect(check.className).toBe("button-off");
        
        expect(fold.disabled).toBe(true);
        expect(fold.className).toBe("button-off");
        
        expect(raise.disabled).toBe(true);
        expect(raise.className).toBe("button-off");

        expect(call.disabled).toBe(true);
        expect(call.className).toBe("button-off");
        
        let balance = document.querySelector("#ai-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#ai-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("0$");
        expect(balance).toBe("200$");
        expect(bet).toBe("0$");
    });
    test("Pokerbot has raised", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';
        
        const move = "raise";
        const amount = 20;

        const fetch_response = JSON.stringify({pot:20,player_balance:180,player_current_bet:20,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.decideTurn({whose_turn: "robot"});

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const call = document.getElementById("call");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Pokerbot has raised with 20");

        expect(check.disabled).toBe(true);
        expect(check.className).toBe("button-off");
        
        expect(fold.disabled).toBe(true);
        expect(fold.className).toBe("button-off");
        
        expect(raise.disabled).toBe(true);
        expect(raise.className).toBe("button-off");

        expect(call.disabled).toBe(true);
        expect(call.className).toBe("button-off");
        
        let balance = document.querySelector("#ai-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#ai-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("20$");
        expect(balance).toBe("180$");
        expect(bet).toBe("20$");
    });
    test("Pokerbot has called", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';
        
        const move = "call";
        const amount = 30;

        const fetch_response = JSON.stringify({pot:30,player_balance:170,player_current_bet:30,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.decideTurn({whose_turn: "robot"});

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const call = document.getElementById("call");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Pokerbot has called");

        expect(check.disabled).toBe(true);
        expect(check.className).toBe("button-off");
        
        expect(fold.disabled).toBe(true);
        expect(fold.className).toBe("button-off");
        
        expect(raise.disabled).toBe(true);
        expect(raise.className).toBe("button-off");

        expect(call.disabled).toBe(true);
        expect(call.className).toBe("button-off");
        
        let balance = document.querySelector("#ai-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#ai-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("30$");
        expect(balance).toBe("170$");
        expect(bet).toBe("30$");
    });
    test("Pokerbot has folded", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div><div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';
        
        const move = "fold";
        const amount = 0;

        const fetch_response = JSON.stringify({pot:0,player_balance:200,player_current_bet:0,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.decideTurn({whose_turn: "robot"});

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const call = document.getElementById("call");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Pokerbot has folded");

        expect(check.disabled).toBe(true);
        expect(check.className).toBe("button-off");
        
        expect(fold.disabled).toBe(true);
        expect(fold.className).toBe("button-off");
        
        expect(raise.disabled).toBe(true);
        expect(raise.className).toBe("button-off");

        expect(call.disabled).toBe(true);
        expect(call.className).toBe("button-off");
        
        let balance = document.querySelector("#ai-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#ai-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("0$");
        expect(balance).toBe("200$");
        expect(bet).toBe("0$");
    });
});