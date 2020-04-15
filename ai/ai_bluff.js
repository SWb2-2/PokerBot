const monte_carlo = require("./monte_carlo");
const Card = require("../classes/class_card");
const Player = require("../classes/class_player");
const Dealer = require("../classes/class_dealer");


//AI modtager dette objekt, og skal lave et træk ud fra det. 
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



//Det er forventet, at ai tilbage sender dette objekt, når der er fundet et givent træk. 
object = {
    ai_move: "raise", 
    ai_amount: 100
}


//Dette er vores main funktion i ai, hvor strukturen skal laves, så der vides hvad den skal udregne, før den kan finde sit ønskede træk. 
function ai(object) {

    find_stadie(table_cards);
    update_range();
    determine_range();
    equity_range();
    calculate_move();



    return  { ai_move: "raise", 
              ai_amount: 100
            }
}

//Find stadiet

//Gem modstanders move. 
    //overvejer datastruktur. 

//Finde range
    //Ud fra spillestil, og bets i starten. 


//Kald equity



//DETTE ER IDEER TIL BLUFF; OG HVORDAN VI MÅSKE SKAL UDRENGE DET. 
/*
if(fold) {

    Do_pure_bluff();
    1/100;
}

if(check || call) {
    do_calculated_bluff(ai_hand, table_cards, range);
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

*/