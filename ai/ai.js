// Modtager
const game_info = {
	ai_hand: [],
	table_cards: [],
	pot: 3,
	ai_balance: 3,
	player_balance: 3,
	ai_current_bet: 3,
	player_current_bet: 3,
	blind_size: 3,
	blind: "sb",
	player_move: { move: "check", amount: 13 },
	bluff: true
}

//input: spilinformationsobjektet der sendes mellem server og client
//output: et objekt der indholder Ai's træk og et givet antal penge hvis der calles eller raises
//Skal bestemme Ai's træk ud fra equity og herved modspillerens range,  (spillets stadie, modspillerens spillestil og sidste træk)
function ai(game_info, player_data) {
	let ai_move;
	let current_round = "";
	let available_moves = [];
	let range = { range_low: 0, range_high: 100 }
	let equity = 0;
	let move_history = [];
	// let player_data = {spilestil: "", fold_odds: 0, preflop_data: [] /*, andet*/};

	//Hent info der skal bruges til at bestemme træk
	current_round = find_round(game_data.table_cards.length);
	available_moves = find_available_moves(game_data.player_move.move);
	// player_data     = get_player_data();
	range = determine_range(player_data, game_data);
	equity = equity_range(range);

	//Brug informationer til at bestemme træk. Inkluderer input validering og mulighed for bluff
	ai_move = determine_move(available_moves, equity, current_round, move_history, player_data, game_info);
	//add_move_to_history(ai_move, move_history);

	return ai_move;
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
//Want to know if its a reactive or proactive move already, else it's confusing why it first gets accounted for later
function determine_move(available_moves, equity, current_round, move_history, player_data, game_data) {
	let EV_check = 0;
	let EV_raise = 0;
	let EV_call = 0;
	const EV_fold = 0;

	if (reactive == true) {
		move_reactive(equity, player_data, game_info);
	} else {
		move_proactive(equity, player_data, game_info);
	}
	//Modstander har: 
	//Checket
	//Raised + amount
	//call  Dette er begyndelse af ny runde. 



}

//Modstaneren har eller raiset. 
function move_reactive(equity, player_data, game_info) {
	let round_left = 0;

	if(game_info.table_cards.length == 4) {
		round_left = 1;
	} else if(game_info.table_cards.length == 3) {
		round_left = 2; 
	} else if(game_info.table_cards.length == 0) {
		round_left = 3; 
	}

	let EV_raise = 0;
	let EV_call = (equity/100) * game_info.pot  * Math.pow(2, round_left) - (1-(equity/100)) * game_info.player_move.amount * Math.pow(3, round_left);  //Lidt usikker i frohold til om ha nraiser senere
	const EV_fold = 0;









	return EV_call > EV_fold ? { ai_move: "call", amount: 0 } : { ai_move: "fold", amount: 0 };
}








//Vi har turen. Modstandern har checket, eller callet
function move_proactive(equity, player_data, game_info) {
	// if (equity < 50) {
	// 	return "check";
	// }

	let pot = game_info.pot;
	let EV_check = (equity / 100) * game_info.pot;
	let EV_raise = [];
	let raise;				//Givet ved % af potten 
	let our_raise;
	let temp_call_chance; 
	let call_chance;
	let result = 0;
	if (player_data.total_moves > 30) {  //Tjekker at vores data er reliable. 
		call_chance = (1 - player_data.chance_of_fold_when_raised);
	} else {
		call_chance = 0.30;
	}


	for (let i = 0; i < 30; i++) {  // Can go from 0 too 300, and change it to . 

		raise = i * 0.1 * pot;

		temp_call_chance = call_chance * (0.1 / ((i * 0.1) + 0.03)) - 0.093;

		EV_raise[i] = (1 - temp_call_chance) * pot
			+ temp_call_chance * (equity / 100) * (pot + raise)
			- temp_call_chance * (1 - (equity / 100)) * raise;

		if (EV_raise[i] > result) {
			result = EV_raise[i];
			our_raise = raise;
		console.log(EV_raise[i], i);
			
		}
	}


	return result > EV_check ? { ai_move: "raise", amount: our_raise } : { ai_move: "check", amount: 0 };
}




function calculate_bet_size(equity, pot, player_data) {
	return 0.75 * pot;



	/*	By calculating opponent EV, can we gain insight?
			Could be used to calculate AI's bet
				If we want opponent to fold: goal is high -EV
				If we want opponent to call: goal is low +EV – can be useful if opponent has low chance to call a raise, when we have a strong hand
			Question: if a move is a +EV move for one player, is it a -EV move for the other?
				No
	
		If player has high fold chance to a raise
			A for loop that increments the bet (with respect to pot size) until we find a value that has 0 EV for opponent?
	
		Choosing one EV play from another could depend on EV_ai - EV_player: the difference in EV for the respective players
			Because the difference in EV reflects the amount of money lost/gained in relation to other player, as the amount of money is conserved and finite in the game
			not the same as profit: the real yield is the pot, profit is half the pot (if showdown)
	
		Whether looking at the at-hand situation, or a whole hand (comparison of pre hand, post hand), the relative
		EV of the moves stay the same. Folding is a 0 EV move, relative to other moves.
	
		The pot is never included in the potential loss amount
			It is always included in potential winnings
	*/
}

//input: equity, current round, ai move history (for current hand), player_data, game_data
//output: ai move and potential amount of money
//Uses input parameters to decide a move. If Ai has high equity, it should raise, otherwise it should consider the game situation more closely
function calculate_move(equity, current_round, move_history, player_data, game_data) {
	let ai_move = { move: "", amount: 0 }
	let expected_value = 0;


	if (equity >= 55) {
		ai_move.move = "raise";
		ai_move.amount = 0.75 * game_data.pot;
	}
	else if (equity < 55) {
		player_move = game_data.player_move.move;
		expected_value = find_expected_value(equity, pot, bet, player_move);
		if (player_move === "check") {
			ai_move = { move: "check", amount: 0 };
		}
		else if (player_move === "raise") {
			if (expected_value >= 0) {
				ai_move = { move: "call", amount: game_data.player_move.amount }
			}
			else {
				ai_move = { move: "fold", amount: 0 };
			}
		}
		else if (player_move === "call") {
			ai_move = { move: "check", amount: 0 };
		}
		else {
			console.log("error: player move undefined");
		}
	}
	else {
		console.log("error: error calculating equity");
	}

	//Håndtering af bluff
	if (game_data.bluff === true) {
		if (ai_move.move === "fold") {
			do_pure_bluff(ai_move, game_data);
		}
		/*
			else if(ai_move.move === "check" || ai_move.move === "call") {
				do_calculated_bluff(ai_hand, table_cards, range);
			}
		*/
	}

	return ai_move
}
function find_expected_value(equity, pot, bet, player_move) {
	if (player_move === "raise") {
		return equity * pot - ((1 - equity) * bet);
	}
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

//input: spillerens sidste move i et spil; Output: array af Ai's mulige træk
function find_available_moves(player_move) {
	switch (player_move) {
		case "check": case "call": return ["check", "fold", "raise"];
		case "raise": return ["fold", "call", "raise"];
		default: return ["check", "fold", "raise"]; //default håndtere hvis det er botten der starter og spilleren ikke har lavet et move
	}
}
function add_move_to_history(move, history) {
	let i = 0;
	while (history[i] === undefined) {
		i++
	}
	history[i] = move;
}


//Notes

/* Brug expected value til at udregne om det værd at lave et træk */
/* Kan bruges til bluffing, hvis man har en ide om modstanderens fold chance */
/*
	Scenarios: Model for player move
		Assumptions:
			Threshold between bluff strategy and mathematical strategy
				Equity – over 50 : math – don't know, might be silly to say math only applies over 50% equity, cause then the only math IS equity
						 under 50: bluff
				Use of player data – reading of playstyle and adaption to that (or is that more fore detecting bluffs)
				If ai does an aggressive move, when it "theoretically" should have been passive (fold/check)
				
			Competence of opponent
				Under what condition would they fold, if the bot made a move with a hand that is bad?


		


		We have > 50% equity
			We start
				raise pot
			If opponent raises
				reraise?
				Do we ever want to check a raise? Set an interval for equity with which we want to reraise, and interval where we check because of uncertainties?

		We have < 50% equity:

			Beginning of game (bot starts)
				bluff {
					Check with possibilty to bluff?
					Could depend on opponent data (chance to call a raise)
				}

			If opponent raises:
				Reactive:
					Calculate EV: if EV positive, we call, despite the lower equity
					If EV negative: fold
				Proactive:
					bluff {
						Reraise, if we think they're bluffing?
						Depends on their chance to bluff or chance to fold a raise
					}	

			If opponent checks:
				bluff {
					Gives us opportunity to be proactive:
						Could bluff, depends on opponent chance to call us
						Depends on equity, if they have 90+ equity, the hands may be obvious and the bluff wont work
				}
				Otherwise react with check

			If opponent calls:
				bluff {
					Opportunity to be proactive and bluff
						Could seem more believable, as we had raised the round before
						Depends on player_data chance to call
				}
				Otherwise check, and see what opponent does, and see how equity changes in following betting rounds


		How can player data be used:
				Chance to call a raise / Chance to fold a raise:
					bluff{	
						Hvis lav chance for at call:
							AI kan bluffe mere
							AI kan prøve mindre betstørrelser
					}

				Hvis høj chance for at call:
					bluff {
					AI skal bluffe mindre
					}
					logic {
						Bette højt med gode kort
					}

			Chance to raise
				Hvis høj chance to raise
					logic {
						Slowplay er en mulighed (men det er ikke et fokuspunkt)
					}

			Average raise of pot
				reading bluff {
					If opponent bets below average
						Indicative of weaker hand (assuming they are not exploiting the Ai's strategy or slow playing)
					If opponent bets over
						Indicative of stronger hand
				}

			Hands played percentage
				Hvis høj
					bluff {
						Low range er lav
						Ai bluffing øges
					}
				Hvis lav
					bluff {
						player has good cards
					}
				Accounted for by range and equity
		
		Other data:
			Current round
				bluff {
					If preflop, and we start, we should raise/bluff more often (as cepheus)
				}

			AI move history
				bluff {
					If AI has raised the last rounds, higher chance to raise/bluff in current round
				}
				slowplay {
					If AI has called/checked:
						AI will look passive
						A raise in current round can be interpreted as a bluff or AI suddenly gets a good hand from opponent point of view
							Is it realistic that the AI just suddenly gets a good hand without it knowing before hand?
				}

			Blind
				Relevant if current round is preflop:
					If small blind
						higher chance to fold
					If big blind
						lower chance to fold
				


			Table cards
				logic {
					Consider AI's hand in relation to table cards. If majority of the strength of the hand lays on the table, then the hand is bad
					If majority of hand strength lies in AI's personal cards, hand is strong
					Is this taken into account by equity?
						yes:
						no :
				}

		How can code be categorized into the respective scenarios
			Based on current round
				Preflop
				Flop
				Turn
				River
				How do flop, turn, river differ? 
					flop : depends on equity (chance to complete/improve hand), table cards, bluffing as a possibility 
					turn : same as flop?
					river: all information is on the table, equity may heavily favor one side. Bluffing may or may not work, based on table cards, ai history
			Based on equity
				Higher equity – simple strategy of raising
				Lower equity  – use expected value
					expected value based on equity
					equity based on range
					range based on player data
					
					what if it is our turn to start the betting round?
				Can be segmentized (put into intervals)
			
			Blind (only relevant for preflop, hence can be encapsulated by preflop strategy part)
				Small blind
				Big blind

			Player move (would likely be the same calculations that are made in each function, so it doesn't make sense to do)
				Call
				Check
				Raise
				Could make sense to look at play_data, and see if that is how we expect them to play

			Expected value – based on equity
				Intervals
				High and low expected value plays are easy to determine – either raise/call or fold
				Neutral expected plays is grey zone
				

		Hard to categorize
			Move history (too many scenarios to consider, is more nieche?)
			Table cards (too many scenarios; doesn't make sense)
			Player_data (more nieche usage, is not necesarily considered for every single move)

		What is considered/has constant relevance in each move
			Equity and expected value
			Current round
	

			

		General
			Is it possible to calculate proactive, profitable plays, using expected value, in situations where we have less equity?
				Is it worth it? The bet sizes would generally be small then, which would be weak, and result in other player calling, so maybe not

			If we have equity and expected value, do we need odds such as outs and pot odds?


			What does the calculated equity value signify and what information does it encapsulate/is representative of?
				- Chance that opponent will obtain the better hand based on current table cards, potential table cards, and range of cards opponent has
				- Encapsulates opponent range, which in turn encapsulates their playstyle
				- Gives information about hand strength
				- Tells whether a hand is strong in the long run, on avergae

			What does equity not account for
				- Bluffs
				- Ai's potential effect on opponent
					- move history
				- Changes in playstyle (though, we have to assume that the opponent has a certain playstyle at the moment, in the given round)
				-  

		Functions
			find_best_hand_on_table (søge om ai's bedste hånd er hånden fra bordet, som modspillerens så også har tilgang til)
				Indgår dette i equity udregning (monte carlo)? På en måde, her sammenligner vi jo allerede ai's kort og modspillerens kort

			find_move_preflop
				Predefined preflop strategy based on our predefined equity values
			find_move_flop
				Based on equity and expected value
					Probability that certain (strongest) hands are obtained by either player

			

*/

/*
	Information til bluff:
		Scenario: we allow ai to play hands that do not win in the long run on average. How can we justify this? 
			- If a move is such that we make a hand look better than it is, with the intention/hope that the opponent folds, then it's a bluff
			- However, if we make the move, and theoratically make it such that the opponent does not have reason to fold, then is it a bluff?
				But is such a move theoratically justified then? Is it just a bad move?
					No, consider situations where the opponent makes a weak bet and the pot is big. We may have low equity far below 50%, however,
					in terms of expected value, the move can be justified
					Also, by us calling, we do not expect the opponent to fold (assumption – weak bet ≠ bluff)
			- with this defintion/assumption, we can be more flexible with equity and the bluffing threshold in relation to equity
			- Is this considered a semi-bluff? 
				Semi bluff is that we dont have the best hand yet, but we might obtain it. So maybe? 
				We are calling the weak bet, because there is a chance that we might still win it, so, it could be considered a semi bluff
		
		Relation between bluffing and equity
			- A draw flush has 20-25% outs odds (in terms of completing the flush only, no pairs or other stuff)
			- It has a around 50% equity (as the highest card strength and other outs are included)
			- Is a draw flush a semi bluff then?
				Yes: we currently have nothing, but have good potential to get somethign
				no : high equity is not a bluff, as we have a good hand
				yes: we have a good hand, and we make it out to be better by raising
				no : we don't necesarily hope that the opponent folds?
			


		Chance_to_fold_when_raised
		Ai move history
			Aggression
		

*/

/*
function determine_EV(bet, pot, equity, player_data) {
	switch(player_data.player_move.move) {
		case "raise": return reactive_move_EV(bet, pot, equity, player_data);
		case "check": case "call": return proactive_move_EV(bet, pot, equity, player_data);
		default: console.log("error: player move not received"); //error handling
	}
}
*/
/*
function reactive_move_EV(bet, pot, equity, player_data) {
	let EV_react_moves = {};
	let opponent_equity = 1 - equity;

	EV_react_moves.check = equity * pot - opponent_equity * bet;
	return EV_react_moves;
}
*/
/*
function proactive_move_EV(bet, pot, equity, player_data) {
	EV_move = {check: 0, raise: 0, fold: 0};
	let opponent_equity = 1 - equity;
	EV_move.check = equity * pot;
	EV_move.raise = player_data.fold_odds * pot + chance_of_call_a_raise * equity* (pot + bet)
					 - chance_of_call_a_raise * opponent_equity * bet; //hvor pot ikke inkluderere eget bet
	return EV_move;
}
*/


module.exports.move_proactive = move_proactive; 
module.exports.move_reactive = move_reactive; 