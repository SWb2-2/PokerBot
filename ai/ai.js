const monte_carlo = require("./ai_util/monte_carlo.js");
const range_func = require("./ai_util/range");

// Modtager
// const game_info = {
// 	ai_hand: [],
// 	table_cards: [],
// 	pot: 3,
//  blind_size: 3,
//  blind: "sb",
// 	player_move: { move: "check", amount: 13 },
// 	bluff: true
// }

//input: game_info object describing game's current state, and opponent's playstyle data
//output: object containing Ai's move and a potential amount if it is a call or raise
//Determines Ai's move based on equity, opponent's range, the state of the game, and whether bluffing is on or off
function ai(game_info, data_preflop, data_postflop, data) {
	console.log(game_info.player_move, "efuiwghuaewhgiejngiheaugnawegreauignwrigjiorghreuhgieghierhger")
	let ai_move;
	let current_round = "";
	let range = { range_low: 0, range_high: 100 }
	let equity = {};
	const num_of_sim = 141111
	

	//Get data needed to determine move
	current_round = find_round(game_info.table_cards.length);
	range         = range_func.determine_range(data, game_info.player_move, game_info.pot-game_info.player_move.amount, true);					//Check op på 
	equity        = monte_carlo.equity_range(game_info.ai_hand, num_of_sim, game_info.table_cards, range.range_Low, range.range_high);

	console.log(equity.draw_and_winrate, "wr");

	//Considers payment of big blind (when its small blind) as mandatory by considering it as a raise from the opponent
	if(game_info.pot < 2*game_info.bb_size && game_info.table_cards.length == 0) {
		game_info.player_move.move = "raise"; 
		game_info.player_move.amount = game_info.bb_size / 2; 
	}
	//equity.draw_and_winrate = 70; 
	//Use information to determine move. Includes input validation
	ai_move = determine_move(equity.draw_and_winrate / 100, current_round, game_info, data_preflop, data_postflop, data);

	//Possibility to bluff
	if(game_info.bluff == false) {		//No bluffing 

		set_final_amount(ai_move);
		confirm_bet_size(ai_move, game_info);
		return ai_move;

	} else if(game_info.bluff == true && equity.draw_and_winrate < 50 && (ai_move.ai_move == "fold" || ai_move.ai_move == "check" || ai_move.ai_move == "call")) {
		
		let relevant_data;
		
		if(current_round == "preflop") {
			relevant_data = data_preflop; 
		} else {
			relevant_data = data_postflop; 
		} 

		if(ai_move.ai_move == "check" || ai_move.ai_move == "fold"  || ai_move.ai_move == "call") {
			if(do_calculated_bluff(ai_move, equity.draw_and_winrate / 100, game_info, relevant_data, range)) {
				ai_move.bluff = "calc bluff";
				console.log("Did a alculated bluff********************************************************************")
			}	
		}

		set_final_amount(ai_move);
		confirm_bet_size(ai_move, game_info);
		return ai_move;
	}
	set_final_amount(ai_move);
	confirm_bet_size(ai_move, game_info);
	return ai_move;
}


//Input: Ai's potential move without bluff, equity, game_info, opponent's playerstyle data, opponent's range
//output: Returns true, if bluff is determined, makes Ai raise
//Calculates the chance of the Ai to bluff in a given scenario based on input paramters. The raise amount is between 0.5x and 1x the pot
function do_calculated_bluff(ai_move, equity, game_info, data, range) {
	let chance = 10; 
	
	if(ai_move.ai_move == "check") {
		if(data.total_moves > 20) {
			chance = data.chance_of_fold_when_raised * 10;				//Might change this number 
		} else {
			chance = 16;
		} 
	} else if(ai_move.ai_move == "call") {
		chance = 14; 
	} else if(ai_move.ai_move == "fold") {
		chance = 12; 		
	}

	if(data.total_moves < 10) {
		return; 
	}
	chance += equity * 30;
	//console.log(chance, "equity"); 
	chance += (data.chance_of_fold_when_raised) * 18; 		//Mest relevant. Burde sættes sammen med equity . 
	//console.log(chance, "their fold chance"); 
	chance -= ((((range.range_Low +  range.range_high) / 200) + (1-equity)) / 2) * 30; 
	//console.log(chance, "Their equity + percieved equity "); 
	chance -= (data.ai_raise / data.ai_total_moves) * 12; 
	console.log(chance, "our raise and total moves influence"); 
	//console.log(data.ai_raise, data.ai_total_moves);

	if(chance > Math.random()*100) {
		ai_move.ai_move = "raise"; 
		ai_move.amount = ((Math.random() / 2) + 0.5) * game_info.pot;
		return true;
	}
	return false; 
}

//Input: equity, current round, game_info, and opponent's playstyle
//Output: object containing Ai's move and potential amount
//First determines the relevant playstyle data and determines the type of move the Ai needs to make based on opponents move

function determine_move(equity, current_round, game_info, data_preflop, data_postflop) {
	let move_type = "";
	let relevant_data; 

	if(current_round == "preflop") {
		relevant_data = data_preflop; 
	} else {
		relevant_data = data_postflop; 
	} 

	move_type = determine_move_type(game_info.player_move.move);

	if (move_type == "reactive") {
		return move_reactive(equity, game_info, relevant_data);
	} else {
		return move_proactive(equity, relevant_data, game_info);
	}
}


//Input: equity, game info, and relevant playstyle data on opponent
//Output: Ai move; is only reraise above 60% equity, else it's a bluff
//Determines how to react to opponents raise based on whihc move has the highest expected value. The available moves are fold, call, and reraise.
function move_reactive(equity, game_info, data) {
	
	if(game_info.player_move.amount == game_info.bb_size / 2 && (game_info.pot == game_info.bb_size * 3/2)) {
		console.log("Vi caller som sb", equity); 
		if(equity > 0.44) {
			return { ai_move: "call", amount: 0}
		}
	}

	let EV_call = 0;
	let EV_fold = 0;
	let initial_bet = game_info.player_move.amount;
	let best_raise_info = {EV: -Infinity, amount: 0};

	EV_call = calc_EV_call(equity, game_info);
	EV_fold = 0;

	if(equity > 0.6) {

		best_raise_info = find_max_EV_raise(data.total_moves, data.chance_of_fold_when_raised, game_info.pot, equity);

		if(best_raise_info.amount > initial_bet && best_raise_info.EV > EV_call && best_raise_info.EV > 0) {

			return { ai_move: "raise", amount: best_raise_info.amount};
		}
	}
	return EV_call > EV_fold ? { ai_move: "call", amount: 0} : { ai_move: "fold", amount: 0 };
}

//Input: equity, opponent's playstyle data, game info
//output: A proactive move, which can be checking or raising; is only a raise onver 60% equity, otherwise its a bluff
//Compares expected value of checking and raising, and returns the move that yields the highest
function move_proactive(equity, player_data, game_info) {
	if(equity < 0.55) { //as a raise under 50% is a bluff
		return {ai_move: "check", amount: 0};
	}
	
	let pot = game_info.pot;
	let EV_check = 0;
	let best_raise_info = {};
	let ai_raise; 
	
	best_raise_info = find_max_EV_raise(player_data.total_moves, player_data.chance_of_fold_when_raised, pot, equity);
	max_EV_raise = best_raise_info.EV;
	ai_raise = best_raise_info.amount
	EV_check = calc_EV_check(equity, pot);


	return max_EV_raise > EV_check ? { ai_move: "raise", amount: ai_raise } : { ai_move: "check", amount: 0 };
}

//Assumes that if the opponent raises, they will continue to raise until the end of the hand. Calculates expected value based on the 
//potential winnings the bot may yield by calling every raise, and the potential losses by calling every raise
function calc_EV_call(equity, game_info){

	let new_pot = game_info.pot; 
	let raise_ratio = game_info.player_move.amount / (game_info.pot - game_info.player_move.amount);
	let expected_call = game_info.player_move.amount; 
	let new_raise = game_info.player_move.amount;
	let rounds_left = find_rounds_left(game_info.table_cards.length); 

	
	for(let i = 0; i < rounds_left; i++) {
		new_pot += new_raise; 				//Our call put into pot 
		new_raise = new_pot * raise_ratio; 	//Opponent's new raise 
		new_pot += new_raise; 				//Opponent's new raise put into pot 
		expected_call += new_raise; 
	}
	new_pot += new_raise;                   //Our call of opponent's last raise put into pot

	return (equity * (new_pot-(expected_call))) - ((1-equity) * expected_call);

}

//Returns expected value of checking based on equity and pot
function calc_EV_check(equity, pot) {
	return equity * pot;
}
//Input: total moves made by opponent, opponents chance to fold a raise, 
//Output: the raise amount that yields the highest expected value; an object containing EV and amount
//Checks different raise amounts and returns the raise with the highest EV
function find_max_EV_raise(total_moves, chance_of_fold_when_raised, pot, equity) {
	if (equity > 0.85) {
		return {EV: Infinity, amount: (Math.random() + 0.5) * pot}
	}

	let raise;
	let adjusted_call_chance; 
	let max_EV_raise = 0;
	let EV_raise = [];
	let ai_raise; 
	let call_chance; 

	if (total_moves > 30) {  //Threshold for considering data reliable 
		call_chance = (1 - chance_of_fold_when_raised);
	} else {
		call_chance = 0.30;
	}
	
	for (let i = 0.2; i < 10; i += 0.2) {
		bet_percent_of_pot = 0.1 * i;
		raise = bet_percent_of_pot * pot;
		adjusted_call_chance = adjust_call_chance(call_chance, bet_percent_of_pot); 
		EV_raise[i] = calc_EV_raise(adjusted_call_chance, pot, raise, equity);
		if (EV_raise[i] > max_EV_raise) {
			max_EV_raise = EV_raise[i];
			ai_raise = raise;
		}
	}
	return {EV: max_EV_raise, amount: ai_raise};
}
//Calculates EV of a raise based on the 3 scenarios that can happen: (1) they fold (2) they call and lose (3) they call and win 
//Input  : Opponent's chance to call our raise, pot size, raise size, equity
//Output : EV of a raise
function calc_EV_raise(adjusted_call_chance, pot, raise, equity) {
	let low = 0.5, high = 1.5

	return 	(1 - adjusted_call_chance) * pot
        	+ (adjusted_call_chance* high) * equity * (pot + raise)
			- ((adjusted_call_chance* low) * (1 - equity) * (raise));
}

//Adjusts opponents call chance to account for Ai's raise amount
//Output: adjusted call chance that is dependent on Ai's raise amount
//Input: opponent's general call chance and Ai's raise amount in relation to pot
function adjust_call_chance(call_chance, bet_percent_of_pot) {
	const a = 0.1;
	const b = 0.03;
	const c = 0.093;
	return ((call_chance * (a/(0.1 * bet_percent_of_pot + b)) ) - c);

}


//Output validation for if bot tries to bet more than it has in the balance; in that case, goes all in
//Input: Ai's move and game info
//Output: Limits Ai's move amount if tries to bet more than possible 
function confirm_bet_size(ai_move, game_info) {

	//In case sum of opponent's raise amount and Ai's rereraise amount is larger than the Ai's balance
	if( ai_move.ai_move == "raise"  && (game_info.player_move.amount + ai_move.amount) > game_info.ai_balance) {

		if(game_info.ai_balance <= game_info.player_move.amount) { 
			console.log("Im froced to clal even thought i wanna raise"); 
			ai_move.ai_move = "call"; 
			ai_move.amount = 0; 
			return; 

		} else {
			console.log("Im fforced to raise less then i want "); 
			console.log("aimove amount", ai_move.amount, "my balance", game_info.ai_balance, "playerraise", game_info.player_move.amount); 

			ai_move.amount =  game_info.ai_balance - game_info.player_move.amount; 
			console.log("after", "aimove amount", ai_move.amount, "my balance", game_info.ai_balance, "playerraise", game_info.player_move.amount); 
			return; 

		}
	}

	if(game_info.ai_balance < ai_move.amount) {
		ai_move.amount = game_info.ai_balance;
	}
}

//Rounds Ai's final move amount to the nearest tenth
function set_final_amount(ai_move) {
	ai_move.amount = Math.ceil(Math.ceil((ai_move.amount * 10)) / 10);
	console.log(ai_move.amount);
}

//Returns the type of move Ai needs to make depending on opponent's last move
function determine_move_type(move) {
	console.log(move, "321");
	switch(move) {
		case "check": case "call": return "proactive";
		case "raise": return "reactive";
		default: console.log("error: player move undefined", move);
	}
}

//returns amount of rounds left (not including current) based on number of cards on table
//Input: number of table cards
//output: amount of rounds left (not including current)
function find_rounds_left(table_cards){
	switch(table_cards) {
		case 0: return 3;
		case 3: return 2;
		case 4: return 1;
		case 5: return 0;
		default: console.log("error: table cards error");
	}
}
//Returns name of current round
//input: number of table cards
//output: string that contains the current round name
function find_round(num_table_cards) {
	switch (num_table_cards) {
		case 0: return "preflop";
		case 3: return "flop";
		case 4: return "turn";
		case 5: return "river";
		default: console.log("error: invalid table cards");
	}
}
module.exports.move_proactive = move_proactive; 
module.exports.move_reactive = move_reactive; 
module.exports.find_max_EV_raise = find_max_EV_raise; 
module.exports.adjust_call_chance = adjust_call_chance; 
module.exports.calc_EV_raise = calc_EV_raise; 
module.exports.ai = ai; 
module.exports.calc_EV_call = calc_EV_call;
module.exports.calc_EV_check = calc_EV_check;
