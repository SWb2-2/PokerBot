const func = require("../../ai/ai.js");
// const game_info = {
// 	ai_hand: [],
// 	table_cards: [],
// 	pot: 3,
// 	ai_balance: 3,
// 	player_balance: 3,
// 	ai_current_bet: 3,
// 	player_current_bet: 3,
// 	blind_size: 3,
// 	blind: "sb",
// 	player_move: { move: "check", amount: 13 },
// 	bluff: true
// }
//Test move proactive
describe("Test move proactive", () => {

    test("test move_proactive", () => {
        game_info = {
            ai_hand: [],
            table_cards: [],
            pot: 100,
            ai_balance: 3,
            player_balance: 3,
            ai_current_bet: 3,
            player_move: { move: "raise", amount: 10 },
        }
        let k = func.move_reactive(0.45, game_info);

        console.log(k);
        

    })












})