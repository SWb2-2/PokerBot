const monte_carlo = require("./monte_carlo");
const Card = require("../../website/js/classes/card");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");

// Find the range of a given player, based on information about their playstyle
// and their current move
function determine_range(data, player_move, pot_size, first) {

    if(data.total_moves < 10) { // Husk at ændre tilbage
    console.log("I range");
        if(player_move.move == "check") {
    console.log("I check");

            data.current_range.range_Low = 34;
            data.current_range.range_high = 65;
        } else if(player_move.move == "call") {
    console.log("I call");

            data.current_range.range_Low = 40;
            data.current_range.range_high = 86;
        } else if (player_move.move == "raise") {
    console.log("I raose");

            data.current_range.range_Low = 45;
            data.current_range.range_high = 86;     
        }
    console.log("I return");

        return data.current_range;
    }

    //AI is sb and player hasent done a move yet. 
    console.log("Her er vi, hvor player move er: ", player_move);
    if(player_move.move == undefined) {
        //data.player_average_range = data.fold_when_sb / data.total_preflop;
        return data.range;

    } else {
        // Variables used in all the functions
        let cr = data.chance_of_raise;  
        let hp = data.hands_played_percentage;
        let c  = 1 - data.chance_of_call_a_raise; 
        let ra = player_move.amount / pot_size;
        console.log("Ra is ", ra, " Pot is ", pot_size, " amount is ", player_move.amount);
        let w_cr, w_hp,  w_c;
        let i_cr, i_hp, i_c;
        w_cr = w_hp = w_c = w_ra = 1;
        i_cr = i_hp = i_c = i_ra = 1; 
        
        if(player_move.move == "check") {
            if(first) {
                data.current_range.range_Low = 34;
                data.current_range.range_high = 65;
            }
            
            //Lower range_high alot, and lower range_low
            //If high data.chance_of_raise lower everything significant, both the higher and lower. 
            //If low data.chance_of_raise, dont lower much
                // AND high data.hand_played_percentage, we cant chance much. 
                // AND low data.hand_played_percentage, it can be a good hand. 
            
            w_cr = w_hp = 1;
            i_cr = 1
            i_hp = 0.2;

            if(data.current_range.range_high > 70) {
                w_cr = (data.current_range.range_high - 40) * 1;        
                w_hp = (data.current_range.range_high - 40) * 0.75; 

            } else if(data.current_range.range_high > 60) {
                w_cr = (data.current_range.range_high - 48) * 0.75;        
                w_hp = (data.current_range.range_high - 48) * 0.5; 

            } else if(data.current_range.range_high > 40) {
                w_cr = 10;                                               
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
    
            w_cr = w_hp = w_c = i_c = 1;
            i_c = 1;
            i_hp = 0.6;
            i_cr = 0.2;

            if(data.current_range.range_Low < 38) {
                w_c = 40 - data.current_range.range_Low;                 
                w_hp = 40 - data.current_range.range_Low;
                w_cr = 40 - data.current_range.range_Low;
            } else if(data.current_range.range_Low < 60) {
                w_c = 10;
                w_cr = 10;                                               
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
                    data.current_range.range_Low = 52;
                } else if(ra > 0.5) {
                    data.current_range.range_Low = 50;
                } else if(ra > 0.2) {
                    data.current_range.range_Low = 48;
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
            console.log(ra, "dette er ra");
            console.log("Range before is ", data.current_range.range_Low);
            if(ra > 1) {
                factor = Math.pow(ra, 1-ra) * (-1) + 2;
                
            } else if(ra > 0.2) {
                factor = Math.pow(ra, 1-ra);
            }
            console.log("Chance of Raise = ", cr, " Hands played = ", hp);
            let max_range = 8.6;
            
            if(cr >= 0.6 && hp >= 0.7 && factor > 1.5) {
                console.log("Get outta here with your shitty raises");
                data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/max_range, (1 - (cr * hp)) + factor/3) * (factor/2);
                // Kunne overveje en fast range her også hvis det er. 
            }
            else if(factor < 1.3) {
                console.log("Faktoren er ", factor);
                data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/10, (1 - (cr * hp)) + factor/2) * factor; 
            } else {
                console.log("We cuttin this up");
                data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/10, (1 - (cr * hp)) + factor/3) * factor; 
            }
            
            console.log("Your range is: ", data.current_range.range_Low, " After a bet of", player_move.amount);
            data.current_range.range_high = data.current_range.range_Low + 30;
            range_control_raise(data.current_range);
            return data.current_range; 
        }
    }
    return data.range;
}

//Make sure the range is legetimate, and caps it
function range_control_check(current_range) {

    if(current_range.range_high - 3 < current_range.range_Low) {
        console.log("Error in range_control check"); 
    }

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_Low) {
        console.log("Error in, range_control check"); 
    }
}


//Make sure the range is legetimate, and caps it
function range_control_call(current_range) {
    if(current_range.range_high - 3 < current_range.range_Low) {
        console.log("Error in range_control call"); 
    }

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_Low) {
        console.log("Error in, range_control call"); 
    }
}

//Make sure the range is legetimate, and caps it
function range_control_raise(current_range) {
    if(current_range.range_Low > 65) {
        current_range.range_Low = 65;
    }
    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_Low) {
        console.log("Error in, range_control raise"); 
    }
    
}

module.exports.determine_range = determine_range;
module.exports.range_control_call = range_control_call;
module.exports.range_control_check = range_control_check;
module.exports.range_control_raise = range_control_raise;