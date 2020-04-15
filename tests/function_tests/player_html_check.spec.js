const Card = require("../../website/js/classes/card");
const game = require("../../website/js/game");

describe("Checking if players HTML is updating correctly", () => {
    beforeEach(() => {
        window.confirm = () => {return true};
        window.alert = jest.fn();
    });
    test("Players turn with last move 'check'", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const last_move = {player_move: "check", whose_turn: "player"};

        await game.decideTurn(last_move);

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Your turn");

        expect(check.disabled).toBe(false);
        expect(check.className).toBe("button-on");
        
        expect(fold.disabled).toBe(false);
        expect(fold.className).toBe("button-on");
        
        expect(raise.disabled).toBe(false);
        expect(raise.className).toBe("button-on");
    });
    test("Players turn with last move 'raise'", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const last_move = {player_move: "raise", whose_turn: "player"};

        await game.decideTurn(last_move);

        const fold = document.getElementById("fold");
        const call = document.getElementById("call");
        const raise = document.getElementById("raise");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Your turn");

        expect(call.disabled).toBe(false);
        expect(call.className).toBe("button-on");
        
        expect(fold.disabled).toBe(false);
        expect(fold.className).toBe("button-on");
        
        expect(raise.disabled).toBe(false);
        expect(raise.className).toBe("button-on");
    });
    test("Players turn with last move 'call'", async() => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const last_move = {player_move: "call", whose_turn: "player"};

        await game.decideTurn(last_move);

        const check = document.getElementById("check");
        const fold = document.getElementById("fold");
        const raise = document.getElementById("raise");
        const jumbotron_text = document.getElementById("jumbo-text");

        expect(jumbotron_text.innerHTML).toBe("Your turn");

        expect(check.disabled).toBe(false);
        expect(check.className).toBe("button-on");
        
        expect(fold.disabled).toBe(false);
        expect(fold.className).toBe("button-on");
        
        expect(raise.disabled).toBe(false);
        expect(raise.className).toBe("button-on");
    });
    test("Player has checked", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';

        const move = "check";
        const amount = 0;
        window.prompt = () => {return amount};
        
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

        await game.makePlayerMove(move);

        let balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#player-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("0$");
        expect(balance).toBe("200$");
        expect(bet).toBe("0$");
    });
    test("Player has called", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';

        const move = "call";
        const amount = 20;
        window.prompt = () => {return amount};
        
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

        await game.makePlayerMove(move);

        let balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#player-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("20$");
        expect(balance).toBe("180$");
        expect(bet).toBe("20$");
    });
    test("Player has decided not to call", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';

        window.confirm = () => {return false};

        const move = "call";
        const amount = 20;
        window.prompt = () => {return amount};
        
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

        await game.makePlayerMove(move);

        let balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#player-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(0);
        expect(pot).toBe("0$");
        expect(balance).toBe("200$");
        expect(bet).toBe("0$");
    });
    test("Player has raised with too much", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';

        const move = "raise";
        const amount = 300;
        window.prompt = () => {return amount};
        
        const fetch_response = JSON.stringify({pot:200,player_balance:0,player_current_bet:200,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.makePlayerMove(move);

        let balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#player-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(window.alert.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls.length).toBe(0);
        expect(pot).toBe("0$");
        expect(balance).toBe("200$");
        expect(bet).toBe("0$");
    });
    test("Player has raised with an okay amount", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';

        const move = "raise";
        const amount = 200;
        window.prompt = () => {return amount};
        
        const fetch_response = JSON.stringify({pot:200,player_balance:0,player_current_bet:200,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.makePlayerMove(move);

        let balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#player-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(pot).toBe("200$");
        expect(balance).toBe("0$");
        expect(bet).toBe("200$");
    });
    test("Player has decided not to raise", async () => {
        document.body.innerHTML = '<div id="pot">0$</div><div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Big blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div><div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>200$</strong></p></div>';

        window.confirm = () => {return false};

        const move = "raise";
        const amount = 200;
        window.prompt = () => {return amount};
        
        const fetch_response = JSON.stringify({pot:200,player_balance:0,player_current_bet:200,player_move:move,player_amount:amount,whose_turn:"test"});

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

        await game.makePlayerMove(move);

        let balance = document.querySelector("#player-bank #balance-field strong").innerHTML;
        let bet = document.querySelector("#player-bank #bet strong").innerHTML;
        let pot = document.querySelector("#pot").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(0);
        expect(pot).toBe("0$");
        expect(balance).toBe("200$");
        expect(bet).toBe("0$");
    });
});