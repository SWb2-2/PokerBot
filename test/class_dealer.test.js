const Dealer = require("../classes/class_dealer.js");
const Player = require("../classes/class_player.js");
const Card = require("../classes/class_card.js");


//dealer.create_deck_of_cards
test("Tests dealer.create_deck_of_cards, should reset the dealer and players ", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;

    dealer.deck_cards = [3,4,5];
    dealer.table_cards = [8,1,2,4,new Card(3,2)];
    dealer.pot = 3;

    player1.hand = [3,2];
    player2.hand = [8,"b", [3,4]];
    player1.current_bet = 3;
    player2.current_bet = "hej";

    dealer.new_game(player1, player2);

    expect(dealer.deck_cards).toStrictEqual([]);
    expect(dealer.table_cards).toStrictEqual([]);
    expect(dealer.pot).toStrictEqual(0);
    expect(player1.hand).toStrictEqual([]);
    expect(player2.hand).toStrictEqual([]);
    expect(player1.current_bet).toStrictEqual(0);
    expect(player2.current_bet).toStrictEqual(0);
});

// //dealer.create_deck_of_cards
// test("Tests dealer.create_deck_of_cards and it should return an array of 52 cards", () => {
//     let dealer = new Dealer;
//     let card;
//     let error0 = 0;
//     let error1 = 0;
//     let error2 = 0;
//     let rank = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//     let suit = [0,0,0,0];
//     dealer.create_deck_of_cards();
    
//     //Tests that no card is in the deck twice. 
//     for(let i = 0; i < 52; i++) {
//         card = dealer.deck_cards[i];
//         rank[card.rank] += 1;
//         suit[card.suit] += 1;
//         for(let j = 0; j < 52; j++) {
//             if(j == i) {
//                 j++;
//             }
//             if(card === dealer.deck_cards[j]) {
//                 error0 = 1;
//             }
//         } 
//     }
//     //Tests there is 4 of each rank
//     for(let i = 2; i < 15; i++) {
//         if(rank[i] != 4) {
//             error1 = 1;
//         }
//     }
//     //tests there is 13 of is suit
//     for(let i = 0; i < 4; i++) {
//         if(suit[i] != 13) {
//             error2 = 1;
//         }
//     }

//     expect(error2).toStrictEqual(0);
//     expect(error1).toStrictEqual(0);
//     expect(error0).toStrictEqual(0);
//     expect(dealer.deck_cards.length).toStrictEqual(52);
// });

// //dealer.shuffle_array.
// //Tests by making sure every card is still in the deck.  
// test("test of dealer.shuffle_array, should return a shuffled array", () => {
//     let dealer = new Dealer;
//     let card;
//     let error0 = 0;
//     let error1 = 0;
//     let error2 = 0;
//     let rank = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//     let suit = [0,0,0,0];
//     dealer.create_deck_of_cards();
//     dealer.shuffle_array();
    
//     //Tests that no card is in the deck twice. 
//     for(let i = 0; i < 52; i++) {
//         card = dealer.deck_cards[i];
//         rank[card.rank] += 1;
//         suit[card.suit] += 1;
//         for(let j = 0; j < 52; j++) {
//             if(j == i) {
//                 j++;
//             }
//             if(card === dealer.deck_cards[j]) {
//                 error0 = 1;
//             }
//         } 
//     }
//     //Tests there is 4 of each rank
//     for(let i = 2; i < 15; i++) {
//         if(rank[i] != 4) {
//             error1 = 1;
//         }
//     }
//     //tests there is 13 of is suit
//     for(let i = 0; i < 4; i++) {
//         if(suit[i] != 13) {
//             error2 = 1;
//         }
//     }

//     expect(error2).toStrictEqual(0);
//     expect(error1).toStrictEqual(0);
//     expect(error0).toStrictEqual(0);
//     expect(dealer.deck_cards.length).toStrictEqual(52);
// });

//dealer.add_table_cards
test("tests dealer.add_table_cards, and it should add cards to the table", () => {
    let dealer = new Dealer;

    dealer.deck_cards = [0,1,2,3,4,5,6];
    
    dealer.add_table_cards(1);

    expect(dealer.table_cards).toStrictEqual([6]);
    expect(dealer.deck_cards).toStrictEqual([0,1,2,3,4,5]);
});
test("tests dealer.add_table_cards, and it should add cards to the table", () => {
    let dealer = new Dealer;

    dealer.deck_cards = [0,1,2,3,4,5,6];
    
    dealer.add_table_cards(3);

    expect(dealer.table_cards).toStrictEqual([6,5,4]);
    expect(dealer.deck_cards).toStrictEqual([0,1,2,3]);
});
test("tests dealer.add_table_cards, and it should add cards to the table", () => {
    let dealer = new Dealer;

    dealer.create_deck_of_cards();
    
    dealer.add_table_cards(3);

    expect(dealer.table_cards)
    .toStrictEqual([new Card(14,3),new Card(13,3), new Card(12,3)]);

    expect(dealer.deck_cards.length).toStrictEqual(49);
});

//dealer.give_player_cards
test("Test dealer.give_player_cards should return 2 cards in the player hands", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;

    dealer.deck_cards = [0,1,2,3,4,5,6];

    dealer.give_player_cards(player1, player2);

    expect(player1.hand).toStrictEqual([6,5]);
    expect(player2.hand).toStrictEqual([4,3]);
    expect(dealer.deck_cards).toStrictEqual([0,1,2]);
});
test("Test dealer.give_player_cards should return 2 cards in the player hands", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;

    dealer.create_deck_of_cards();
    player1.card = [1,2];
    player2.card = [new Card(2,3), "hej"];

    dealer.give_player_cards(player1, player2);

    expect(player1.hand).toStrictEqual([new Card(14,3), new Card(13,3)]);
    expect(player2.hand).toStrictEqual([new Card(12,3), new Card(11,3)]);
    expect(dealer.deck_cards.length).toStrictEqual(48);
});

//dealer.end_betting_round 
test("Test dealer.end_betting_round: Should return true, and add the current_bets to the pot", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;
    dealer.pot = 0; 
    player1.current_bet = 10;
    player2.current_bet = 10;
    let k = dealer.end_betting_round(player1, player2);

    expect(k).toStrictEqual(true);
    expect(dealer.pot).toStrictEqual(20);
    expect(player1.current_bet).toStrictEqual(0);
    expect(player2.current_bet).toStrictEqual(0);
});
test("Test dealer.end_betting_round, Should return true, and add the current_bets to the pot", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;
    dealer.pot = 10; 
    player1.current_bet = 15;
    player2.current_bet = 15;
    let k = dealer.end_betting_round(player1, player2);

    expect(k).toStrictEqual(true);
    expect(dealer.pot).toStrictEqual(40);
    expect(player1.current_bet).toStrictEqual(0);
    expect(player2.current_bet).toStrictEqual(0);
});
test("Test dealer.end_betting_round, should return False, and not add the current_bets to the pot", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;
    dealer.pot = 10; 
    player1.current_bet = 15;
    player2.current_bet = 30;
    let k = dealer.end_betting_round(player1, player2);

    expect(k).toStrictEqual(false);
    expect(dealer.pot).toStrictEqual(10);
    expect(player1.current_bet).toStrictEqual(15);
    expect(player2.current_bet).toStrictEqual(30);
});

//dealer.give_pot
test("dealer.give_pot, Should add the pot to the player.balance", () => {
    let dealer = new Dealer;
    let player = new Player;

    dealer.pot = 100;
    player.balance = 0;

    dealer.give_pot(player);

    expect(player.balance).toStrictEqual(100);
});
test("dealer.give_pot, Should add the pot to the player.balance", () => {
    let dealer = new Dealer;
    let player = new Player;

    dealer.pot = 100;
    player.balance = 10;

    dealer.give_pot(player);

    expect(player.balance).toStrictEqual(110);
});
test("dealer.give_pot, Should split the pot between the to player.balance", () => {
    let dealer = new Dealer;
    let player1 = new Player;
    let player2 = new Player;

    dealer.pot = 100;
    player1.balance = 10;
    player2.balance = 15;

    dealer.give_pot(player1, player2);

    expect(player1.balance).toStrictEqual(60);
    expect(player2.balance).toStrictEqual(65);
});