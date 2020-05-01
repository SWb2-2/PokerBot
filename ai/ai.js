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
	// console.log(game_info)

	console.log(game_info.player_move, "efuiwghuaewhgiejngiheaugnawegreauignwrigjiorghreuhgieghierhger")
	let ai_move;
	let current_round = "";
	let range = { range_low: 0, range_high: 100 }
	

	//Hent info der skal bruges til at bestemme træk
	current_round = find_round(game_info.table_cards.length);
	range         = range_func.determine_range(data, game_info.player_move, game_info.pot-game_info.player_move.amount, true);					//Check op på 
	let equity = monte_carlo.equity_range(game_info.ai_hand, 141111, game_info.table_cards, range.range_Low, range.range_high);
		console.log(equity.draw_and_winrate, "wr");
	//Skal se indbetaling af big blind (når den er small blind) som et raise fra modstanderen, så den ikke ser indbetalingen som optional
	if(game_info.pot < 2*game_info.bb_size && game_info.table_cards.length == 0) {
		game_info.player_move.move = "raise"; 
		game_info.player_move.amount = game_info.bb_size / 2; 
	}
	//Brug informationer til at bestemme træk. Inkluderer input validering og mulighed for bluff
	ai_move = determine_move(equity.draw_and_winrate / 100, current_round, game_info, data_preflop, data_postflop, data);

	// Korregere for lange decimaler
	// set_final_amount(ai_move);
	// confirm_bet_size(ai_move, game_info);
	// return ai_move;

	game_info.bluff = true; 
	if(game_info.bluff == false) {		//No bluffing osv. 

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

		if(ai_move.ai_move == "fold" || ai_move.ai_move == "check" || ai_move == "call") {
			if(do_pure_bluff_0(ai_move, game_info, relevant_data)) {
				ai_move.bluff = "pure bluff";
				console.log("Did a purebliff????????????????????????????????????????????????????????????????????")
				
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



function do_calculated_bluff(ai_move, equity, game_info, data, range) {
	let EV_check = -Infinity; 
	const EV_fold = 0; 
	let EV_call = 0; 
	let bluff; 
	let raise_amount = ((Math.random() / 2) + 0.5) * game_info.pot;		// 50% til 100% af potten 
	// let adjusted_call_chance = adjust_call_chance_bluff(data.chance_of_call_when_raised)//semi colon
	let chance = 10; 
	let pot_size = game_info.pot / game_info.bb_size; 

	if(data.total_moves < 10) {
		return; 
	}
	chance += equity * 30;
	console.log(chance, "equity"); 
	chance += (data.chance_of_fold_when_raised) * 18; 		//Mest relevant. Burde sættes sammen med equity . 
	console.log(chance, "their fold chance"); 
	chance -= ((((range.range_Low +  range.range_high) / 200) + (1-equity)) / 2) * 30; 
	console.log(chance, "Their equity + percieved equity "); 
	chance -= (data.ai_raise / data.ai_total_moves) * 12; 
	console.log(chance, "our raise and total moves influence"); 
	console.log(data.ai_raise, data.ai_total_moves);

	if(chance > Math.random()*100) {
		ai_move.ai_move = "raise"; 
		ai_move.amount = ((Math.random() / 2) + 0.5) * game_info.pot;
		return true;
	}
	return false; 


	// if(Math.random()*equity > 10) {
	// 	if(Math.random() * data.chance_of_call_when_raised > 10) {
	// 		if(Math.random() * 8) {




	// 		}
	// 	}
	// }


	/*
	our_raise_chance; 		//hvor ofte raiser vi normalt? 

	their_perceived_equity // (range)
	their_call_chance
	our_equity
	pot


	our_raise_amount 		//Fast raise 



	2-2    	selcalculated_equity = 70%  rangelow = 60, range_high 90, 

	7-2		selfcalueted equity = 60%. rangelow = 60, range_high 90, 

	A-K-A - 2- 7

	3-9			selcalculated_equity = 10%  rangelow = 30, range_high 50, 

	4-8			selcalculated_equity = 10%  rangelow = 30, range_high 50, 


	*/






	if(data.ai_raise > 10) {
		bluff = calc_EV_raise_bluff(data.chance_of_call_when_raised, game_info.pot, raise_amount, equity);
	} else {
		bluff = calc_EV_raise_bluff(0.4, game_info.pot, raise_amount, equity);
	}

	let EV_compared_to_pot = bluff / game_info.pot; 

	if(EV_compared_to_pot < 0.5) {
		return false; 
	}

	console.log(bluff, "EV RAISE");

	// let bluff = find_max_EV_raise_bluff(data.total_moves, data.chance_of_fold_when_raised, game_info.pot, equity);

	//We only calcualte the EV_check, if we are alloweed to check
	if(ai_move.ai_move == "check") {
		EV_check = calc_EV_check(equity, game_info.pot);

		if(bluff.EV < EV_check) {
			ai_move.ai_move = "check"
			return false; 
		} else {
			ai_move.ai_move = "raise"
			ai_move.amount = raise_amount;
		console.log("Raise on check", bluff);

			return true; 
		}
	} else if(ai_move.ai_move == "call") {
		EV_call = calc_EV_call(equity, game_info); 

		if(bluff.EV < EV_call) {
			ai_move.ai_move = "call"
			return false; 
		} else {
			ai_move.ai_move = "raise"
			ai_move.amount = raise_amount;

		console.log("Raise on call", bluff);

			return true; 
		}
	} else if(ai_move.ai_move == "fold") {

		if(bluff.EV <= EV_fold) {
			ai_move.ai_move = "fold"
			return false; 
		} else {
			ai_move.ai_move = "raise"
			ai_move.amount = raise_amount;

			console.log("Raise on fold", bluff);

			return true; 
		}
	}
	return console.log("error: could not read ai move"); 
}




function find_max_EV_raise_bluff(total_moves, chance_of_fold_when_raised, pot, equity) {
	let raise;
	let adjusted_call_chance; 
	let max_EV_raise = -Infinity;
	let EV_raise = [];
	let ai_raise; 
	let call_chance; 

	if (total_moves > 30) {  //Tjekker at vores data er reliable. 
		call_chance = (1 - chance_of_fold_when_raised);
	} else {
		call_chance = 0.50;
	}
	

	for (let i = 0.5; i < 1.5; i += 0.1) {  // 
		bet_percent_of_pot = 0.1 * i;
		raise = bet_percent_of_pot * pot;
		adjusted_call_chance = adjust_call_chance_bluff(call_chance, bet_percent_of_pot); 
		console.log(adjusted_call_chance, "adjusted call chac", i);
		EV_raise[i] = calc_EV_raise_bluff(adjusted_call_chance, pot, raise, equity);
		if (EV_raise[i] > max_EV_raise) {
			max_EV_raise = EV_raise[i];
			ai_raise = raise;
			console.log(EV_raise[i], i);
		}
	}
	return {EV: max_EV_raise, amount: ai_raise};
}

function calc_EV_raise_bluff(adjusted_call_chance, pot, raise, equity) {
	let low = 1.75, high = 1 / low;
 

	//console.log((1 - adjusted_call_chance) * pot
	//+ ((adjusted_call_chance* high) * equity * (pot + raise))
	//- ((adjusted_call_chance* low) * (1 - equity) * (raise)), "EV raise");

	return	(1 - adjusted_call_chance) * pot
	      	+ (adjusted_call_chance* high) * equity * (pot + raise)
 			- ((adjusted_call_chance* low) * (1 - equity) *(/*pot*0.7+*/  raise));
}
// (1 - adjusted_call_chance) * pot
//         	+ (adjusted_call_chance* high) * equity * (pot + raise)
// 			- ((adjusted_call_chance* low) * (1 - equity) *(pot*0.7 + raise));

function adjust_call_chance_bluff(call_chance, bet_percent_of_pot) {
	const a = 0.1;
	const b = 0.5;
	const c = 0.2;
	return ((call_chance*(a/(bet_percent_of_pot + b)) ) +c);
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
	return EV_call > EV_fold ? { ai_move: "call", amount: initial_bet} : { ai_move: "fold", amount: 0 };
}

//Vi har turen. Modstandern har checket, eller callet
function move_proactive(equity, player_data, game_info) {
	if(equity < 0.55) { //da et raise under 50% equity betegnes som et bluff
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

	// console.log(EV_check, "EV CHECK"); 
	// console.log(max_EV_raise, "EV raise"); 

	return max_EV_raise > EV_check ? { ai_move: "raise", amount: ai_raise } : { ai_move: "check", amount: 0 };
}

function calc_EV_call(equity, game_info){

	let new_pot = game_info.pot; 
	let raise_ratio = game_info.player_move.amount / (game_info.pot - game_info.player_move.amount);
	let expected_call = game_info.player_move.amount; 
	let new_raise = game_info.player_move.amount;
	let rounds_left = find_rounds_left(game_info.table_cards.length); 

	
	for(let i = 0; i < rounds_left; i++) {
		new_pot += new_raise; 				//Vores call af potten 
		new_raise = new_pot * raise_ratio; 	//hans nye raise. 
		new_pot += new_raise; 				//Hans raise til potten. 
		expected_call += new_raise; 
	}
	new_pot += new_raise;                   //vores call af hans sidste raise til potten

	return (equity * (new_pot-(expected_call))) - ((1-equity) * expected_call);

}

function calc_EV_check(equity, pot) {
	return equity * pot;
}

//Output: det raise der yder mest expected value; et objekt der indholder EV og raise amount
//Tjekker forskellige bet sizes, og vælger den bet size der yder højst EV
function find_max_EV_raise(total_moves, chance_of_fold_when_raised, pot, equity) {
	if (equity > 0.85) {
		return {EV: Infinity, amount: (Math.random() + 0.5) * pot}
		return { ai_move: "raise", amount: (Math.random() + 0.5) * game_info.pot}; //Anti bluff
	}


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
	
	for (let i = 0.2; i < 10; i += 0.2) {  // 
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
//Output: EV af et raise med et givet bet size, og givet modstander chance for at call
//Udregner EV ud fra de 3 scenarier der kan ske ved et raise: de folder, de caller og vi vinder, de caller og de vinder
function calc_EV_raise(adjusted_call_chance, pot, raise, equity) {
	let low = 0.5, high = 1.5
	// low = high = 1; 

	return 	(1 - adjusted_call_chance) * pot
        	+ (adjusted_call_chance* high) * equity * (pot + raise)
			- ((adjusted_call_chance* low) * (1 - equity) * (raise));
}


//Output: justeret call chance af modstanderen, der tager højde for bottens bet size
function adjust_call_chance(call_chance, bet_percent_of_pot) {
	const a = 0.1;
	const b = 0.03;
	const c = 0.093;
	return ((call_chance*(a/(0.1* bet_percent_of_pot + b)) ) -c);
	// return call_chance * (a / (0.1*bet_percent_of_pot + b)) - c;
}



//Ide til simple do_pure_bluff
function do_pure_bluff_0(ai_move, game_info, data) {

	let chance = 2; 

	if(ai_move.ai_move == "check") {
		if(data.total_moves > 20) {
			chance = data.chance_of_fold_when_raised * 90;				//Might change this number 
		} else {
			chance = 6;
		} 
	} else if(ai_move.ai_move == "call") {
		chance = 4; 
	} else if(ai_move.ai_move == "fold") {
		chance = 2; 		
	}

	if(chance >= Math.ceil(100 * Math.random())) {
		ai_move.ai_move = "raise"
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

//Hvis botten better mere end sin balanace, så går den all in
function confirm_bet_size(ai_move, game_info) {

	//Hvis modstanderen raiser, og det modstanderen raiser med, + det botten raiser med, er 
	if( ai_move.ai_move == "raise" && game_info.player_move.move == "raise"  &&  (game_info.amount + ai_move.amount) > game_info.ai_balance) {

		//Hvis vi ikke har nok til overhovedet så calles der
		if(game_info.ai_balance < game_info.player_move.amount) {
			ai_move.ai_move = "call"; 
			ai_move.amount = 0; 
			return; 
			
		} else {

			ai_move.amount =  game_info.ai_balance - game_info.player_move.amount; 
			return; 

		}
	}

	if(game_info.ai_balance < ai_move.amount) {
		ai_move.amount = game_info.ai_balance;
	}
}

//Afrunder bet til 1 decimal
function set_final_amount(ai_move) {
	ai_move.amount = Math.ceil(Math.ceil((ai_move.amount * 10)) / 10);
	console.log(ai_move.amount);
}

//Output: hvilket type træk botten skal tage, baseret på modstanderens træk
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

module.exports.do_calculated_bluff = do_calculated_bluff; 
module.exports.calc_EV_call = calc_EV_call;
module.exports.calc_EV_check = calc_EV_check;
module.exports.calc_EV_raise_bluff = calc_EV_raise_bluff;