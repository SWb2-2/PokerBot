const fs = require('fs');

// Tjekker om bluff er på kommandolinjen. Hvis ja, returnerer den true, og ellers false.
function checkCommandLine(args) {
    for(i = 0; i < args.length; i++) {
        if(args[i] === "--bluff") {
             console.log("Bluff enabled...");
            return true;
        }
    }
    return false;
}

// Logger en spillers træk ud fra den givne situation. Det er ligegyldigt, om det er AI eller Player, den er lavet til begge.
function logMove(playerName, player_action, table, bluff) {
    if(player_action.move === "raise") {
        logRaiseAverage(player_action, bluff);
    }
    logFrequencyOfMove(player_action, bluff);
    if(bluff === false) {
        fs.appendFileSync("./logFiles/history_without_bluff.txt", `\n${playerName} Move: ${player_action.move}, Amount: ${player_action.amount}, Round: ${table.length}`);
    } else {
        fs.appendFileSync("./logFiles/history_with_bluff.txt", `\n${playerName} Move: ${player_action.move}, Amount: ${player_action.amount}, Round: ${table.length}, Bluff: ${player_action.bluff}`);
    }
}
// The amount of each move is updated and the new frequency of every possible move is recalculated.
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
        fs.appendFileSync('./logFiles/moveFrequency.txt', `\n check frequency: ${avgCheck}, call frequency: ${avgCall}, raise frequency: ${avgRaise}, fold frequency: ${avgFold}`);
        fs.writeFileSync('./logFiles/moveAmount.txt', `Checks:${checkValue} / Calls:${callValue} / Folds:${foldValue} / Total moves:${totalMoves} /`);
    } else {
        fs.appendFileSync('./logFiles/moveFrequencyBluff.txt',`\n check frequency: ${avgCheck}, call frequency: ${avgCall}, raise frequency: ${avgRaise}, fold frequency: ${avgFold}`);
        fs.writeFileSync('./logFiles/moveAmountBluff.txt', `Checks:${checkValue} / Calls:${callValue} / Folds:${foldValue} / Total moves:${totalMoves} /`);
    }
}

function calcAverage(total, current) {
    return current/total;
}

// Logwinnings har to filer til de to botter, hvori den bevarer hands played samt bigblinds won. 
// Efter hvert spil overskriver den det gamle med det nye resultat, og appender den nyligt beregnet bb værdi 
// i history filerne. Lige nu bliver det kaldt mmb/h men det er faktisk i bb/h. Vi skal lige blive enige 
function logWinnings(name, response, bluff, bigBlind, current_bet, hasBluffed) {
    let array = [];
    let bluff_hands = 0; let hands_without = 0; let bb_won_with_bluff = 0; let bb_won_without = 0;
    
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
        hands_without = hands_played - bluff_hands;
        bb_won_without = bb_won - bb_won_with_bluff;
    }
    
    let bb_ratio = ((response.storage_pot - current_bet) / bigBlind);
    if(response.winner === name) {   
        bb_won += bb_ratio;
        if(hasBluffed) {
            bb_won_with_bluff += bb_ratio;
            bluff_hands += 1;
        } else {
            hands_without += 1;
            bb_won_without += bb_ratio;
        }
    } else if(response.winner !== "draw") {
        bb_won = bb_won - ((current_bet) / bigBlind);
        if(hasBluffed) {
            bb_won_with_bluff -= ((current_bet) / bigBlind);
            bluff_hands += 1;
        } else {
            hands_without += 1;
            bb_won_without -= ((current_bet) / bigBlind);
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
    let avg_bb_won_without = (bb_won_without / hands_without);

    if(bluff === false) {
        fs.appendFileSync('./logFiles/history_without_bluff.txt', ` \n\nWinner: ${response.winner}\nBB/H: ${mmb}`);
        fs.writeFileSync('./logFiles/averageBB.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} / BB won with bluffs: 0 / bluffed hands: 0 /`);
    } else {
        fs.appendFileSync('./logFiles/history_with_bluff.txt', `\n\nWinner: ${response.winner} \nBB/h: ${mmb}, Bluff BB/h: ${avg_bb_won_with_bluff}, BB/h without bluff: ${avg_bb_won_without}`);
        fs.writeFileSync('./logFiles/averageBB_bluff.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} / BB won with bluffs: ${bb_won_with_bluff} / bluffed hands: ${bluff_hands} /`);
    }
    if(hands_played % 100 === 0) {
        fs.appendFileSync('./logFiles/standings_after_100_hands.txt', `\n${name}:\n BB/h: ${mmb}, Bluffed BB/h: ${avg_bb_won_with_bluff}, Overall BB won: ${bb_won}, Overall BB with Bluff: ${bb_won_with_bluff}, Bluffed hands: ${bluff_hands}, Hands: ${hands_played}`);
    }
}

// I de to filer, der hver især har hands_played og bigblind won, finder denne funktion tallene i filerne og returnerer dem på talform.
function findNumber(array, numberSpot) {
    let amount = "";
    while(array[numberSpot] !== "/") {
        amount += array[numberSpot];
        numberSpot += 1;
    }
    return {number: Number(amount), endOfNumber: numberSpot};
}

function logRaiseAverage(ai_player_move, bluff) {
    let line = [];
    let total_raise_amount = 0; let amount_of_raises = 0; let bluffs = 0; let bluff_amount = 0;
    if(bluff) {
        line = fs.readFileSync('./logFiles/raiseAverageBluff.txt');
    } else {
        line = fs.readFileSync('./logFiles/raiseAverage.txt');
    }
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
    let average_raise_with_bluff = 0;
    if(bluffs !== 0) {
        average_raise_with_bluff = bluff_amount / bluffs;
    }
    if(bluff) {
        fs.writeFileSync('./logFiles/raiseAverageBluff.txt', `Amount of raises: ${amount_of_raises} / Total raise amount: ${total_raise_amount} / Amount of bluff raises: ${bluffs} / Total amount of bluff: ${bluff_amount} / `);
        fs.appendFileSync('./logFiles/history_with_bluff.txt', `\n\nAverage raise amount: ${average_raise_without_bluff}, Average bluff amount: ${average_raise_with_bluff}`);
    } else {
        fs.writeFileSync('./logFiles/raiseAverage.txt', `Amount of raises: ${amount_of_raises} / Total raise amount: ${total_raise_amount} /`);
        fs.appendFileSync('./logFiles/history_without_bluff.txt', `\n\nAverage raise amount: ${average_raise_without_bluff}`);
    }
}


module.exports.findNumber = findNumber;
module.exports.logWinnings = logWinnings;
module.exports.logMove = logMove;
module.exports.checkCommandLine = checkCommandLine;
module.exports.logRaiseAverage = logRaiseAverage;