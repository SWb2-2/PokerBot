const range = require("./range");
const Data = require("../../website/js/classes/data");
data_standard = {
    //Imperical data
    player_fold: 20,
    player_check: 20,  
    player_call: 8, 
    player_raise: 20,   
    hands_played_percentage: 60/100,             //

    total_moves: 68,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 20,
    chance_of_raise: 25/100,                    //
    average_raise_percentage_of_pot: 0.6,       //


    call_a_raise: 8,
    chance_of_call_a_raise: 25/100,             //

    fold_when_raised: 10, 
    fold_when_sb: 0.5,
    chance_of_fold_when_raised: 75/100,          //
    
    range: {
        range_Low: 34, 
        range_high: 86
    }, 
    current_range: {
        range_Low: 34, 
        range_high: 86 
    }
}
data_aggresive = {
    //Imperical data
    player_fold: 30,
    player_check: 15,  
    player_call: 5, 
    player_raise: 30,   
    hands_played_percentage: 40/100, 

    total_moves: 80,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 40,
    chance_of_raise: 0.6,
    average_raise_percentage_of_pot: 1, 


    call_a_raise: 5,
    chance_of_call_a_raise: 2/10, 

    fold_when_raised: 10, 
    fold_when_sb: 0.5,
    chance_of_fold_when_raised: 0.6,
    
    range: {
        range_Low: 34, 
        range_high: 86
    }, 
    current_range: {
        range_Low: 34, 
        range_high: 86 
    }
}
data_passive = {
    //Imperical data
    player_fold: 20,
    player_check: 30,  
    player_call: 20, 
    player_raise: 10,   
    hands_played_percentage: 0.7, 

    total_moves: 80,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 40,
    chance_of_raise: 20/100,
    average_raise_percentage_of_pot: 0.4, 


    call_a_raise: 10,
    chance_of_call_a_raise: 6/10, 

    fold_when_raised: 10, 
    fold_when_sb: 0.5,
    chance_of_fold_when_raised: 0.4,
    
    range: {
        range_Low: 34, 
        range_high: 86
    }, 
    current_range: {
        range_Low: 34, 
        range_high: 86 
    }
}

data_strong_player = {
    //Imperical data
    player_fold: 20,
    player_check: 30,  
    player_call: 20, 
    player_raise: 10,   
    hands_played_percentage: 0.6, 

    total_moves: 80,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 40,
    chance_of_raise: 40/100,
    average_raise_percentage_of_pot: 0.7, 


    call_a_raise: 10,
    chance_of_call_a_raise: 2/10, 

    fold_when_raised: 10, 
    fold_when_sb: 0.5,
    chance_of_fold_when_raised: 0.7,
    
    range: {
        range_Low: 34, 
        range_high: 86
    }, 
    current_range: {
        range_Low: 34, 
        range_high: 86 
    }
}
let k


// for(let i = 1; i < 20; i++) {
//     k = range.determine_range(data_standard, {move: "raise", amount: i*10}, 100, 1);
//     console.log(k, i*10, "%");
// }

// k = range.determine_range(data_standard, {move: "raise", amount: 10}, 100, 1);
// console.log(k);
//  k = range.determine_range(data_standard, {move: "raise", amount: 50}, 100, 1);
// console.log(k);
//  k = range.determine_range(data_standard, {move: "raise", amount: 150}, 100, 1);
// console.log(k);
//  k = range.determine_range(data_standard, {move: "raise", amount: 200}, 100, 1);
// console.log(k);




