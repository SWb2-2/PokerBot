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

// Logger end spillers træk ud i den givne situation. Det er ligegyldigt, om det er AI eller Player, den er lavet til begge.
function logMove(playerName, player_action, table, bluff) {
    if(bluff === false) {
        fs.appendFileSync("./logFiles/history_without_bluff.txt", `\n${playerName} Move: ${player_action.move}, Amount: ${player_action.amount}, Round: ${table.length}`);
    } else {
        fs.appendFileSync("./logFiles/history_with_bluff.txt", `\n${playerName} Move: ${player_action.move}, Amount: ${player_action.amout}, Round: ${table.length}, Bluff: ${player_action.bluff}`);
    }
}

// Logwinnings har to filer til de to botter, hvori den bevarer hands played samt bigblinds won. 
// Efter hvert spil overskriver den det gamle med det nye resultat, og appender den nyligt beregnet bb værdi 
// i history filerne. Lige nu bliver det kaldt mmb/h men det er faktisk i bb/h. Vi skal lige blive enige 
function logWinnings(response, bluff, bigBlind, current_bet) {
    let array = [];
    if(bluff === false) {
        array = fs.readFileSync("./logFiles/averageMBB.txt");
    } else {
        array = fs.readFileSync("./logFiles/averageMBB_bluff.txt");
    }
    
    
    let rep = findNumber(array.toString(), 8);
    let rep2 = findNumber(array.toString(), rep.endOfNumber + 16);
    
    let bb_won = rep.number;
    let hands_played = rep2.number;
    if(response.winner === "robot") {   
        bb_won = bb_won + ((response.pot - current_bet) / bigBlind);

    } else if(response.winner !== "draw") {
        bb_won = bb_won - ((current_bet) / bigBlind);

    } else {
        bb_won += 0;
    }
    hands_played += 1;
    let mmb = (bb_won / hands_played);
    
    if(bluff === false) {
        fs.appendFileSync('./logFiles/history_without_bluff.txt', `\nMMB: ${mmb}`);
        fs.writeFileSync('./logFiles/averageMBB.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} /`);
    } else {
        fs.appendFileSync('./logFiles/history_with_bluff.txt', `\nMMB: ${mmb}`);
        fs.writeFileSync('./logFiles/averageMBB_bluff.txt', `BB won: ${bb_won} / Hands Played: ${hands_played} /`);
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

module.exports.findNumber = findNumber;
module.exports.logWinnings = logWinnings;
module.exports.logMove = logMove;
module.exports.checkCommandLine = checkCommandLine;