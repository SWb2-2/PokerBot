const Card = require("../../website/js/classes/card");
const game = require("../../website/js/game");

describe("Checking if tables HTML is updating correctly", () => {
    test("Give table cards", async () => {
        document.body.innerHTML = '<div id="jumbotron"><h1 id="jumbo-text"></h1></div><div id="open-cards"></div><div id="player-options"><button class="button-on" id="check" onclick="makePlayerMove(this.id)">Check</button><button class="button-on" id="call" onclick="makePlayerMove(this.id)">Call</button><button class="button-on" id="raise" onclick="makePlayerMove(this.id)">Raise</button><button class="button-on" id="fold" onclick="makePlayerMove(this.id)">Fold</button></div>';

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
        
        await game.decideTurn({whose_turn: "table"});

        const jumbo_text = document.getElementById("jumbo-text").innerHTML;
        const table_cards = document.getElementById("open-cards").innerHTML;

        expect(global.fetch.mock.calls.length).toBe(1);
        expect(jumbo_text).toBe("Next round");
        expect(table_cards).toBe('<div id="card">A<br><img src="./Images/heart.png"></div>');
    });
});