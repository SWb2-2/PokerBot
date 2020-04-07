const Player = require("../website/js/classes/player");
const Dealer = require("../website/js/classes/dealer");
const Card = require("../website/js/classes/card");

describe("Check if winner is correctly found", () => {
    test("Best hand is 'High Card'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(12,1), new Card(10,3), new Card(9, 1), new Card(4,0), new Card(5,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("high card");
        expect(winner.ai_hand).toBe("high card");
    });
    test("Best hand is 'One Pair'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(2,1), new Card(14,3), new Card(9, 1), new Card(8,0), new Card(6,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("one pair");
        expect(winner.ai_hand).toBe("one pair");
    });
    test("Best hand is 'Two Pair'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(2,1), new Card(14,3), new Card(9, 1), new Card(3,0), new Card(13,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("two pairs");
        expect(winner.ai_hand).toBe("two pairs");
    });
    test("Best hand is 'Three of a Kind'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(2,1), new Card(14,3), new Card(9, 1), new Card(14,0), new Card(5,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("two pairs");
        expect(winner.ai_hand).toBe("three of a kind");
    });
    test("Best hand is 'Straight'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(12,1), new Card(11,3), new Card(8, 1), new Card(10,0), new Card(13,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("high card");
        expect(winner.ai_hand).toBe("straight");
    });
    test("Best hand is 'Flush'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(2,1), new Card(14,3), new Card(9, 1), new Card(3,1), new Card(13,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("two pairs");
        expect(winner.ai_hand).toBe("flush");
    });
    test("Best hand is 'Four of a Kind'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(14, 1), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(4,1), new Card(14,3), new Card(9, 1), new Card(14,0), new Card(14,2)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("three of a kind");
        expect(winner.ai_hand).toBe("four of a kind");
    });
    test("Best hand is 'Straight Flush'", () => {
        const balance = 190;

        let human_player = new Player(balance, "player");
        human_player.hand = [new Card(2,2), new Card(3,2)];

        let ai_player = new Player(balance, "robot");
        ai_player.hand = [new Card(9, 2), new Card(13,1)];

        let dealer_here = new Dealer();
        dealer_here.table_cards = [new Card(12,1), new Card(11,1), new Card(9, 1), new Card(10,1), new Card(5,0)];

        const winner = dealer_here.get_winner(human_player, ai_player);

        expect(winner.winner).toBe(ai_player.name);
        expect(winner.human_hand).toBe("high card");
        expect(winner.ai_hand).toBe("straight flush");
    });
});