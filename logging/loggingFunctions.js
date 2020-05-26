const fs = require('fs');

// checks commandline inputs for, if bluff is enabled
function checkCommandLine(args) {
    for(i = 0; i < args.length; i++) {
        if(args[i] === "--bluff") {
             console.log("Bluff enabled...");
            return true;
        }
    }
    return false;
}

// Logs a player move – move frequency and number of raises. Bluff parameter determines which player that is to be logged
function logMove(player_action, bluff) {
    if(player_action.move === "raise") {
        logRaiseAverage(player_action, bluff);
    }
    logFrequencyOfMove(player_action, bluff);
}

// The amount of each move is updated and the new frequency of every possible move is recalculated. Bluff determines which player is logged
function logFrequencyOfMove(player_action, bluff) {
    let line = [];
    let raise_line = [];

    if(bluff === false) {
        line = fs.readFileSync("./logFiles/moveAmount.txt");
        raise_line = fs.readFileSync('./logFiles/raiseAverage.txt');
    } else {
        line = fs.readFileSync("./logFiles/moveAmountBluff.txt");
        raise_line = fs.readFileSync('./logFiles/raiseAverageBluff.txt');
    }
    
    line = line.toString();
    raise_line = raise_line.toString();
    let raiseValue = findNumber(raise_line, raise_line.indexOf(":") + 2).number;
    let checkValue = findNumber(line, line.indexOf(":") + 1).number;
    let callValue = findNumber(line, line.indexOf(":", line.indexOf(":") + 1) + 1).number;
    let foldValue = findNumber(line, line.indexOf(":", line.indexOf(":", line.indexOf(":") + 1) + 1) + 1).number;
    let totalMoves = findNumber(line, line.lastIndexOf(":") + 1).number;
    
    switch (player_action.move) {
        case "check":
            checkValue += 1;
            break;
        case "call": 
            callValue += 1;
            break;
        case "fold":
            foldValue += 1;
            break;
        default:
            break;
    }
    totalMoves += 1;
    avgCall = calcAverage(totalMoves, callValue);
    avgCheck = calcAverage(totalMoves, checkValue);
    avgRaise = calcAverage(totalMoves, raiseValue);
    avgFold = calcAverage(totalMoves, foldValue);
    if(bluff === false) {
        fs.writeFileSync('./logFiles/moveFrequency.txt', `\n check frequency: ${avgCheck}, call frequency: ${avgCall}, raise frequency: ${avgRaise}, fold frequency: ${avgFold}`);
        fs.writeFileSync('./logFiles/moveAmount.txt', `Checks:${checkValue} / Calls:${callValue} / Folds:${foldValue} / Total moves:${totalMoves} /`);
    } else {
        fs.writeFileSync('./logFiles/moveFrequencyBluff.txt',`\n check frequency: ${avgCheck}, call frequency: ${avgCall}, raise frequency: ${avgRaise}, fold frequency: ${avgFold}`);
        fs.writeFileSync('./logFiles/moveAmountBluff.txt', `Checks:${checkValue} / Calls:${callValue} / Folds:${foldValue} / Total moves:${totalMoves} /`);
    }
}

function calcAverage(total, current) {
    return current/total;
}

//Updates log files: pokerais winnings writing BB's won, BB/g, and BB won from bluffed hands for the given player
function logWinnings(name, response, bluff, bigBlind, current_bet, hasBluffed) {
    let array = [];
	let bluff_hands = 0; 
	let bb_won_with_bluff = 0;
    
    if(bluff === false) {
        array = fs.readFileSync("./logFiles/averageBB.txt");
    } else {
        array = fs.readFileSync("./logFiles/averageBB_bluff.txt");
    }
    
    let rep = findNumber(array.toString(), 8);
    let rep2 = findNumber(array.toString(), rep.endOfNumber + 16);
    let rep3 = findNumber(array.toString(), rep2.endOfNumber + 22);
    let rep4 = findNumber(array.toString(), rep3.endOfNumber + 17);

    let bb_won = rep.number;
    let hands_played = rep2.number;
    if(bluff === true) {
        bb_won_with_bluff = rep3.number;
        bluff_hands = rep4.number;
    }
    
    let bb_ratio = ((response.storage_pot - current_bet) / bigBlind);
    if(response.winner === name) {   
        bb_won += bb_ratio;
        if(hasBluffed) {
            bb_won_with_bluff += bb_ratio;
			bluff_hands += 1;
		}
    } else if(response.winner !== "draw") {
        bb_won = bb_won - ((current_bet) / bigBlind);
        if(hasBluffed) {
            bb_won_with_bluff -= ((current_bet) / bigBlind);
			bluff_hands += 1;
		}
    } else {
        bb_won += 0;
    }
    hands_played += 1;
    let mmb = (bb_won / hands_played);
    let avg_bb_won_with_bluff = 0;
    if(bluff_hands !== 0) {
        avg_bb_won_with_bluff = (bb_won_with_bluff / bluff_hands);
    }
    if(bluff === false) {
        fs.writeFileSync('./logFiles/averageBB.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} / BB won with bluffs: 0 / bluffed hands: 0 /`);
    } else {
        fs.writeFileSync('./logFiles/averageBB_bluff.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} / BB won with bluffs: ${bb_won_with_bluff} / bluffed hands: ${bluff_hands} /`);
    }
    if(hands_played % 100 === 0) {
        fs.appendFileSync('./logFiles/standings_after_100_hands.txt', `\n${name}:\n BB/h: ${mmb}, Bluffed BB/h: ${avg_bb_won_with_bluff}, Overall BB won: ${bb_won}, Overall BB with Bluff: ${bb_won_with_bluff}, Bluffed hands: ${bluff_hands}, Hands: ${hands_played}`);
    }
}

//Returns index of a number in a log file. 
function findNumber(array, numberSpot) {
    let amount = "";
    while(array[numberSpot] !== "/") {
        amount += array[numberSpot];
        numberSpot += 1;
    }
    return {number: Number(amount), endOfNumber: numberSpot};
}
// Logs total amount of raises and the average raise amount for the given player. 
function logRaiseAverage(ai_player_move, bluff) {
    let line = [];
    let total_raise_amount = 0; let amount_of_raises = 0; let bluffs = 0; let bluff_amount = 0;
	if(bluff) {
        line = fs.readFileSync('./logFiles/raiseAverageBluff.txt');
    } else {
        line = fs.readFileSync('./logFiles/raiseAverage.txt');
    }
	// Number placement is predetermined in file, thus constants are added to find the number in the file.
	let res = findNumber(line.toString(), 18);
    let res2 = findNumber(line.toString(), res.endOfNumber + 22);
    if(bluff) {
        var res3 = findNumber(line.toString(), res2.endOfNumber + 26);
        var res4 = findNumber(line.toString(), res3.endOfNumber + 25);
    }

    amount_of_raises = res.number + 1;
    total_raise_amount = res2.number + ai_player_move.amount;
    if(ai_player_move.bluff !== "false" && ai_player_move.bluff !== undefined) {
        bluffs += res3.number + 1;
        bluff_amount = res4.number + ai_player_move.amount;
    }

    average_raise_without_bluff = total_raise_amount / amount_of_raises;
    if(bluffs !== 0) {
        average_raise_with_bluff = bluff_amount / bluffs;
    }
    if(bluff) {
        fs.writeFileSync('./logFiles/raiseAverageBluff.txt', `Amount of raises: ${amount_of_raises} / Total raise amount: ${total_raise_amount} / Amount of bluff raises: ${bluffs} / Total amount of bluff: ${bluff_amount} / `);
    } else {
        fs.writeFileSync('./logFiles/raiseAverage.txt', `Amount of raises: ${amount_of_raises} / Total raise amount: ${total_raise_amount} /`);
    }
}

module.exports.findNumber = findNumber;
module.exports.logWinnings = logWinnings;
module.exports.logMove = logMove;
module.exports.checkCommandLine = checkCommandLine;
module.exports.logRaiseAverage = logRaiseAverage;