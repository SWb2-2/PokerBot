const monte_carlo = require("./ai_util/monte_carlo.js");
const range_func = require("./ai_util/range");

// Modtager
// const game_info = {
// 	ai_hand: [],
// 	table_cards: [],
// 	pot: 3,
// 	// ai_balance: 3,
// 	// player_balance: 3,
// 	// ai_current_bet: 3,
// 	// player_current_bet: 3,
// 	// blind_size: 3,
// 	// blind: "sb",
// 	player_move: { move: "check", amount: 13 },
// 	bluff: true
// }

//input: spilinformationsobjektet der sendes mellem server og client
//output: et objekt der indholder Ai's træk og et givet antal penge hvis der calles eller raises
//Skal bestemme Ai's træk ud fra equity og herved modspillerens range,  (spillets stadie, modspillerens spillestil og sidste træk)
function ai(game_info, data_preflop, data_postflop, data) {
	console.log("BEGGINIG OF AI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

	let ai_move;
	let current_round = "";
	let range = { range_low: 0, range_high: 100 }
	

	//Hent info der skal bruges til at bestemme træk
	current_round = find_round(game_info.table_cards.length);
	range = range_func.determine_range(data, game_info.player_move, game_info.pot, true);					//Check op på 
	console.log(range, "Rankge");
	let equity = monte_carlo.equity_range(game_info.ai_hand, 10000, game_info.table_cards, range.range_low, range.range_high);
	
	// equity.draw_and_winrate = 90;
	
	console.log(equity.draw_and_winrate, "38 equity");

	console.log(game_info.pot, game_info.bb_size);
	if(game_info.pot < game_info.bb_size*2 && game_info.table_cards.length == 0) {
		game_info.player_move.move = "raise"; 
		game_info.player_move.amount = game_info.bb_size / 2; 
	}

	//Brug informationer til at bestemme træk. Inkluderer input validering og mulighed for bluff
	ai_move = determine_move(equity.draw_and_winrate / 100, current_round, game_info, data_preflop, data_postflop, data);


	if(game_info.bluff == false) {		//No bluffing osv. 

		set_final_amount(ai_move);
		confim_bet_size(ai_move, game_info);
		return ai_move;

	} else if(game_info.bluff == true && (ai_move.ai_move == ai_move.ai_move == "fold" || ai_move.ai_move == "check") ){
		let relevant_data;
		if(current_round == "preflop") {
			relevant_data = data_preflop; 
		} else {
			relevant_data = data_postflop; 
		} 

		do_calculated_bluff(equity, game_info, relevant_data)
		




		if(ai_move.ai_move == "fold" || ai_move.ai_move == "check") {
			do_pure_bluff_0(ai_move, game_info);
		}

		set_final_amount(ai_move);
		confim_bet_size(ai_move, game_info);
		return ai_move;
	}
}



function do_calculated_bluff(equity, game_info, data) {

	if(equity >= 50) {
		return; 
	}

	let bluff = find_max_EV_raise_bluff(data.total_moves, data.chance_of_fold_when_raised, game_info.pot, equity) 






}




function find_max_EV_raise_bluff(total_moves, chance_of_fold_when_raised, pot, equity) {
	let raise;
	let adjusted_call_chance; 
	let max_EV_raise = 0;
	let EV_raise = [];
	let ai_raise; 
	let call_chance; 

	if (total_moves > 30) {  //Tjekker at vores data er reliable. 
		call_chance = (1 - chance_of_fold_when_raised);
	} else {
		call_chance = 0.30;
	}
	

	for (let i = 0; i < 30; i += 0.2) {  // 
		bet_percent_of_pot = 0.1 * i;
		raise = bet_percent_of_pot * pot;
		adjusted_call_chance = adjust_call_chance_bluff(call_chance, bet_percent_of_pot); 
		EV_raise[i] = calc_EV_raise_bluff(adjusted_call_chance, pot, raise, equity);
		// console.log(EV_raise[i], "118");
		if (EV_raise[i] > max_EV_raise) {
			max_EV_raise = EV_raise[i];
			ai_raise = raise;
			// console.log(EV_raise[i], i);
		}
	}
	return {EV: max_EV_raise, amount: ai_raise};
}

function calc_EV_raise_bluff(adjusted_call_chance, pot, raise, equity) {
	let low = 0.75, high = 1.25


	return 	(1 - adjusted_call_chance) * pot
        	+ (adjusted_call_chance* high) * equity * (pot + raise)
			- ((adjusted_call_chance* low) * (1 - equity) * raise);
}

function adjust_call_chance_bluff(call_chance, bet_percent_of_pot) {
	const a = 0.1;
	const b = 0.03;
	const c = 0.093;
	return ((call_chance*(a/(0.1* bet_percent_of_pot + b)) ) -c);
	// return call_chance * (a / (0.1*bet_percent_of_pot + b)) - c;
}





//Want to know if its a reactive or proactive move already, else it's confusing why it first gets accounted for later
function determine_move(equity, current_round, game_info, data_preflop, data_postflop, data) {
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


//Modstaneren har raiset. 
function move_reactive(equity, game_info, data) {	
	let EV_raise = 0;
	let EV_call = 0;
	let rounds_left = 0;
	let EV_fold = 0;
	let initial_bet = game_info.player_move.amount;

	let new_pot = game_info.pot; 
	let raise_ratio = game_info.player_move.amount / (game_info.pot - game_info.player_move.amount);
	let expected_call = game_info.player_move.amount; 
	let new_raise = game_info.player_move.amount; 

	rounds_left = find_rounds_left(game_info.table_cards.length); 		//Virker

	for(let i = 0; i < rounds_left; i++) {
		new_pot += new_raise; 				//Vores call af potten 
		new_raise = new_pot * raise_ratio; 	//hans nye raise. 
		new_pot += new_raise; 				//Hans raise til potten. 
		expected_call += new_raise; 
	}

	EV_call = (equity * (new_pot-(expected_call/2))) - ((1-equity) * expected_call);
	// EV_call     = (equity * call_winnings(rounds_left, game_info) )- ( (1-equity) * call_losses(rounds_left, game_info) );
	EV_fold     = 0;

	// if(equity > 75) {
	// 	let best_raise_info = find_max_EV_raise(data.total_moves, data.chance_of_fold_when_raised, game_info.pot, equity)

	// }


	return EV_call > EV_fold ? { ai_move: "call", amount: initial_bet} : { ai_move: "fold", amount: 0 };
}

//Vi har turen. Modstandern har checket, eller callet
function move_proactive(equity, player_data, game_info) {
	if(equity < 0.55) { //da et raise under 50% equity betegnes som et bluff
		return {ai_move: "check", amount: 0};
	} else if (equity > 0.92) {
		return { ai_move: "raise", amount: (Math.random() + 0.5) * game_info.pot}; //Anti bluff
	}
	
	let pot = game_info.pot;
	let EV_check = 0;
	let best_raise_info = {};
	let ai_raise; 
	
	best_raise_info = find_max_EV_raise(player_data.total_moves, player_data.chance_of_fold_when_raised, pot, equity);
	max_EV_raise = best_raise_info.EV;
	ai_raise = best_raise_info.amount
	EV_check = calc_EV_check(equity, pot);

	// console.log(EV_check, "EV CHECK"); 
	// console.log(max_EV_raise, "EV raise"); 

	return max_EV_raise > EV_check ? { ai_move: "raise", amount: ai_raise } : { ai_move: "check", amount: 0 };
}

function calc_EV_check(equity, pot) {
	return equity * pot;
}

function find_max_EV_raise(total_moves, chance_of_fold_when_raised, pot, equity) {
	let raise;
	let adjusted_call_chance; 
	let max_EV_raise = 0;
	let EV_raise = [];
	let ai_raise; 
	let call_chance; 

	if (total_moves > 30) {  //Tjekker at vores data er reliable. 
		call_chance = (1 - chance_of_fold_when_raised);
	} else {
		call_chance = 0.30;
	}
	

	for (let i = 0; i < 30; i += 0.2) {  // 
		bet_percent_of_pot = 0.1 * i;
		raise = bet_percent_of_pot * pot;
		adjusted_call_chance = adjust_call_chance(call_chance, bet_percent_of_pot); 
		EV_raise[i] = calc_EV_raise(adjusted_call_chance, pot, raise, equity);
		// console.log(EV_raise[i], "118");
		if (EV_raise[i] > max_EV_raise) {
			max_EV_raise = EV_raise[i];
			ai_raise = raise;
			// console.log(EV_raise[i], i);
		}
	}
	return {EV: max_EV_raise, amount: ai_raise};
}

function calc_EV_raise(adjusted_call_chance, pot, raise, equity) {
	// let low = 0.5, high = 1.5
	low = high = 1; 

	return 	(1 - adjusted_call_chance) * pot
        	+ (adjusted_call_chance* high) * equity * (pot + raise)
			- ((adjusted_call_chance* low) * (1 - equity) * raise);
}



function adjust_call_chance(call_chance, bet_percent_of_pot) {
	const a = 0.1;
	const b = 0.03;
	const c = 0.093;
	return ((call_chance*(a/(0.1* bet_percent_of_pot + b)) ) -c);
	// return call_chance * (a / (0.1*bet_percent_of_pot + b)) - c;
}



//Ide til simple do_pure_bluff
function do_pure_bluff_0(ai_move, game_info) {
	if(1 == Math.ceil(100 * Math.random())) {
		ai_move.move = "raise"
		ai_move.amount = (Math.random() + 0.5) * game_info.pot; 
		return true; 
	}
	return false; 
}

//Input: ai_move objekt og spilobjekt; output: ai_move objekt
//Simulere et tegningekast, hvor der bluffes hvis tegningen rammer bluff_trigger
function do_pure_bluff(ai_move, game_data) {
	let random = 0;
	let bluff_trigger = 50
	random = Math.ceil(100 * Math.random());

	if (random === bluff_trigger) {
		ai_move.move = "raise"
		ai_move.amount = 0.75 * game_data.pot;
		//Something that signifies that the bot has bluffed (data) 
	}
	else;
	//no bluff
}

function do_calculated_bluff(ai_hand, table_cards, range) {

	let result = equity_range(ai_hand, table_cards, range);


	//Find gennemsnitlig equty, af given hånd, og hvis positiv bluff, negativ fold. 
	let bluff_equity = equity_range(better_hand, table_cards, range);

	//Aflæs bord, og bedøm hvad der kan skræmme modstanderen. 
	//SImpel implementering:
	//Hvis 3 ens suit, raise en lav % af tiden. 
	//Hvis 4 connected, raise en lav % af tiden. 

	//Hvis botten har raiset tidligere, støjre chance for at bluffe. 

	//Potodds, til at bedømme outs. 



}

function confim_bet_size(ai_move, game_info) {

	if(game_info.ai_balance < ai_move.amount) {
		ai_move.amount = game_info.ai_balance;
	}
}

function set_final_amount(ai_move) {
	ai_move.amount = Math.ceil(Math.ceil((ai_move.amount * 10)) / 10);
	console.log(ai_move.amount);
}


function determine_move_type(move) {
	console.log(move, "321");
	switch(move) {
		case "check": case "call": return "proactive";
		case "raise": return "reactive";
		default: console.log("error: player move undefined", move);
	}
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
//input: antal kort på bordet     output: string som angiver runde
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
module.exports.find_max_EV_raise_bluff = find_max_EV_raise_bluff; 
module.exports.find_max_EV_raise_bluff = find_max_EV_raise_bluff; 
module.exports.ai = ai; 
