const Card = require("../../website/js/classes/card");
const game = require("../../website/js/game");

describe("Checking that basic table functions are working", () => {
    test("Normal cards are being created correctly", () => {
        const card = new Card(10,0);
        const real_card = game.createCard(card);
        const expected_card = '10<br><img src="./Images/heart.png">';
        expect(real_card.innerHTML).toBe(expected_card);
    });
    test("Ace cards are being created correctly", () => {
        const card = new Card(14,0);
        const real_card = game.createCard(card);
        const expected_card = 'A<br><img src="./Images/heart.png">';
        expect(real_card.innerHTML).toBe(expected_card);
    });
    test("King cards are being created correctly", () => {
        const card = new Card(13,0);
        const real_card = game.createCard(card);
        const expected_card = 'K<br><img src="./Images/heart.png">';
        expect(real_card.innerHTML).toBe(expected_card);
    });
    test("Queen cards are being created correctly", () => {
        const card = new Card(12,0);
        const real_card = game.createCard(card);
        const expected_card = 'Q<br><img src="./Images/heart.png">';
        expect(real_card.innerHTML).toBe(expected_card);
    });
    test("Jack cards are being created correctly", () => {
        const card = new Card(11,0);
        const real_card = game.createCard(card);
        const expected_card = 'J<br><img src="./Images/heart.png">';
        expect(real_card.innerHTML).toBe(expected_card);
    });
    test("Bot cards are being created correctly", () => {
        const real_card = game.createBotBackCard();
        const expected_card = '';
        expect(real_card.innerHTML).toBe(expected_card);
    });
});