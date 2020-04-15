const monte_carlo = require("../monte_carlo");
const Card = require("../../classes/class_card");
const Player = require("../../classes/class_player");
const Dealer = require("../../classes/class_dealer");

data = {
    fold_when_raised: 0, 
    fold_when_sb: 0,
    chance_of_fold_when_raised: 0,
    
    raises: 0,
    average_raise_percentage_of_pot: 0, 

    call_a_raise: 0,
    chance_of_call_a_raise: 0,

    range: {
        range_Low = 35, 
        range_high = 100
    }, 
    current_range: {
        range_Low = 35, 
        range_high = 100
    },

    total_moves: 0,
    total_preflop: 0,

    ai_fold: 0,
    ai_check: 0, 
    ai_call: 0, 
    ai_raise: 0,
    ai_total_moves: 0
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
        if(player_move == "check") {

            //Be careful of slwoplay. Might add a data.called_when_raised_when_checked

            let chance_of_raise = data.raises / data.total_moves;

            data.current_range.range_Low = data.current_range.range_Low * (1 - chance_of_raise);
            data.current_range.range_high = data.current_range.range_high * (1 - chance_of_raise); 

            return data.current_range;

        } else if(player_move == "call") {

            //chance_of_call_a_raise

            let varible_high = 0.25;
            let varible_low = 0.1;

            current_range.range_high += (100 - current_range.range_high) * varible_high;
            current_range.range_Low += (100 - current_range.range_Low) * varible_low;

            return current_range; 
        } else if (player_move == "raise") {

            let varible_high = 0.25;
            let varible_low = 0.1;
            
            let raise_size = player_move.amount / pot_size;

            //If higher raise then normal, it will be over 1, if lower raise then normal, will be below 1; 
            let current_raise_compared_to_average_raise = raise_size / data.average_raise_percentage_of_pot;

            current_range.range_high += varible_high * current_raise_compared_to_average_raise;
            current_range.range_Low += varible_low * current_raise_compared_to_average_raise;

            return current_range; 
        }
    }

    return {
        range_low: 45, 
        range_high: 78
    }
}










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
            data.total_moves += 1;
            return true;
            
        } else if(player_move.move == "call") {
            data.total_moves += 1;
            data.call_a_raise += 1;
            data.chance_of_call_a_raise = data.call_a_raise / data.ai_raise;


            return true;

        } else if(player_move.move == "raise") {
            data.total_moves += 1;

            //Validates the input raise as a proper raise, based on the size of the raise. 
            if(player_move.amount > pot_size/100) {

                let total = data.average_raise_percentage_of_pot * data.raises;
                total += player_move.amount / pot_size;
                data.raises += 1;
                data.average_raise_percentage_of_pot = total / data.raises; 
            }

        } else if(player_move.move == "fold") {
            data.total_moves += 1;

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


