const ai = require("./ai.js");

const data = {
    chance_of_fold_when_raised: 0.4,
    total_moves: 31
}
const game_info = {
	ai_hand: [],
	table_cards: [],
	pot: 100,
	ai_balance: 3,
	player_balance: 3,
	ai_current_bet: 3,
	player_current_bet: 3,
	blind_size: 3,
	blind: "sb",
	player_move: { move: "raise", amount: 10 },
	bluff: true
}


// let k = ai.move_proactive(45, data, game_info);

// console.log(k)

let m = ai.move_reactive(49, data, game_info);


console.log(m);