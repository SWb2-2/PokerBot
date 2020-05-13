const monte_carlo = require("../../ai/ai_util/monte_carlo");
const Card = require("../../website/js/classes/card");

describe("Checking that monte_carlo works decent", () => {
    //Test sort in monte_carlo
    test("test sort hand in monte_carlo", () => {
        let k = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),
            new Card(14,2), new Card(10,0)];
        monte_carlo.sort_hand_in_rank_and_suit(k);

        expect(k).toStrictEqual([new Card(10,0),new Card(14,0),new Card(2,2),new Card(5,2),new Card(6,2),
            new Card(14,2), new Card(2,3)]);
    });

    //create_specific_deck_of_cards
    test("Test create_specific_deck_of_cards", () => {
        let illegal_cards = [new Card(10,0),new Card(14,0),new Card(2,2),new Card(5,2),new Card(6,2),
            new Card(14,2), new Card(2,3)];
        let deck = monte_carlo.create_specific_deck_of_cards(illegal_cards);

        expect(deck.length).toStrictEqual(45);
        expect(deck[8]).toStrictEqual(new Card(11,0));
    });

    //equity_range
    test("Test equtiy_range in monte_carlo.js", () => {
        let hand = [new Card(14,0), new Card(14,1)];
        let table = [new Card(14,3), new Card(14,2), new Card(4,2), new Card(7,0), new Card(12,1)];

        let result = monte_carlo.equity_range(hand, 500, table);
        
        expect(result).toStrictEqual(
            {win: 500, 
                lose: 0, 
                draw: 0, 
                winrate: 100,
                draw_and_winrate: 100}
        );
    });
    test("Test equtiy_range in monte_carlo.js", () => {
        let hand = [new Card(2,0), new Card(3,1)];
        let table = [new Card(14,3), new Card(13,2), new Card(4,2), new Card(7,0), new Card(12,1)];

        let result = monte_carlo.equity_range(hand, 500, table); 

        expect(result.win).toStrictEqual(0);
        expect(result.winrate).toStrictEqual(0);
    });
});