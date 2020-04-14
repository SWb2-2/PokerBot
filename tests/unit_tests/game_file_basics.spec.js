const game = require("../../website/js/game");

describe("Checking basic functions in game frontend", () => {
    test("Sleep function runs", async() => {
        const res = await game.sleep(1);

        expect(res).toBe(undefined);
    });
    test("Inputting bot stats", () => {
        document.body.innerHTML = '<div id="ai-bank"><h2>Pokerbot stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div>';

        const balance = 300;
        const current_bet = 20;
        const blind = "Big blind";

        game.inputBotStats(balance, current_bet, blind);

        const balance_field = document.querySelector("#balance-field strong");
        const current_bet_field = document.querySelector("#bet strong");
        const blind_field = document.querySelector("#blind strong");

        expect(balance_field.innerHTML).toBe("300$");
        expect(current_bet_field.innerHTML).toBe("20$");
        expect(blind_field.innerHTML).toBe("Big blind");
    });
    test("Inputting player stats", () => {
        document.body.innerHTML = '<div id="player-bank"><h2>Player stats</h2><p id="bet">Current bet: <strong>0$</strong></p><p id="blind">Blind: <strong>Small blind</strong></p><p id="balance-field">Balance: <strong>100$</strong></p></div>';

        const balance = 300;
        const current_bet = 20;
        const blind = "Big blind";

        game.inputPlayerStats(balance, current_bet, blind);

        const balance_field = document.querySelector("#balance-field strong");
        const current_bet_field = document.querySelector("#bet strong");
        const blind_field = document.querySelector("#blind strong");
        
        expect(balance_field.innerHTML).toBe("300$");
        expect(current_bet_field.innerHTML).toBe("20$");
        expect(blind_field.innerHTML).toBe("Big blind");
    });
    test("Showing jumbotron", () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div>';

        game.showJumbotron("hello");

        const jumbotron = document.getElementById("jumbotron");
        const jumbo_text = document.getElementById("jumbo-text");

        expect(jumbotron.style.visibility).toBe("visible");
        expect(jumbo_text.innerHTML).toBe("hello");
    });
    test("Hiding jumbotron", () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div>';

        game.hideJumbotron();

        const jumbotron = document.getElementById("jumbotron");
        const jumbo_text = document.getElementById("jumbo-text");

        expect(jumbotron.style.visibility).toBe("hidden");
        expect(jumbo_text.innerHTML).toBe("");
    });
    test("Making 'check' button active", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "check";

        game.makeButtonsActive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-on");
        expect(button.disabled).toBe(false);
    });
    test("Making 'raise' button active", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "raise";

        game.makeButtonsActive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-on");
        expect(button.disabled).toBe(false);
    });
    test("Making 'call' button active", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "call";

        game.makeButtonsActive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-on");
        expect(button.disabled).toBe(false);
    });
    test("Making 'fold' button active", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "fold";

        game.makeButtonsActive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-on");
        expect(button.disabled).toBe(false);
    });
    test("Making 'check' button inactive", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "check";

        game.makeButtonsInactive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-off");
        expect(button.disabled).toBe(true);
    });
    test("Making 'raise' button inactive", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "raise";

        game.makeButtonsInactive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-off");
        expect(button.disabled).toBe(true);
    });
    test("Making 'call' button inactive", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "call";

        game.makeButtonsInactive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-off");
        expect(button.disabled).toBe(true);
    });
    test("Making 'fold' button inactive", () => {
        document.body.innerHTML = '<div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

        const button_id = "fold";

        game.makeButtonsInactive(button_id);

        const button = document.getElementById(button_id);

        expect(button.className).toBe("button-off");
        expect(button.disabled).toBe(true);
    });    
});