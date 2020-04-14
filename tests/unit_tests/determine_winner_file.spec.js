const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");
const Card = require("../../website/js/classes/card");
const determine_winner = require("../../website/js/modules/determine_winner");

describe("Checking that basic determine winner functions work", () => {
    test("should sort cards from largest to smallest", () =>{
        const hand_info = {hand: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),new Card(14,2), new Card(10,0)];

        determine_winner.sort_hand(hand_info);

        expect(hand_info.hand).toEqual([new Card(14,0), new Card(14,2), new Card(10,0), new Card(6,2), new Card(5,2), new Card(2,2), new Card(2,3)]);
    });
    test("Counting number of cards in the different ranks", () =>{
        const hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3), new Card(14,2), new Card(10,0)];

        determine_winner.count_all_ranks(hand_info);

        expect(hand_info.count_rank).toEqual([,,2,0,0,1,1,0,0,0,1,0,0,0,2]);
    });
    test("Counting number of cards in the different suits", () =>{
        const hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),new Card(14,2), new Card(10,0)];

        determine_winner.count_suits(hand_info);

        expect(hand_info.count_suit).toEqual([2,0,4,1]);
    });
    test("Get the five highest cards", ()=>{
        const hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),new Card(13,2), new Card(10,0)];

        determine_winner.sort_hand(hand_info);
        determine_winner.find_high_card(hand_info);

        expect(hand_info.best_hands[0]).toEqual([14,13,10,6,5]);
    });
    test("Get the two best pairs, and a high card",() =>{
        const hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(5,1),new Card(14,2),new Card(14,0),new Card(2,3),new Card(2,2), new Card(4,0)];

        determine_winner.sort_hand(hand_info);
        determine_winner.count_all_ranks(hand_info);
        determine_winner.find_two_pairs(hand_info);

        expect(hand_info.best_hands[2]).toEqual([14,14,5,5,4]);
    });
    test("Get straight",() => {
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(8,1),new Card(7,0),new Card(11,2),new Card(10,0),new Card(12,3),new Card(14,2), new Card(13,1)];

        determine_winner.sort_hand(hand_info);
        determine_winner.find_straight(hand_info);

        expect(hand_info.best_hands[4]).toEqual([14,13,12,11,10]);
    });
    test("Get flush",() => {
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(13,0),new Card(3,0),new Card(4,2),new Card(5,0),new Card(6,0),new Card(14,0), new Card(7,0)];

        determine_winner.sort_hand(hand_info);
        determine_winner.count_suits(hand_info);
        determine_winner.find_flush(hand_info);

        expect(hand_info.best_hands[5]).toEqual([14,13,7,6,5]);
    });
    test("Get fullhouse",() => {
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(2,1),new Card(2,0),new Card(4,2),new Card(5,0),new Card(14,0),new Card(14,1), new Card(14,2)];

        determine_winner.sort_hand(hand_info);
        determine_winner.count_all_ranks(hand_info);
        determine_winner.find_full_house(hand_info);

        expect(hand_info.best_hands[6]).toStrictEqual([14,14,14,2,2]);
    });
    test("Get straight flush",() => {
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(2,1),new Card(4,1),new Card(7,1),new Card(3,1),new Card(5,1),new Card(14,1), new Card(13,1)];

        determine_winner.sort_hand(hand_info);
        determine_winner.count_all_ranks(hand_info);
        determine_winner.count_suits(hand_info);
        determine_winner.find_straight(hand_info);
        determine_winner.find_flush(hand_info);
        determine_winner.find_straight_flush(hand_info);

        expect(hand_info.best_hands[8]).toStrictEqual([5,4,3,2,1]);
    });
    test("Get one pair", ()=>{
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(2,3),new Card(14,2), new Card(10,0)];

        determine_winner.sort_hand(hand_info);

        expect(determine_winner.find_similar(2,hand_info)).toBe(14);
    });
    test("Get three of a kind", ()=>{
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(2,2),new Card(14,0),new Card(14,3),new Card(14,2), new Card(10,0)];

        determine_winner.sort_hand(hand_info);

        expect(determine_winner.find_similar(3,hand_info)).toBe(14);
    });
    test("Get four of a kind", ()=>{
        let hand_info = {hand: [], count_rank: [], count_suit: [], best_hands: []};
        hand_info.hand = [new Card(5,2),new Card(6,2),new Card(14,1),new Card(14,0),new Card(14,3),new Card(14,2), new Card(10,0)];

        determine_winner.sort_hand(hand_info);

        expect(determine_winner.find_similar(4,hand_info)).toBe(14);
    });
});