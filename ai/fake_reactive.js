game_info = {
    ai_hand: [],
    table_cards: [4,3,2,1,5],
    pot: 100,
    ai_balance: 3,
    player_balance: 3,
    ai_current_bet: 3,
    player_move: { move: "raise", amount: 50 },
}
equity = 0.37;
rounds_left = find_rounds_left(game_info.table_cards.length);

//for(i = 1; i < 99; i++){
//	game_info.player_move.amount = i; 
//	console.log(move_reactive(equity, game_info), /*move_reactive_2(equity, game_info),*/ /*equity,*/ opponent_bet(rounds_left, game_info) / pot_pre_bet(rounds_left, game_info));
	//console.log(equity * call_winnings(rounds_left, game_info) - (1-equity) * call_losses(rounds_left, game_info),equity);
//}

for (equity = 0; equity < 1; equity +=0.05){
	let bet_percent =  opponent_bet(rounds_left, game_info) / pot_pre_bet(rounds_left, game_info);
	let initial_bet = game_info.player_move.amount;
	let initial_pot = game_info.pot - initial_bet;
	potOdds = pot_odds(initial_pot, initial_bet);
	console.log(move_reactive(equity, game_info), move_reactive_3(equity, game_info), equity, "and", bet_percent, "and", potOdds);
}



function move_reactive_2(equity, game_info){
	let EV_raise = 0;
	let EV_call = 0;
	let rounds_left = 0;
	let EV_fold = 0;
	let initial_bet = game_info.player_move.amount;

	rounds_left = find_rounds_left(game_info.table_cards.length); 		//Virker
	EV_call     = equity * call_winnings(rounds_left, game_info) - (1-equity) * opponent_bet(rounds_left, game_info);
	EV_fold     = 0;

	return EV_call > EV_fold ? { ai_move: "call", amount: initial_bet} : { ai_move: "fold", amount: 0 };	
}

//Modstaneren har raiset. 
function move_reactive(equity, game_info) {	
	let EV_raise = 0;
	let EV_call = 0;
	let rounds_left = 0;
	let EV_fold = 0;
	let initial_bet = game_info.player_move.amount;

	rounds_left = find_rounds_left(game_info.table_cards.length); 		//Virker
	EV_call     = equity * call_winnings(rounds_left, game_info) - (1-equity) * call_losses(rounds_left, game_info);
	EV_fold     = 0;

	return EV_call > EV_fold ? { ai_move: "call", amount: initial_bet} : { ai_move: "fold", amount: 0 };
}

//input: round: round in relation to initial round, round 0 (the round we are currently in real time)
//output: total amount of money we can potentially win, if we call the rest of opponent's raises til showdown
//calculates the potential winnings from calling in round: sum of current round's pot and current round's bet
function call_winnings(round, game_info) {
	return pot_pre_bet(round, game_info) + opponent_bet(round, game_info);
}

//output: total amount of money we can potentially lose, if we call the rest of opponent's raises til showdown
//calulates sum of previous round's losses (money we have thrown into pot) and current bet to be made
function call_losses(round, game_info) {
	let initial_bet = game_info.player_move.amount;

	if (round === 0)
		return initial_bet;
	else 
		return call_losses(round-1, game_info) + opponent_bet(round, game_info);
}

//output: amount of money in pot in a given round (before any bets are added in said round)
function pot_pre_bet(round, game_info) {
	let initial_pot = game_info.pot - game_info.player_move.amount;

	if (round === 0)
		return initial_pot;
	else
		return pot_pre_bet(round-1, game_info) + 2 * opponent_bet(round-1, game_info);
}

//output: size of bet in a given round, given opponent bets the same each round
function opponent_bet(round, game_info) {
	let initial_bet = game_info.player_move.amount;
	let initial_pot = game_info.pot - initial_bet;
	let bet_percent_of_pot = initial_bet / initial_pot;

	if(round === 0)
		return initial_bet;
	else
		return bet_percent_of_pot * pot_pre_bet(round, game_info);
}

function pot_odds(pot, bet){
	return bet / (pot+bet);
}


//output: returns amount of rounds left (not including current) based on number of cards on table
function find_rounds_left(table_cards){
	switch(table_cards) {
		case 0: return 3;
		case 3: return 2;
		case 4: return 1;
		case 5: return 0;
		default: console.log("error: table cards error");
	}
}

//Bliver abused med pot odds, da modstanderen blot kan bette højt for at få os til at folde
function move_reactive_3(equity, game_info){
	let EV_raise = 0;
	let EV_call = 0;
	let rounds_left = 0;
	let EV_fold = 0;
	let initial_bet = game_info.player_move.amount;
	let initial_pot = game_info.pot - initial_bet;
	let potOdds = 0;

	potOdds = pot_odds(initial_pot, initial_bet);

	//rounds_left = find_rounds_left(game_info.table_cards.length); 		//Virker
	//EV_call     = equity * call_winnings(rounds_left, game_info) - (1-equity) * opponent_bet(rounds_left, game_info);
	EV_fold     = 0;

	goodsOdds = potOdds < equity;


	return goodsOdds === true ? { ai_move: "call", amount: initial_bet} : { ai_move: "fold", amount: 0 };	
}