const range = require("./ai/ai_util/range");

data_tight_aggresive = {
    player_fold: 75,
    player_check: 20,  
    player_call: 5, 
    player_raise: 40,   

    fold_when_raised: 15, 
    fold_when_sb: 25,  //Folded 50% af sb
    chance_of_fold_when_raised: 0.75,
    
    raises: 35,         //Really aggresive raises 
    chance_of_raise: 35/150,
    average_raise_percentage_of_pot: 0.8,  //Bets a big pot everytime

    call_a_raise: 5,     //Rarely calls
    chance_of_call_a_raise: 0.25,

    range: {
        range_Low: 35, 
        range_high: 100
    }, 
    current_range: {
        range_Low: 35, 
        range_high: 86
    },

    total_moves: 140,       //Around this many rounds. 
    total_preflop: 86,

    ai_fold: 40,
    ai_check: 30, 
    ai_call: 10, 
    ai_raise: 20,
    ai_total_moves: 100

}

// console.log(data_tight_aggresive.current_range);
// console.log(range.determine_range(data_tight_aggresive, {move: "check", amount: 8}, 10));
// console.log(range.determine_range(data_tight_aggresive, {move: "raise", amount: 10}, 10));


for(let i = 0; i < 5; i++) {
    console.log(range.determine_range(data_tight_aggresive, {move: "check", amount: 8}, 10));
}
