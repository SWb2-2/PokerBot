//increases tally pokerai's own move
function store_ai_move(move, data) {
    data.ai_total_moves += 1;
    if(move == "check") {
        data.ai_check += 1;
    } else if(move == "raise") {
        data.ai_raise += 1;
    } else if(move == "fold") {
        data.ai_fold += 1;
    } else if(move == "call") {
        data.ai_call += 1;
    }
}

//keeps track of opponents playstyle in preflop, postflop, and overall
function store_player_move(player, ai_move, pot_size, data, pre_flop) {
    if(player.move == "check") {
        data.player_check += 1;
        data.total_moves += 1;
        return true;
        
    } else if(player.move == "call") {
        data.player_call += 1;
        data.call_a_raise += 1;
        data.total_moves += 1;
        if(data.ai_raise !== 0) {
            data.chance_of_call_a_raise = data.call_a_raise / data.ai_raise;
        } else {
            data.chance_of_call_a_raise = 0.5; 
        }
        data.vpip = (data.player_call + data.raises) / data.total_moves;
        return true;

    } else if(player.move == "raise") {
        data.total_moves += 1;
        data.player_raise += 1;

        //Validates the input raise as a proper raise, based on the size of the raise. 
        if(player.amount > pot_size/100) {

            let total = data.average_raise_percentage_of_pot * data.raises;
            total += player.amount / pot_size;
            data.raises += 1;
            data.average_raise_percentage_of_pot = total / data.raises; 
            data.chance_of_raise = data.raises / (data.total_moves);
            data.vpip = (data.player_call + data.raises) / data.total_moves;
        }

    } else if(player.move == "fold") {
        data.player_fold += 1;
        data.total_moves += 1;
        if(data.ai_raise !== 0) {
            data.chance_of_call_a_raise = data.call_a_raise / data.ai_raise;
        }
 
        if(ai_move == "raise") {
            data.fold_when_raised += 1;
            data.chance_of_fold_when_raised = data.fold_when_raised / data.ai_raise;
        } else {
            data.fold_when_sb += 1;
        }
    }
    if(data.total_preflop != 0 && pre_flop === true) {
        data.hands_played_percentage = 1 - (data.player_fold / data.total_preflop);
    }
}

module.exports.store_player_move = store_player_move;
module.exports.store_ai_move = store_ai_move;