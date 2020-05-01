const ai = require("../ai");
game_info = {
    ai_hand: [],
    table_cards: [],
    pot: 100,
    ai_balance: 3,
    player_balance: 3,
    ai_current_bet: 3,
    player_move: { move: "raise", amount: 99},
}

test2();

function test2(){
	adjust_comp();
	comp_check();

	function adjust_comp(){
		let bet_percent_of_pot = 0;
		let call_chance = 0.7;

		for(bet_percent_of_pot = 0.3; bet_percent_of_pot < 1.2; bet_percent_of_pot +=0.05){
			console.log(ai.adjust_call_chance(call_chance, bet_percent_of_pot), bet_percent_of_pot);
		}


	}

	function comp_call(){
		let call = 0;


	}
	//hvis dette er tilgangen, så kunne man lige så godt fortælle den at den skal raise under 55% call chance, da det er der den laver breaket
	function comp_check(){
		pot = 10;
		equity = 0.45
		let bet_percent_of_pot =  0.5;//((Math.random() / 2) + 0.5)
		let raise_amount = 0;
		let call_chance = 0.5;
		let adjusted_call_chance = 0;
		for(let equity = 0.2; equity < 0.5; equity += 0.02){
			bet_percent_of_pot = 0.5;
			do{
				adjusted_call_chance = ai.adjust_call_chance(call_chance, bet_percent_of_pot);
				bet_percent_of_pot += 0.05;
				raise_amount = bet_percent_of_pot * pot;
				bluff = ai.calc_EV_raise_bluff(call_chance, pot, raise_amount, equity);
				check = ai.calc_EV_check(equity, pot);
			} while(bluff < check && bet_percent_of_pot <= 1);

			console.log("bluff:",bluff, "check:",check,"equity", equity, "bet%",bet_percent_of_pot, "call_chance", adjusted_call_chance);
		}
	}


}

function test1(){
	rounds_left = 3
	new_pot = 110;
	new_raise = 30;
	expected_call = new_raise;
	raise_ratio = new_raise / (new_pot - new_raise);
	equity = 0.34;
	for(equity = 0.2; equity < 0.90; equity += 0.05){
		for(let i = 0; i < rounds_left; i++) {
			//console.log(new_raise);
			new_pot += new_raise; 				//Vores call af potten 

			//new_raise = new_pot * raise_ratio; 	//hans nye raise. 
			//console.log(new_raise);
			new_pot += new_raise; 				//Hans nye raise til potten. 

			expected_call += new_raise; 
		}
		final_win_pot = new_pot + new_raise; //størrelsen af potten med vores sidste bet; den endelige præmie
		winnings = final_win_pot - expected_call; //hvor meget af potten der er profit (uden vores egne bets) – stemmer overens med expected value
		EV_call  = equity*(winnings) - (1-equity)*expected_call;
		console.log("call",expected_call,"newpot", new_pot, "finalpot",final_win_pot, "winnings",winnings, "evcall",EV_call, "ratio",raise_ratio, "equity", equity);
	}
}


/*rounds_left = find_rounds_left(game_info.table_cards.length);

//for(i = 1; i < 99; i++){
//	game_info.player_move.amount = i; 
//	console.log(move_reactive(equity, game_info), /*move_reactive_2(equity, game_info), equity, opponent_bet(rounds_left, game_info) / pot_pre_bet(rounds_left, game_info));
	//console.log(equity * call_winnings(rounds_left, game_info) - (1-equity) * call_losses(rounds_left, game_info),equity);
//}

for (let equity = 0.34; equity < 0.87; equity += 0.01){
	let initial_bet = game_info.player_move.amount;
	let initial_pot = game_info.pot - initial_bet;
	let bet_percent_of_pot = initial_bet / initial_pot;
	console.log(move_reactive(equity, game_info), move_reactive2(equity, game_info), equity, "and", bet_percent_of_pot);
}*/

//Modstaneren har raiset. 
function move_reactive2(equity, game_info) {	
	let EV_raise = 0;
	let EV_call = 0;
	let rounds_left = 0;
	let EV_fold = 0;
	let initial_bet = game_info.player_move.amount;
	let initial_pot = game_info.pot - initial_bet;
	
	EV_call     = equity * (initial_bet + initial_pot) - (1-equity) * initial_bet;
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