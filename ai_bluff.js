// Modtager
object = {
    ai_hand: [],
    table_cards: [],
    pot: 3,
    ai_balance: 3,
    player_balance: 3,
    ai_current_bet: 3, 
    player_current_bet: 3,  
    blind_size: 3, 
    blind: "sb", 
    player_move: {move: "check", amount: 13},
}

//Tilbagesender
object = {
    ai_move: "raise", 
    ai_amount: 100
}


//Find stadiet

//Gem modstanders move. 
    //overvejer datastruktur. 

//Finde range
    //Ud fra spillestil, og bets i starten. 


//Kald equity



if(fold) {

    Do_pure_bluff 
    1/100
}

if(check || call) {
    do_calculated_bluff(ai_hand, table_cards, range) {

    }
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
