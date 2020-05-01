const func = require("../ai.js");


game_info = {
    ai_hand: [],
    table_cards: [3,4,3,4],
    pot: 100,
    ai_balance: 3,
    player_balance: 3,
    ai_current_bet: 3,
    player_move: { move: "raise", amount: 10 },
}

data = {
    total_moves: 50, 
    chance_of_fold_when_raised: 0.4
}


// console.log(func.find_max_EV_raise_bluff(50, 0.9, 100, 0.25));


// for(let i = 0.51; i < 1; i = i+0.01) {

//     console.log(i, func.move_proactive(i, data, game_info) );
// }

for(let i = 10; i < 200; i += 10) {
    game_info.player_move.amount = i; 
    console.log(func.move_reactive(0.55, game_info)); 
}

//Test calc_EV_raise
// for(let i = 10; i < 200; i= i+10) {

//     k = func.adjust_call_chance(0.3, i/100); 
//     // console.log(k);
//   console.log(  func.calc_EV_raise(k, 100, i, 0.65));
// }



//TEst adjusted call_chance
// for(let i = 0.1; i < 2; i = i+0.1) {

//     console.log(i,func.adjust_call_chance(0.8, i));

// }

