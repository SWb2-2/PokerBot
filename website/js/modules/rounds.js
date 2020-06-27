//Initalizing funktion that starts the game and returns an objekt to the client
//with a copy of human player, the pot, and whose turn
function pre_flop(human_player, ai_player, dealer) {
    dealer.new_game(human_player, ai_player);
    dealer.create_deck_of_cards();
    dealer.shuffle_array();
    dealer.make_blind(human_player, ai_player);
    if(dealer.bb.set_flag == false) {
        dealer.create_blind_amount(human_player.balance);
    }
    dealer.pay_blinds(human_player, ai_player, dealer.bb.bb_size, dealer.bb.bb_size/2);
    dealer.give_hand_cards(human_player, ai_player);

    let response = {
        client: human_player,
        bot: ai_player,
        pot: dealer.pot,
        whose_turn: human_player.blind === "sb" ? human_player.name : ai_player.name
    };
    return response;
}

//Puts card on table in flop, turn, and river. When there are 5 table cards, returns that there are no more bettingrounds
function next_round(human_player, ai_player, dealer) {
    dealer.table_cards.length < 3 ? dealer.add_table_cards(3) : dealer.add_table_cards(1);
    human_player.player_move.move = "";
    ai_player.player_move.move = "";

	let first_player = human_player.blind === "sb" ? human_player : ai_player;
	let second_player = human_player.blind === "bb" ? human_player : ai_player;
    let turn = dealer.decide_whose_turn(first_player, second_player, dealer);

    if(turn != "table" && turn != "showdown") {
        turn = human_player.blind === "bb" ? human_player.name : ai_player.name;
    }

    let response = {
        table_cards: dealer.table_cards,
        whose_turn: turn
    }
    return response;
}

//Processes a move, where its assumed that the server has received a player move and potential amount 
function process_move(active_player, inactive_player, dealer) {
    let difference = inactive_player.current_bet - active_player.current_bet;
    switch (active_player.player_move.move) {
        case "call":
            active_player.player_move.amount = difference;
            
            if(active_player.balance < active_player.player_move.amount) {
                active_player.player_move.amount = active_player.balance;
            }
            difference = 0;
            active_player.current_bet += active_player.player_move.amount;
            active_player.balance -= active_player.player_move.amount;
            dealer.pot += active_player.player_move.amount;
            break;
        case "raise":
                let bet = difference + active_player.player_move.amount; 
                active_player.current_bet += bet
                dealer.pot += bet
                active_player.balance -= bet
                break;
        default:
            break;
    }

    let turn = dealer.decide_whose_turn(active_player, inactive_player, dealer);
    
    let response = {
        pot: dealer.pot,
        player_balance: active_player.balance,
        player_current_bet: active_player.current_bet,
        player_move: active_player.player_move.move,
        player_amount: active_player.player_move.amount,
        whose_turn: turn
    }
    return response;
}

//Decides the winner at showdown and returns an objekt containing player's updated current balance, the winner,
//and other information the front end needs to display
function showdown(human_player, ai_player, dealer) {
    if(human_player.player_move.move !== "fold" && ai_player.player_move.move !== "fold") {
        let winner = dealer.get_winner(human_player, ai_player);
        
        dealer.give_pot(human_player, ai_player, winner.winner);
        let storage_pot = dealer.pot; 
        dealer.pot = 0; 
        let response = {
            player_balance: human_player.balance,
            bot_balance: ai_player.balance,
            pot: dealer.pot,
            winner: winner.winner,
            player_best_hand: winner.human_hand,
            ai_best_hand: winner.ai_hand,
            ai_cards: ai_player.hand,
            storage_pot: storage_pot
        }
        return response;
    } else {
        let winner = human_player.player_move.move === "fold" ? ai_player.name : human_player.name;
        dealer.give_pot(human_player, ai_player, winner);
        
        let storage_pot = dealer.pot; 
        dealer.pot = 0; 

        let response = {
            player_balance: human_player.balance,
            bot_balance: ai_player.balance,
            pot: dealer.pot,
            winner: winner,
            storage_pot: storage_pot
        }
        return response;
    }
}

module.exports.pre_flop = pre_flop;
module.exports.next_round = next_round;
module.exports.process_move = process_move;
module.exports.showdown = showdown;