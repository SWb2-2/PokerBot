const monte_carlo = require("./monte_carlo");
const Card = require("../../website/js/classes/card");
const Player = require("../../website/js/classes/player");
const Dealer = require("../../website/js/classes/dealer");

// Find the range of a given player, based on information about their playstyle
// and their current move
function determine_range(data, player_move, pot_size, first) {
    if(data.total_moves < 10) {
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
        return data.range;

    } else {
        // Variables used in all the functions
		let ra = player_move.amount / (pot_size - player_move.amount);
		if (ra < 0) {
			console.log("ERROR: ra is lower than zero");
		}	

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

            data.current_range.range_Low = data.current_range.range_high - 30; 

			range_control_check_call(data.current_range);
			
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

            let j = 10 - (data.current_range.range_Low / 10); 

            data.current_range.range_Low += (data.chance_of_raise / data.vpip) * j * 0.2 + (1 - data.vpip) * j * 0.8; 
            
            if(data.current_range.range_Low > 60) {
                data.current_range.range_Low = 60;
            }
            data.current_range.range_high = data.current_range.range_Low + 30;  
        
            range_control_check_call(data.current_range);
           
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
            
            data.current_range.range_Low += (Math.pow(10, 3.5 - st)/data.current_range.range_Low) - (data.current_range.range_Low/10);
            
			data.current_range.range_high = data.current_range.range_Low + 30;
			
            range_control_raise(data.current_range);
            
            return data.current_range; 
        }
    }
    return data.current_range;
}

//Make sure the range is legetimate, and caps it
function range_control_check_call(current_range) {

    if(current_range.range_high > 86) {
        current_range.range_high = 86;
    }
    if(current_range.range_Low < 34) {
        current_range.range_Low = 34; 
	}
	
    if(current_range.range_high - 3 < current_range.range_Low) {
		console.log("Error in range_control check and call", current_range); 
		current_range.range_high = current_range.range_high + 3 + Math.abs(current_range.range_high - current_range.range_Low);
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
		console.log("Error in range_control raise", current_range); 
		current_range.range_high = current_range.range_high + 3 + Math.abs(current_range.range_high - current_range.range_Low);
    }
}

module.exports.determine_range = determine_range;
module.exports.range_control_check = range_control_check_call;
module.exports.range_control_raise = range_control_raise;