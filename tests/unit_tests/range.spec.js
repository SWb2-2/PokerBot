const range = require('../../ai/ai_util/range.js');

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

describe("Testing range where each test is split into different moves", () => {
    test("Test on passive player who checks", () => {
        let i = false;
        let j = false;
        let passive = range.determine_range(data_passive, {move: "check", amount: 0}, 100, 1);

        if(passive.range_Low < 40 && passive.range_Low > 30) {
            i = true;
        }
        if(passive.range_high <= 65 && passive.range_high > 50) {
            j = true;
        }
        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test on aggresive player who checks", () => {
        let i = false;
        let j = false;
        let aggressive = range.determine_range(data_aggresive, {move: "check", amount: 0}, 100, 1);

        if(aggressive.range_Low < 40 && aggressive.range_Low > 30) {
            i = true;
        }
        if(aggressive.range_high <= 65 && aggressive.range_high > 50) {
            j = true;
        }
        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test on standard player who checks", () => {
        let i = false;
        let j = false;
        let standard = range.determine_range(data_standard, {move: "check", amount: 0}, 100, 1);

        if(standard.range_Low < 40 && standard.range_Low > 30) {
            i = true;
        }
        if(standard.range_high <= 65 && standard.range_high > 50) {
            j = true;
        }
        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test on Solid player who checks", () => {
        let i = false;
        let j = false;
        let solid = range.determine_range(data_strong_player, {move: "check", amount: 0}, 100, 1);

        if(solid.range_Low < 40 && solid.range_Low > 30) {
            i = true;
        }
        if(solid.range_high <= 65 && solid.range_high > 50) {
            j = true;
        }
        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    //TESTING OF CALL
    test("Test call on passive player", () => {
        let i = false;
        let j = false;

        let passive = range.determine_range(data_passive, {move: "call", amount: 0}, 100, 1);

        if(passive.range_Low < 65 && passive.range_Low > 45) {
            i = true;
        }
        if(passive.range_high <= 86 && passive.range_high > 65) {
            j = true;
        }

        expect(j).toBe(true);
        expect(i).toBe(true);

    });
    test("Test call on strong player", () => {
        let i = false;
        let j = false;

        let solid = range.determine_range(data_strong_player, {move: "call", amount: 0}, 100, 1);

        if(solid.range_Low < 65 && solid.range_Low > 45) {
            i = true;
        }
        if(solid.range_high <= 86 && solid.range_high > 65) {
            j = true;
        }

        expect(j).toBe(true);
        expect(i).toBe(true);

    });
    test("Test call on aggresive player", () => {
        let i = false;
        let j = false;

        let solid = range.determine_range(data_aggresive, {move: "call", amount: 0}, 100, 1);

        if(solid.range_Low < 65 && solid.range_Low > 45) {
            i = true;
        }
        if(solid.range_high <= 86 && solid.range_high > 65) {
            j = true;
        }

        expect(j).toBe(true);
        expect(i).toBe(true);

    });
    test("Test call on standard player", () => {
        let i = false;
        let j = false;

        let solid = range.determine_range(data_standard, {move: "call", amount: 0}, 100, 1);

        if(solid.range_Low < 65 && solid.range_Low > 45) {
            i = true;
        }
        if(solid.range_high <= 86 && solid.range_high > 65) {
            j = true;
        }

        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    
    //TEST RAISE!!! 0.1 - 0.5 - 1.5 - 2
    test("Test of raise on the strong player with different raises", () => {
        let i = true;
        let j = true;

        let solid = range.determine_range(data_strong_player, {move: "raise", amount: 10}, 100, 1);
        
        if(solid.range_Low > 35) {
             i = false;
        }
        if(solid.range_high < 80) {
            j = false;
        }

        expect(j).toBe(true);
        expect(i).toBe(true);
    });




});