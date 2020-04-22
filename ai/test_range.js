const range = require("./ai_util/range");
const Data = require("../website/js/classes/data");

// let data = new Data;

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
    chance_of_raise: 30/100,                    //
    average_raise_percentage_of_pot: 0.7,       //


    call_a_raise: 8,
    chance_of_call_a_raise: 40/100,             //

    fold_when_raised: 10, 
    fold_when_sb: 0.5,
    chance_of_fold_when_raised: 60/100,          //
    
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
    hands_played_percentage: 25/50, 

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
    average_raise_percentage_of_pot: 0.8, 


    call_a_raise: 5,
    chance_of_call_a_raise: 2/10, 

    fold_when_raised: 10, 
    fold_when_sb: 0.5,
    chance_of_fold_when_raised: 0.3,
    
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
    hands_played_percentage: 0.75, 

    total_moves: 80,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 40,
    chance_of_raise: 15/100,
    average_raise_percentage_of_pot: 0.5, 


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

console.log("\nPassive player!!!!\n");
console.log(range.determine_range(data_passive, {move: "raise", amount: 10}, 10, 1));
for(let i = 0; i < 5; i++) {
     console.log(range.determine_range(data_passive,{move: "raise", amount: 10}, 10, 0));
}
console.log("\nAggresive player!!!!\n");
console.log(range.determine_range(data_aggresive, {move: "raise", amount: 10}, 10, 1));
for(let i = 0; i < 5; i++) {
     console.log(range.determine_range(data_aggresive,{move: "raise", amount: 10}, 10, 0));
}
console.log("\nSTANDSA PLAYER!!!\n");
console.log(range.determine_range(data_standard, {move: "raise", amount: 10}, 10, 1));
for(let i = 0; i < 5; i++) {
     console.log(range.determine_range(data_standard,{move: "raise", amount: 10}, 10, 0));
}
// console.log(data.current_range);

// console.log(range.determine_range(data_passive,{move: "check", amount: 10}, 10, 0));
// for(let i = 0; i < 10; i++) {
//     console.log(range.determine_range(data_passive,{move: "check", amount: 10}, 10, 0));
// }

/*

console.log("\nPassive player!!!!\n");
console.log(range.determine_range(data_passive, {move: "raise", amount: 10}, 10, 1));
for(let i = 0; i < 5; i++) {
     console.log(range.determine_range(data_passive,{move: "raise", amount: 10}, 10, 0));
}
console.log("\nAggresive player!!!!\n");
console.log(range.determine_range(data_aggresive, {move: "raise", amount: 10}, 10, 1));
for(let i = 0; i < 5; i++) {
     console.log(range.determine_range(data_aggresive,{move: "raise", amount: 10}, 10, 0));
}
console.log("\nSTANDSA PLAYER!!!\n");
console.log(range.determine_range(data_standard, {move: "raise", amount: 10}, 10, 1));
for(let i = 0; i < 5; i++) {
     console.log(range.determine_range(data_standard,{move: "raise", amount: 10}, 10, 0));
}
*/

