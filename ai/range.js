const monte_carlo = require("../monte_carlo");
const Card = require("../../classes/class_card");
const Player = require("../../classes/class_player");
const Dealer = require("../../classes/class_dealer");

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
        range_Low: 55, 
        range_high: 100
    }, 
    current_range: {
        range_Low: 34, 
        range_high: 100
    }
}


// Called before ai_move in the preflop
function determine_range(data, player_move, pot_size) {
    
    if(data.total_moves < 30) {
        return false;
    }

    //AI is sb and player hasent done a move yet. 
    if(player_move == undefined) {

        data.player_average_range = data.fold_when_sb / data.total_preflop;
        return data.range

    } else {
        if(player_move.move == "check") {
        //Lower range_high alot, and lower range_low
        //If high data.chance_of_raise lower everything significant, bot the higher and lower. 
        //If low data.chance_of_raise, dont lower much
            // AND high data.hand_played_percentage, we cant chance much. 
            // AND low data.hand_played_percentage, it can be a good hand. 

            //Be careful of slwoplay. Might add a data.called_when_raised_when_checked
            let var_low = 1.3;
            let var_high = 1.3;

            data.current_range.range_Low = data.current_range.range_Low * (1 - data.chance_of_raise * var_low);
            data.current_range.range_high = data.current_range.range_high * (1 - data.chance_of_raise * var_high); 

            range_cotrol(data.current_range);
            return data.current_range;


        } else if(player_move.move == "call") {
            //In general: increase range. 
            // If high data.chance_of_call_a_raise, low increase in range. 
            // If low data.chance_of_call_a_raise, high increase in range. 

            // If high data.chance_of_raise, low increase in range. 
            // If low data.chance_of_raise, high increase in range. 

            // If low data.hands_played_percentage, high increase in range.   // Can be ignored, maybe take it into account always.  
            // If high data.hands_played_percentage, low increase in range. 

            let k = data.chance_of_call_a_raise;    //0.25

            let j = data.chance_of_raise;  //0.2


            data.current_range.range_high += (100 - data.current_range.range_high) * (1 - k);
            data.current_range.range_Low += (100 - data.current_range.range_Low) * ((1 - k) - j*2);
            
            // (100-35)*(1-0.25) = (65) * (0.75) 
            // (100-55)*(1-0.25) = (45) * (0.75) 

            range_cotrol(data.current_range);
            return data.current_range; 
            
        } else if (player_move.move == "raise") {
            //In general, increase the range more then when called. 

            //If high data.chance_of_raise, low increase
            //If low data.chance_of_raise, high increase

            //if low raise compared to - average_raise_percentage_of_pot -, low increase in range. 
            //if high raise compared to - average_raise_percentage_of_pot -, high increase in range. 

            // If low data.hands_played_percentage, high increase in range.   // Can be ignored, maybe take it into account always.  
            // If high data.hands_played_percentage, low increase in range. 


            let var_high = 0.25;
            let var_low = 0.1;

            
            let raise_size = player_move.amount / pot_size;  //How big is the raise compared to the pot size

            //If higher raise then normal, it will be over 1, if lower raise then normal, will be below 1; 
            let current_raise_compared_to_average_raise = raise_size / data.average_raise_percentage_of_pot;

            data.current_range.range_high += var_high * current_raise_compared_to_average_raise;
            data.current_range.range_Low += var_low * current_raise_compared_to_average_raise;

            range_cotrol(data.current_range);
            return data.current_range; 
        }
    }

    return {
        range_low: 45, 
        range_high: 78
    }
}

function range_cotrol(current_range) {

    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in range_control"); 
    }

    if(current_range.range_high > 100) {
        current_range.range_high = 100;
    }
    if(current_range.range_Low < 30) {
        current_range.range_Low = 30; 
    }
    if(current_range.range_high - 3 < current_range.range_low) {
        console.log("Error in, range_control"); 
    }
}



// Only updates the players actions
// Called when oppenent makes a move or
// Called when preflop is over.  
function storage(player_move, ai_move, preflop_over_flag, data, bb, pot_size) {

    //If the round is over. 
    if(ai_move.move == "fold" && player_move.move == "raise") {
        data.ai_fold += 1;
        data.total_preflop += 1;
        return true;
    }
    if(preflop_over_flag === 1) {
        data.total_preflop += 1;

    } else if (preflop_over_flag === 0) {

        if(player_move.move == "check") {
            data.player_check += 1;
            data.total_moves += 1;
            return true;
            
        } else if(player_move.move == "call") {
            data.player_call += 1;
            data.total_moves += 1;
            data.call_a_raise += 1;
            data.chance_of_call_a_raise = data.call_a_raise / data.ai_raise;
            return true;

        } else if(player_move.move == "raise") {
            data.total_moves += 1;
            data.player_raise += 1;

            //Validates the input raise as a proper raise, based on the size of the raise. 
            if(player_move.amount > pot_size/100) {

                let total = data.average_raise_percentage_of_pot * data.raises;
                total += player_move.amount / pot_size;
                data.raises += 1;
                data.average_raise_percentage_of_pot = total / data.raises; 

                data.chance_of_raise = data.raises / (data.total_moves - data.player_fold);

            }

        } else if(player_move.move == "fold") {
            data.player_fold += 1;
            data.total_moves += 1;
            data.player_hands_played_per = 1 - (data.player_fold / data.total_moves);

            if(ai_move.move == "raise") {

                data.fold_when_raised += 1;
                data.chance_of_fold_when_raised = data.fold_when_raised / data.ai_raise;
            } else {
                data.fold_when_sb += 1;
            }

        }
        
    }
    return true;
}

module.exports.determine_range = determine_range;
module.exports.range_cotrol = range_cotrol;