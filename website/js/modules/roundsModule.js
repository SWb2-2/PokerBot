// Initialiserende funktion der starter spillet og sender et objekt tilbage til klienten med en kopi af
// player1, potten samt hvis tur det er. 
function pre_flop(player1, player2, dealer) {
    dealer.new_game(player1, player2);
    dealer.create_deck_of_cards();
    dealer.shuffle_array();
    dealer.make_blind(player1, player2);
    dealer.pay_blinds(player1, player2, 10, 5);
    dealer.give_hand_cards(player1, player2);
    console.log(player1.blind);
    let response = {
        client: player1,
        bot: player2,
        pot: dealer.pot,
        whose_turn: player1.blind === "sb" ? "player" : "robot"
    };
    return response;
}
// Næste runde indkapsler flop, turn og river. Ud fra dealeren bestemmes det hvilken runde det er. 
// Når antallet af kort er 5, sendes det tilbage, at der ikke er en new round 
function next_round(human_player, robot_player, dealer) {
    let no_new_round = false;
    dealer.table_cards.length < 3 ? dealer.add_table_cards(3) : dealer.add_table_cards(1);
    if(dealer.table_cards.length === 5) {
        no_new_round = true;
    }

    human_player.player_move.move = "";
    robot_player.player_move.move = "";
    
    let turn = "";

    if (human_player.balance === 0 || robot_player.balance === 0) {
        if (dealer.table_cards.length === 5) {
            turn = "showdown";
        } else {
            turn = "table";
        }
    } else {
        turn = human_player.blind === "sb" ? "player" : "robot";
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
function process_move(player1, player2, dealer) {
    let difference = player2.current_bet - player1.current_bet;
    switch (player1.player_move.move) {
        case "call":
            player1.player_move.amount = difference;
            
            if(player1.balance < player1.player_move.amount) {
                player1.player_move.amount = player1.balance;
            }
            difference = 0;
            player1.current_bet += player1.player_move.amount;
            player1.balance -= player1.player_move.amount;
            dealer.pot += player1.player_move.amount;
            break;
        case "raise":
                let bet = difference + player1.player_move.amount; 
                player1.current_bet += bet
                dealer.pot += bet
                player1.balance -= bet
           
                if(player1.balance === 0 || player2.balance === 0) {
                    player1.player_move.move = "all-in";
                }
                break;
        default:
            break;
    }

    let is_round_done = dealer.end_betting_round(player1, player2);
    let nextMove = is_round_done === true ? "table" : player2.name;

    let is_game_finished = false;
    
    if(is_round_done === true && dealer.table_cards.length === 5) {
        is_game_finished = true;
    }
    
    let response = {
        pot: dealer.pot,
        player_balance: player1.balance,
        player_current_bet: player1.current_bet,
        player_move: player1.player_move.move,
        player_amount: player1.player_move.amount,
        whose_turn: is_game_finished === true || player1.player_move.move === "fold" ? "showdown" : nextMove
    }
    return response;
}
// Funktion, der bestemmer vinder ved showdown og sender et objekt tilbage med opdateringer på, hvordan spilelrnes
// balance ser ud. 
function showdown(player1, bot, dealer) {
    if(player1.player_move.move !== "fold") {
        let winner = dealer.get_winner(player1, bot);
        console.log(winner);
        if(winner.winner !== "draw" && player1.player_move.move === 'all-in' && bot.player_move.move === 'all-in') {
            
            if(player1.current_bet >= bot.current_bet && winner.winner === bot) {
                dealer.give_pot(bot, player1);
                
            } else if(player1.current_bet <= bot.current_bet && winner.winner === player1) {
                dealer.give_pot(player1, bot);
            } else {
                winner.winner.name === "player" ? dealer.give_pot(player1) : dealer.give_pot(bot);
            }

        } else {
            
            winner.winner === "draw" ? dealer.give_pot(player1, bot, true) : dealer.give_pot(winner.winner);
        }
        let response = {
            player_balance: player1.balance,
            bot_balance: bot.balance,
            pot: dealer.pot,
            winner: winner.winner === "draw" ? "draw" : winner.winner.name, 
            player_best_hand: winner.human_hand,
            ai_best_hand: winner.ai_hand
        }
        return response;
    } else {
        player1.player_move.move === "fold" ? dealer.give_pot(bot) : dealer.give_pot(player1)
        let response = {
            player_balance: player1.balance,
            ai_balance: bot.balance,
            pot: dealer.pot,
            winner: player1.player_move.move === "fold" ? bot.name : player1.name, 
        }
        return response;
    }
}

module.exports.pre_flop = pre_flop;
module.exports.next_round = next_round;
module.exports.process_move = process_move;
module.exports.showdown = showdown;