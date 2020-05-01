const func = require("../ai.js");

    let ai_move = {
        ai_move: "check",
        amount: 0
    }

    let data = {
        chance_of_call_when_raised: 0.3, 
        ai_raise: 30,
        ai_total_moves: 100 
    }


    let game_info = {
        pot: 100
    }
    range = {
        range_low: 34,
        range_high: 86, 
    }

for(let i = 0.20; i < 0.50; i += 0.05) {

    console.log(func.do_calculated_bluff(ai_move, i, game_info, data, range), "Ansver"); 

}


