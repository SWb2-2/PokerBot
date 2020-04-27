const func = require("./ai.js");

game_info = {
    ai_hand: [],
    table_cards: [3,4,3,4],
    pot: 100,
    ai_balance: 3,
    player_balance: 3,
    ai_current_bet: 3,
    player_move: { move: "raise", amount: 10 },
}


for(let i = 10; i < 200; i = i+10) {
    game_info.player_move.amount = i;
    let k = func.move_reactive(0.56, game_info);

    console.log(k, i);
}
