const monte_carlo = require("./monte_carlo");
const Card = require("../../website/js/classes/card");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");

// Find the range of a given player, based on information about their playstyle
// and their current move
function determine_range(data, player_move, pot_size, first) {
    //console.log("Current range", data.current_range); 

    if(data.total_moves < 10) { // Husk at ændre tilbage
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
    if(player_move.move == undefined) {
        //data.player_average_range = data.fold_when_sb / data.total_preflop;
        return data.range;

    } else {
        // Variables used in all the functions
        let cr = data.chance_of_raise;  
        let hp = data.hands_played_percentage;
        let c  = 1 - data.chance_of_call_a_raise;
        let ra = player_move.amount / pot_size;
        // //console.log("Ra is ", ra, " Pot is ", pot_size, " amount is ", player_move.amount);
        let w_cr, w_hp,  w_c;
        let i_cr, i_hp, i_c;
        w_pfr = w_vpip = w_c = w_ra = 1;
        i_pfr = i_vpip = i_c = i_ra = 1; 
        
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
            
            w_pfr = w_vpip = 1;
            i_pfr = 1
            i_vpip = 0.2;

            if(data.current_range.range_high > 70) {
                w_pfr = (data.current_range.range_high - 50) * 0.66;        
                w_vpip = (data.current_range.range_high - 50) * 0.5; 

            } else if(data.current_range.range_high > 60) {
                w_pfr = (data.current_range.range_high - 52) * 0.66;        
                w_vpip = (data.current_range.range_high - 52) * 0.5; 

            } else if(data.current_range.range_high > 40) {
                w_pfr = 4;                                               
                w_vpip = 3; 
            }

            data.current_range.range_high -= (((data.chance_of_raise / data.vpip) * w_pfr * i_pfr) + (data.vpip * w_vpip * i_vpip));


            // data.current_range.range_high = data.current_range.range_high - (cr * w_cr * i_cr) - (hp * w_hp * i_hp);
            range_control_check(data.current_range);
            // //console.log("new range after check", data.current_range);
            return data.current_range;

        } else if(player_move.move == "call") {
            ////console.log("C is ", c," Cr is ", cr, " Hp is ", hp, data.current_range);
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
    
            // w_cr = w_hp = w_c = i_c = 1;
            // i_c = 1;
            // i_hp = 0.6;
            // i_cr = 0.2;

            // if(data.current_range.range_Low < 38) {
            //     w_c = 40 - data.current_range.range_Low;                 
            //     w_hp = 40 - data.current_range.range_Low;
            //     w_cr = 40 - data.current_range.range_Low;
            // } else if(data.current_range.range_Low < 60) {
            //     w_c = 10;
            //     w_cr = 10;                                               
            //     w_hp = 10; 
            // } 

            let j = 10 - (data.current_range.range_Low / 10); 

            data.current_range.range_Low += (data.chance_of_raise / data.vpip) * j * 0.2 + (1 - data.vpip) * j * 0.8; 

            // data.current_range.range_Low = data.current_range.range_Low + (c * w_c * i_c) + (cr * w_cr * i_cr) + (hp * w_hp * i_hp);
            
            if(data.current_range.range_Low > 60) {
                data.current_range.range_Low = 60;
            }
            data.current_range.range_high = data.current_range.range_Low + 30;  
            ////console.log("Before ", data.current_range);
            range_control_call(data.current_range);
            ////console.log("After ", data.current_range);
            // //console.log("new range after call", data.current_range);
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
                data.current_range.range_high = 86;
            }
            
            //In general, increase the range more then when called. 

            //If high data.chance_of_raise, low increase
            //If low data.chance_of_raise, high increase

            //if low raise compared to - average_raise_percentage_of_pot -, low increase in range. 
            //if high raise compared to - average_raise_percentage_of_pot -, high increase in range. 

            // If low data.hands_played_percentage, high increase in range.   // Can be ignored, maybe take it into account always.  
            // If high data.hands_played_percentage, low increase in range. 

            let factor = (-0.25) * ra + 1;

            let st = factor * (1 - (data.chance_of_raise/data.vpip)) + data.vpip + (data.chance_of_raise/data.vpip - 0.5) - (data.vpip - 0.3);
            // //console.log("change in range", (Math.pow(10, 3.5 - st)/data.current_range.range_Low) - (data.current_range.range_Low/10)); 
            data.current_range.range_Low += (Math.pow(10, 3.5 - st)/data.current_range.range_Low) - (data.current_range.range_Low/10);
            ////console.log("range_low", data.current_range.range_Low);
            // let factor = ra; 
            // if(ra > 1) {
            //     factor = Math.pow(ra, 1-ra) * (-1) + 2;
                
            // } else if(ra > 0.2) {
            //     factor = Math.pow(ra, 1-ra);
            // }
            // let max_range = 8.6;
            
            // if(cr >= 0.6 && hp >= 0.7 && factor > 1.5) {
            //     data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/max_range, (1 - (cr * hp)) + factor/3) * (factor/2);
            //     // Kunne overveje en fast range her også hvis det er. 
            // }
            // else if(factor < 1.3) {
            //     data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/10, (1 - (cr * hp)) + factor/2) * factor; 
            // } else {
            //     data.current_range.range_Low += Math.pow(max_range - data.current_range.range_Low/10, (1 - (cr * hp)) + factor/3) * factor; 
            // }
            
            // //console.log("Your range is: ", data.current_range.range_Low, " After a bet of", player_move.amount);
            data.current_range.range_high = data.current_range.range_Low + 30;
            range_control_raise(data.current_range);
            // //console.log("new range after raise", data.current_range);
            return data.current_range; 
        }
    }
    return data.range;
}

//Make sure the range is legetimate, and caps it
function range_control_check(current_range) {

    if(current_range.range_high - 3 < current_range.range_Low) {
        // //console.log("Error in range_control check 1", current_range); 
    }

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_Low) {
        current_range.range_high = 3 + current_range.range_Low;
        // //console.log("Error in, range_control check 2", current_range); 
    }
}


//Make sure the range is legetimate, and caps it
function range_control_call(current_range) {
    if(current_range.range_high - 3 < current_range.range_Low) {
        // //console.log("Error in range_control call 1", current_range); 
    }

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
    }
    if(current_range.range_high - 3 < current_range.range_Low) {
        // //console.log("Error in, range_control call 2", current_range); 
    }
}

//Make sure the range is legetimate, and caps it
function range_control_raise(current_range) {
    if(current_range.range_high - 3 < current_range.range_Low) {
        // //console.log("Error in, range_control raise 1", current_range); 
    }
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
        // //console.log("Error in, range_control raise 1", current_range); 
    }
}

module.exports.determine_range = determine_range;
module.exports.range_control_call = range_control_call;
module.exports.range_control_check = range_control_check;
module.exports.range_control_raise = range_control_raise;