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
        bot: player2.balance,
        pot: dealer.pot,
        whose_turn: player1.blind === "sb" ? "Player" : "AI"
    };
    return response;
}
// Næste runde indkapsler flop, turn og river. Ud fra dealeren bestemmes det hvilken runde det er. 
// Når antallet af kort er 5, sendes det tilbage, at der ikke er en new round 
function next_round(player1, dealer) {
    let no_new_round = false;
    dealer.table_cards.length < 3 ? dealer.add_table_cards(3) : dealer.add_table_cards(1);
    if(dealer.table_cards.length === 5) {
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
// SKal fikses 
function process_move(player1, player2, dealer) {
    if(player1.player_move.move !== "fold") {
        // Vi skal lige kigge på end_betting_round, da den afhænger af, om begge spillere har gjort deres træk.
        if(player1.player_move.move === 'call') {
            player1.player_move.amount = player2.current_bet - player1.current_bet;
            
            if(player1.balance < player1.player_move.amount) {
                player1.player_move.amount = player1.balance;
            }
        }
        player1.current_bet += player1.player_move.amount;
        dealer.pot += player1.player_move.amount; 
        player1.balance -= player1.player_move.amount;
        
        if(player1.balance === 0) {
            player1.player_move.move = "all-in";
        }
        let is_round_done = dealer.end_betting_round(player1, player2);
        let sb_player = '';
        // Måske lidt overkill
        if(is_round_done === true) {
            player1.blind === 'sb' ? sb_player = player1.name : sb_player = player2.name;
        }
        let response = {
            pot: dealer.pot,
            player_current_bet: player1.current_bet,
            player_balance: player1.balance,
            player_move: player1.player_move.move,
            player_amount: player1.player_move.amount,
            end_of_round: is_round_done,
            game_finished: (is_round_done === true && dealer.table_cards.length === 5) ? true : false,
            whose_turn: sb_player === '' ? player2.name : sb_player
        }
        return response;
    
    } else {
        dealer.give_pot(player2);
        
        let response = {
            player_balance: player1.balance,
            player_move: player1.player_move.move,
            player2_balance: player2.balance,
            pot: dealer.pot,
            end_of_round: true,
            game_finished: true,
            winner: player2.name,
            bot_hand: player1.name === 'AI' ? player1.hand : player2.hand
        }
        return response;
    }
}
// Funktion, der bestemmer vinder ved showdown og sender et objekt tilbage med opdateringer på, hvordan spilelrnes
// balance ser ud. 
function showdown(player1, bot, dealer) {
    let winner = dealer.get_winner(player1, bot);
    if(player1.player_move.move === 'all-in' && bot.player_move.move === 'all-in' && winner !== false) {
        
        if(player1.current_bet >= bot.current_bet && winner === bot) {
            dealer.give_pot(bot, player1);

        } else if(player1.current_bet <= bot.current_bet && winner === player1) {
            dealer.give_pot(player1, bot);
        } else {
            dealer.give_pot(winner);
        }

    } else {
        winner === false ? dealer.give_pot(player1, bot, true) : dealer.give_pot(winner);
    }
    let response = {
        player_balance: player1.balance,
        bot_balance: bot.balance,
        pot: dealer.pot,
        winner: winner === false ? "draw" : winner.name, 
        // player best hand ???
        // ai best hand ???
        no_new_game: player1.balance === 0 || bot.balance === 0 ? true : false
    }
    return response;
}

module.exports.pre_flop = pre_flop;
module.exports.next_round = next_round;
module.exports.process_move = process_move;
module.exports.showdown = showdown;