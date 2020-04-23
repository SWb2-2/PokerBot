const monte_carlo = require("./monte_carlo");
const Card = require("../../website/js/classes/card");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");


data = {
    //Imperical data
    player_fold: 0,
    player_check: 0,  
    player_call: 0, 
    player_raise: 0,   
    hands_played_percentage: 0, 

    total_moves: 0,
    total_preflop: 0,

    ai_fold: 0,
    ai_check: 0, 
    ai_call: 0, 
    ai_raise: 0,
    ai_total_moves: 0, 

    // Playstyle
    raises: 0,
    chance_of_raise: 0,
    average_raise_percentage_of_pot: 0, 


    call_a_raise: 0,
    chance_of_call_a_raise: 0, 

    fold_when_raised: 0, 
    fold_when_sb: 0,
    chance_of_fold_when_raised: 0,
    
    range: {
        range_Low: 34, 
        range_high: 86
    }, 
    current_range: {
        range_Low: 34, 
        range_high: 86 
    }
}




// Called before ai_move in the preflop
function determine_range(data, player_move, pot_size, first) {
    
    if(data.total_moves < 30) {
        if(player_move.move == "check") {
            data.current_range.range_Low = 34;
            data.current_range.range_high = 65;
        } else if(player_move.move == "call") {
            data.current_range.range_Low = 40;
            data.current_range.range_high = 86;
        } else if (player_move.move == "raise") {
            data.current_range.range_Low = 45;
            data.current_range.range_high = 86;     
        }
        return data.current_range;
    }

    //AI is sb and player hasent done a move yet. 
    if(player_move == undefined) {

        data.player_average_range = data.fold_when_sb / data.total_preflop;
        return data.range

    } else {
        let cr = data.chance_of_raise;  // Det spiller ikke. 
        let hp = data.hands_played_percentage;
        let c  = 1 - data.chance_of_call_a_raise; 
        let ra = player_move.amount / pot_size;
        let raise_average = ra / data.average_raise_percentage_of_pot;

        let w_cr, w_hp,  w_c, w_ra;
        let i_cr, i_hp, i_c, i_ra;
        w_cr = w_hp = w_c = w_ra = 1;
        i_cr = i_hp = i_c = i_ra = 1; 
        
        if(player_move.move == "check") {
            //Lower range_high alot, and lower range_low
            //If high data.chance_of_raise lower everything significant, both the higher and lower. 
            //If low data.chance_of_raise, dont lower much
                // AND high data.hand_played_percentage, we cant chance much. 
                // AND low data.hand_played_percentage, it can be a good hand. 

            //Be careful of slwoplay. Might add a data.called_when_raised_when_checked
            if(first) {
                data.current_range.range_Low = 34;
                data.current_range.range_high = 65;
            }
            w_cr = w_hp = 1;
            i_cr = 1
            i_hp = 0.2;

            if(data.current_range.range_high > 70) {
                w_cr = (data.current_range.range_high - 40) * 1;        //Skal fintunes
                w_hp = (data.current_range.range_high - 40) * 0.75; 

            } else if(data.current_range.range_high > 60) {
                w_cr = (data.current_range.range_high - 48) * 0.75;        //Skal fintunes
                w_hp = (data.current_range.range_high - 48) * 0.5; 

            } else if(data.current_range.range_high > 40) {
                w_cr = 10;                                               //Skal fintunes
                w_hp = 6; 
            }

            data.current_range.range_high = data.current_range.range_high - (cr * w_cr * i_cr) - (hp * w_hp * i_hp);
            
            range_control_check(data.current_range);
            return data.current_range;

        } else if(player_move.move == "call") {
            if(first) {
                data.current_range.range_Low = 40;
                data.current_range.range_high = 86;
            }
            //In general: increase range. 
            // If high data.chance_of_call_a_raise, low increase in range. 
            // If low data.chance_of_call_a_raise, high increase in range. 

            // If high data.chance_of_raise, low increase in range. 
            // If low data.chance_of_raise, high increase in range. 

            // If low data.hands_played_percentage, high increase in range.   // Can be ignored, maybe take it into account always.  
            // If high data.hands_played_percentage, low increase in range. 
            // let c  = 1 - data.chance_of_call_a_raise; 
            // let cr = data.chance_of_raise * data.average_raise_percentage_of_pot;
            // let hp = data.hands_played_percentage;
            // let w_cr, w_hp, w_c, i_c, i_cr, i_hp;
            w_cr = w_hp = w_c = i_c = 1;
            i_c = 1;
            i_hp = 0.6;
            i_cr = 0.2;

            if(data.current_range.range_Low < 38) {
                w_c = 40 - data.current_range.range_low;                 // Potentielt gange forskellige konstanter på hver af disse vægte
                w_hp = 40 - data.current_range.range_low;
                w_cr = 40 - data.current_range.range_Low;
            } else if(data.current_range.range_Low < 60) {
                w_c = 10;
                w_cr = 10;                                               //Skal fintunes
                w_hp = 10; 
            } 

            data.current_range.range_Low = data.current_range.range_Low + (c * w_c * i_c) + (cr * w_cr * i_cr) + (hp * w_hp * i_hp);
            
            if(data.current_range.range_Low > 60) {
                data.current_range.range_Low = 60;
            }
            data.current_range.range_high = data.current_range.range_Low + 30;  
            
            range_control_call(data.current_range);
            return data.current_range; 
            
        } else if (player_move.move == "raise") {
            if(first) {
                if(ra > 0.8) {
                    data.current_range.range_Low = 50;
                } else if(ra > 0.5) {
                    data.current_range.range_Low = 48;
                } else if(ra > 0.2) {
                    data.current_range.range_Low = 45;
                } else if(ra > 0.1) {
                    data.current_range.range_Low = 42;
                } else {
                    data.current_range.range_Low = 34;
                }
            }
            //In general, increase the range more then when called. 

            //If high data.chance_of_raise, low increase
            //If low data.chance_of_raise, high increase

            //if low raise compared to - average_raise_percentage_of_pot -, low increase in range. 
            //if high raise compared to - average_raise_percentage_of_pot -, high increase in range. 

            // If low data.hands_played_percentage, high increase in range.   // Can be ignored, maybe take it into account always.  
            // If high data.hands_played_percentage, low increase in range. 

            let factor = ra; 
            
            if(ra > 1) {
                factor = Math.pow(ra, 1-ra) * (-1) + 2;
                
            } else if(ra > 0.2) {
                factor = Math.pow(ra, ra-1);
            }
            let max_range = 10;
            
            if(factor < 1.5) {
                data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/10, (1 - (cr * hp)) + factor/2) * factor; 
            } else {
                data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/10, (1 - (cr * hp)) + factor/3) * factor; 
            }
            range_control_raise(data.current_range);
            return data.current_range; 
        }
    }

    return {
        range_low: 45, 
        range_high: 78
    }
}

function range_control_check(current_range) {

    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in range_control check"); 
    }

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in, range_control check"); 
    }
}

function range_control_call(current_range) {
    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in range_control call"); 
    }

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in, range_control call"); 
    }
}

function range_control_raise(current_range) {
    if(current_range.range_Low > 62) {
        current_range.range_Low = 62;
    }
    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in, range_control raise"); 
    }
    
}

module.exports.determine_range = determine_range;
module.exports.range_control_call = range_control_call;
module.exports.range_control_check = range_control_check;
module.exports.range_control_raise = range_control_raise;