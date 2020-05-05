// Initialiserende funktion der starter spillet og sender et objekt tilbage til klienten med en kopi af
// player1, potten samt hvis tur det er. 
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
// Næste runde indkapsler flop, turn og river. Ud fra dealeren bestemmes det hvilken runde det er. 
// Når antallet af kort er 5, sendes det tilbage, at der ikke er en new round 
function next_round(human_player, ai_player, dealer) {
    dealer.table_cards.length < 3 ? dealer.add_table_cards(3) : dealer.add_table_cards(1);

    human_player.player_move.move = "";
    ai_player.player_move.move = "";
    

    
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

// Vi skal have serveren til at modtage, at det nu er Bottens træk. Botten gives den nødvendige information, 
// som er spillerens current_bet samt bordets pulje og kort. Herfra gør den sig et træk den sætter ind robot_player.player_move
// Herved kan den nedstående funktion genbruges.


// Processer et move, hvor det antages server har modtaget player move og potentielt amount. 
// SKal fikses 
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
// Funktion, der bestemmer vinder ved showdown og sender et objekt tilbage med opdateringer på, hvordan spilelrnes
// balance ser ud. 
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