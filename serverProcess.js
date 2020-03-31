// Initialiserende funktion der starter spillet og sender et objekt tilbage til klienten med en kopi af
// player1, potten samt hvis tur det er. 
function pre_flop(player1, player2, dealer) {
    dealer.new_game(player1, player2);
    dealer.create_deck_of_cards();
    dealer.shuffle_array();
    dealer.make_blind(player1, player2);
    dealer.give_hand_cards(player1, player2);
    
    let response = {
        client: player1,
        pot: dealer.pot,
        whose_turn: player1.blind === "sb" ? "Player" : "AI"
    };
    return response;
}

function next_round(player1, dealer) {
    let no_new_round = false;
    dealer.table_cards.length < 3 ? dealer.add_table_cards(3) : dealer.add_table_cards(1);
    
    if(dealer.table_cards.length > 5) {
        dealer.table_cards = [];
        no_new_round = true;
    }

    let response = {
        table_cards: dealer.table_cards,
        whose_turn: player1.blind === "sb" ? "Player" : "AI",
        end_of_game: no_new_round
    }
    return response;
}

// Vi skal have serveren til at modtage, at det nu er Bottens træk. Botten gives den nødvendige information, 
// som er spillerens current_bet samt bordets pulje og kort. Herfra gør den sig et træk den sætter ind player2.player_move
// Herved kan den nedstående funktion genbruges.


// Processer et move, hvor det antages server har modtaget player move og potentielt amount. 
function process_move(player1, player2, dealer) {
    if(player1.player_move.move !== "Fold") {
        if (player1.blind === 'sb') {
            player2.player_move.move = "";
        }
        
        if(player1.player_move.move === 'Call') {
            player1.player_move.amount = player2.current_bet - player1.current_bet;
            let difference = player1.balance - player1.player_move.amount;
            
            if(difference <= 0) {
                player1.player_move.amount = difference + player1.balance;
            }
        }
        player1.current_bet += player1.player_move.amount;
        dealer.pot += player1.player_move.amount; 
        player1.balance -= player1.player_move.amount;
        
        if(player1.balance === 0) {
            player1.player_move.move = "All-in";
        }
        let is_round_done = dealer.end_betting_round(player1, player2);
        let response = {
            pot: dealer.pot,
            player_balance: player1.balance,
            end_of_round: is_round_done,
            player_move: player1.player_move.move,
            player_amount: player1.player_move.amount,
            game_finished: (is_round_done === true && dealer.table_cards.length === 5) ? true : false,
            whose_turn: player1.name === 'AI' ? 'Player' : 'AI'
        }
        return response;
    
    } else {
        dealer.give_pot(player2);
        let response = {
            player_balance: player1.balance,
            bot_balance: bot.balance,
            pot: dealer.pot,
            end_of_round: true,
            game_finished: true,
            winner: player2.name,
            bot_hand: player1.name === 'AI' ? player1.hand : player2.hand
        }
        return response;
    }
}
// Funktion der bestemmer vinder ved showdown og sender et objekt tilbage med opdateringer på, hvordan spilelrnes
// balance ser ud. 
function showdown(player1, bot, dealer) {
    let winner = dealer.determine_winner(player1, bot);
    if (winner.length > 1) {
    dealer.give_pot(player1, bot);
    } else {
        dealer.give_pot(winner);
    }
    let response = {
        player_balance: player1.balance,
        bot_balance: bot.balance,
        pot: dealer.pot,
        // winner: winner.name 
        // player best hand ???
        // ai best hand ???
    }
    return response;
}
