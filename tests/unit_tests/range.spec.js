const range = require('../../ai/ai_util/range.js');

test("heej", () => {

    expect(1).toBe(1);
});


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
    hands_played_percentage: 20/100, 

    total_moves: 80,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 40,
    chance_of_raise: 0.4,
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

data_loose_aggressive_player = {
    //Imperical data
    player_fold: 20,
    player_check: 30,  
    player_call: 20, 
    player_raise: 10,   
    hands_played_percentage: 0.8, 

    total_moves: 80,
    total_preflop: 50,

    ai_fold: 20,
    ai_check: 20, 
    ai_call: 8, 
    ai_raise: 20,
    ai_total_moves: 68, 

    // Playstyle
    raises: 40,
    chance_of_raise: 80/100,
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
    test("Test of raise on the strong player with raise of 10%", () => {
        let i = true;
        let j = true;

        let solid = range.determine_range(data_strong_player, {move: "raise", amount: 10}, 100, 1);
        
        if(solid.range_Low > 35) {
            i = false;
        }
        if(solid.range_high < 63) {
            j = false;
        }

        console.log(solid, "stron 10%");
        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the strong player with raise of 50%", () => {
        let i = true;
        let j = true;

        let solid = range.determine_range(data_strong_player, {move: "raise", amount: 50}, 100, 1);
        // Strong player sættes til standard low_range = 48, da bet ift pot = 0,5. 
        // Ud fra dette bør strong player få en signifikant større low range.
        if(solid.range_Low < 50) {
            i = false;
        }
        if(solid.range_high < 80) {
            j = false;
        }
        console.log(solid, "stron 50%");

        expect(i).toBe(true);
        expect(j).toBe(true);
    });

    test("Test of raise on the strong player with raise of 150%", () => {
        let i = true;
        let j = true;

        let solid = range.determine_range(data_strong_player, {move: "raise", amount: 149}, 100, 1);
        // Strong player sættes til standard low_range = 50, da bet ift pot = 1.5. 
        // Ud fra dette bør strong player få en signifikant større range
        if(solid.range_Low > 65) {
            i = false;
        }
        if(solid.range_high < 80) {
            j = false;
        }
        console.log(solid, "150%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the strong player with raise of 200%", () => {
        let i = true;
        let j = true;

        let solid = range.determine_range(data_strong_player, {move: "raise", amount: 200}, 100, 1);
        // Strong player sættes til standard low_range = 50, da bet ift pot = 2. 
        // Ud fra dette bør strong player få en signifikant større range
        if(solid.range_Low < 58) {
            i = false;
        }
        if(solid.range_high < 80) {
            j = false;
        }
        console.log(solid, "200%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the passive player with raise of 10%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_passive, {move: "raise", amount: 10}, 100, 1);
        if(passive.range_Low > 35) {
            i = false;
        }
        if(passive.range_high > 65) {
            j = false;
        }
        console.log(passive, "10%");
        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the passive player with raise of 50%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_passive, {move: "raise", amount: 50}, 100, 1);
        if(passive.range_Low < 50) {
            i = false;
        }

        if(passive.range_high < 80) {
            j = false;
        }
        console.log(passive, "50%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test of raise on the passive player with raise of 150%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_passive, {move: "raise", amount: 150}, 100, 1);
        if(passive.range_Low === 65) {
            i = false;
        }
        if(passive.range_high < 80) {
            j = false;
        }

        console.log(passive, "150%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the passive player with raise of 200%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_passive, {move: "raise", amount: 200}, 100, 1);
        if(passive.range_Low < 58) {
            i = false;
        }
        if(passive.range_high != 86) {
            j = false;
        }
        console.log(passive, " passive 200%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the standard player with raise of 10%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_standard, {move: "raise", amount: 10}, 100, 1);
        if(passive.range_Low > 35) {
            i = false;
        }
        if(passive.range_high > 70) {
            j = false;
        }
        console.log(passive, "10%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the standard player with raise of 50%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_standard, {move: "raise", amount: 50}, 100, 1);
        if(passive.range_Low > 58) {
            i = false;
        }
        if(passive.range_high < 75) {
            j = false;
        }

        console.log(passive, "50%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test of raise on the standard player with raise of 150%", () => {
        let i = true;
        let j = true;

        let standard = range.determine_range(data_standard, {move: "raise", amount: 150}, 100, 1);
        let passive = range.determine_range(data_passive, {move: "raise", amount: 150}, 100, 1);
        if(passive.range_Low < standard.range_Low) {
            i = false;
        }
        if(passive.range_high != 86) {
            j = false;
        }

        console.log(passive, " standard 150%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test of raise on the standard player with raise of 200%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_standard, {move: "raise", amount: 200}, 100, 1);
        if(passive.range_Low < 58) {
            i = false;
        }
        if(passive.range_high != 86) {
            j = false;
        }

        console.log(passive, "stands 200%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the aggresive player with raise of 10%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_standard, {move: "raise", amount: 10}, 100, 1);
        if(passive.range_Low > 35) {
            i = false;
        }
        if(passive.range_high > 70) {
            j = false;
        }
        console.log(passive, "aggresive 10%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });

    test("Test of raise on the aggresive player with raise of 50%", () => {
        let i = true;
        let j = true;

        let passive = range.determine_range(data_standard, {move: "raise", amount: 50}, 100, 1);
        if(passive.range_Low > 60) {
            i = false;
        }
        if(passive.range_high < 75) {
            j = false;
        }

        console.log(passive, "aggresive 50%");

        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test of raise on the aggresive player with raise of 150%", () => {
        let i = true;
        let j = true;

        let aggressive = range.determine_range(data_aggresive, {move: "raise", amount: 150}, 100, 1);
        let standard = range.determine_range(data_standard, {move: "raise", amount: 150}, 100, 1);
        if(aggressive.range_Low < standard.range_Low) {
            i = false;
        }
        if(aggressive.range_high != 86) {
            j = false;
        }

        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("Test of raise on the aggresive player with raise of 200%", () => {
        let i = true;
        let j = true;
        
        let aggressive = range.determine_range(data_aggresive, {move: "raise", amount: 200}, 100, 1);
        
        if(aggressive.range_Low < 60) {
            i = false;
        }
        if(aggressive.range_high != 86) {
            j = false;
        }


        expect(j).toBe(true);
        expect(i).toBe(true);
    });
    test("A player who raises all the time, playing many hands and raises with big factors should not be given a high range_low", () => {
        let i = true;
        let j = true;
        

        let looseAggressive = range.determine_range(data_loose_aggressive_player, {move: "raise", amount: 200}, 100, 1);
        
        if(looseAggressive.range_Low > 57) {
            i = false;
        }
        if(looseAggressive.range_high != 86) {
            j = false;
        }
        expect(j).toBe(true);
        expect(i).toBe(true);
    })
});


