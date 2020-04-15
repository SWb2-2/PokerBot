const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");
const Card = require("../../website/js/classes/card");

describe("Checking that dealer functions are working correctly", () => {
    test("Creating deck of 52 cards", () => {
        const dealer = new Dealer;

        dealer.create_deck_of_cards();

        expect(dealer.deck_cards.length).toBe(52);
    });
    test("Shuffle deck", () => {
        const dealer_not_shuffled = new Dealer;
        const dealer_shuffled = new Dealer;
        dealer_not_shuffled.create_deck_of_cards();
        dealer_shuffled.create_deck_of_cards();

        dealer_shuffled.shuffle_array();

        expect(dealer_shuffled.deck_cards).not.toEqual(dealer_not_shuffled.deck_cards);
        expect(dealer_shuffled.deck_cards).toEqual(expect.arrayContaining(dealer_not_shuffled.deck_cards));
        expect(dealer_shuffled.deck_cards.length).toEqual(52);
    });
    test("Giving cards to players", () => {
        const player1 = new Player(100, "robot");
        const player2 = new Player(100, "player");
        const dealer = new Dealer;
        dealer.deck_cards = [new Card(10,3), new Card(13,2), new Card(5,1), new Card(14,1)];

        dealer.give_hand_cards(player1,player2);
    
        expect(player1.hand.length).toBe(2);
        expect(player1.hand[0]).toEqual(new Card(14, 1));
        expect(player1.hand[1]).toEqual(new Card(5, 1));

        expect(player2.hand.length).toBe(2);
        expect(player2.hand[0]).toEqual(new Card(13, 2));
        expect(player2.hand[1]).toEqual(new Card(10, 3));

        expect(dealer.deck_cards.length).toBe(0);
    });
    test("Giving blinds to players, when blinds are blank", () => {
        const dealer = new Dealer;
        const player1 = new Player(100, "robot");
        const player2 = new Player(100, "player");

        dealer.make_blind(player1, player2);

        expect(player1.blind).toBe("bb");
        expect(player2.blind).toBe("sb");
    });
    test("Giving blinds to players, when player1 is bb and player2 is sb", () => {
        const dealer = new Dealer;
        const player1 = new Player(100, "robot");
        player1.blind = "bb";
        const player2 = new Player(100, "player");
        player2.blind = "sb";

        dealer.make_blind(player1, player2);

        expect(player1.blind).toBe("sb");
        expect(player2.blind).toBe("bb");
    });
    test("Giving blinds to players, when player1 is sb and player2 is bb", () => {
        const dealer = new Dealer;
        const player1 = new Player(100, "robot");
        player1.blind = "sb";
        const player2 = new Player(100, "player");
        player2.blind = "bb";

        dealer.make_blind(player1, player2);

        expect(player1.blind).toBe("bb");
        expect(player2.blind).toBe("sb");
    });
    test("Players pay blinds, when player1 is sb and player2 is bb", () => {
        const dealer = new Dealer;
        const player1 = new Player(100, "robot");
        player1.blind = "sb";
        const player2 = new Player(100, "player");
        player2.blind = "bb";

        dealer.pay_blinds(player1, player2, 10, 5);

        expect(player1.balance).toBe(95);
        expect(player2.balance).toBe(90);
    });
    test("Players pay blinds, when player1 is bb and player2 is sb", () => {
        const dealer = new Dealer;
        const player1 = new Player(100, "robot");
        player1.blind = "bb";
        const player2 = new Player(100, "player");
        player2.blind = "sb";

        dealer.pay_blinds(player1, player2, 10, 5);

        expect(player1.balance).toBe(90);
        expect(player2.balance).toBe(95);
    });
    test("Starting new game", () => {
        const dealer = new Dealer;
        const player1 = new Player(100, "robot");
        const player2 = new Player(100, "player");
        const card = new Card(10,3);
    
        dealer.deck_cards = [card, card, card];
        dealer.table_cards = [card, card, card, card, card];
        dealer.pot = 3;
    
        player1.hand = [card, card];
        player2.hand = [card, card];
        player1.current_bet = 3;
        player2.current_bet = 10;
    
        dealer.new_game(player1, player2);
    
        expect(dealer.deck_cards).toStrictEqual([]);
        expect(dealer.table_cards).toStrictEqual([]);
        expect(dealer.pot).toStrictEqual(0);
        expect(player1.hand).toStrictEqual([]);
        expect(player2.hand).toStrictEqual([]);
        expect(player1.current_bet).toStrictEqual(0);
        expect(player2.current_bet).toStrictEqual(0);
    });
    test("Adding table cards from deck", () => {
        const dealer = new Dealer;
        dealer.deck_cards = [new Card(10,3), new Card(13,2), new Card(5,1)];

        const number_of_cards = 3;
        
        dealer.add_table_cards(number_of_cards);
    
        expect(dealer.table_cards.length).toBe(number_of_cards);
        expect(dealer.table_cards[2]).toEqual(new Card(10, 3));
        expect(dealer.table_cards[1]).toEqual(new Card(13, 2));
        expect(dealer.table_cards[0]).toEqual(new Card(5, 1));

        expect(dealer.deck_cards.length).toBe(0);
    });
    test("Giving pot when it is a draw", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 10;
        const player2 = new Player(100, "player");
        player2.current_bet = 10;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "draw");

        expect(player1.balance).toBe(110);
        expect(player2.balance).toBe(110);
    });
    test("Giving pot when robot won", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 10;
        const player2 = new Player(100, "player");
        player2.current_bet = 10;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "robot");

        expect(player1.balance).toBe(120);
        expect(player2.balance).toBe(100);
    });
    test("Giving pot when robot won, and bet more than player", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 20;
        const player2 = new Player(100, "player");
        player2.current_bet = 10;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "robot");

        expect(player1.balance).toBe(130);
        expect(player2.balance).toBe(100);
    });
    test("Giving pot when robot lost, and bet more than player", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 20;
        const player2 = new Player(100, "player");
        player2.current_bet = 10;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "player");

        expect(player1.balance).toBe(110);
        expect(player2.balance).toBe(120);
    });
    test("Giving pot when player won", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 10;
        const player2 = new Player(100, "player");
        player2.current_bet = 10;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "player");

        expect(player1.balance).toBe(100);
        expect(player2.balance).toBe(120);
    });
    test("Giving pot when player won, and bet more than robot", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 10;
        const player2 = new Player(100, "player");
        player2.current_bet = 20;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "player");

        expect(player1.balance).toBe(100);
        expect(player2.balance).toBe(130);
    });
    test("Giving pot when player lost, and bet more than robot", () => {
        const player1 = new Player(100, "robot");
        player1.current_bet = 10;
        const player2 = new Player(100, "player");
        player2.current_bet = 20;
        const dealer = new Dealer;

        dealer.give_pot(player1, player2, "robot");

        expect(player1.balance).toBe(120);
        expect(player2.balance).toBe(110);
    });
    test("The current player folded", () => {
        const current_player = new Player(100, "robot");
        current_player.player_move.move = "fold";
        const other_player = new Player(100, "player");
        const dealer = new Dealer;

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("showdown");
    });
    test("The current player raised, and other players balance is not 0", () => {
        const current_player = new Player(100, "robot");
        current_player.player_move.move = "raise";
        const other_player = new Player(100, "player");
        const dealer = new Dealer;

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("player");
    });
    test("The current player balance is 0, and there are 5 table cards", () => {
        const current_player = new Player(0, "robot");
        current_player.player_move.move = "check";
        const other_player = new Player(100, "player");
        const dealer = new Dealer;
        dealer.table_cards = [new Card(10,3), new Card(13,2), new Card(5,1), new Card(14,1), new Card(14,2)];

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("showdown");
    });
    test("The other player balance is 0, and there are less than 5 table cards", () => {
        const current_player = new Player(20, "robot");
        current_player.player_move.move = "check";
        const other_player = new Player(0, "player");
        const dealer = new Dealer;
        dealer.table_cards = [new Card(10,3), new Card(13,2), new Card(5,1), new Card(14,1)];

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("table");
    });
    test("The current player checked, and the other player has not made a move", () => {
        const current_player = new Player(100, "robot");
        current_player.player_move.move = "check";
        const other_player = new Player(100, "player");
        other_player.player_move.move = "";
        const dealer = new Dealer;

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("player");
    });
    test("Non of the players has made a move", () => {
        const current_player = new Player(100, "robot");
        current_player.player_move.move = "";
        const other_player = new Player(100, "player");
        other_player.player_move.move = "";
        const dealer = new Dealer;

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("robot");
    });
    test("The current player has called, and there are 5 table cards", () => {
        const current_player = new Player(100, "robot");
        current_player.player_move.move = "call";
        const other_player = new Player(100, "player");
        other_player.player_move.move = "raise";
        const dealer = new Dealer;
        dealer.table_cards = [new Card(10,3), new Card(13,2), new Card(5,1), new Card(14,1), new Card(14,2)];

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("showdown");
    });
    test("The current player has called, and there are 5 table cards", () => {
        const current_player = new Player(100, "robot");
        current_player.player_move.move = "call";
        const other_player = new Player(100, "player");
        other_player.player_move.move = "raise";
        const dealer = new Dealer;
        dealer.table_cards = [new Card(10,3), new Card(13,2), new Card(5,1), new Card(14,1)];

        const next_turn = dealer.decide_whose_turn(current_player, other_player, dealer);

        expect(next_turn).toBe("table");
    });
});