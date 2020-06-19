module.exports = class Data {
    constructor () {
        //Imperical data
        this.player_fold = 0,
        this.player_check = 0,  
        this.player_call = 0, 
        this.player_raise = 0,   
        this.hands_played_percentage = 1, 

        this.vpip = 1; 

        this.total_moves = 0,
        this.total_preflop = 1,

        this.ai_fold = 0,
        this.ai_check = 0, 
        this.ai_call = 0, 
        this.ai_raise = 0,
        this.ai_total_moves = 0, 

        // Playstyle
        this.raises = 0,
        this.chance_of_raise = 0,
        this.average_raise_percentage_of_pot = 0, 


        this.call_a_raise = 0,
        this.chance_of_call_a_raise = 0, 

        this.fold_when_raised = 0, 
        this.fold_when_sb = 0,
        this.chance_of_fold_when_raised = 0,
        
        this.range = {
            range_Low: 34, 
            range_high: 100
        }, 
        this.current_range = {
            range_Low: 34, 
            range_high: 100
        }
        this.good_hands = 0; 
        this.bad_hands = 0;
        this.good_hands_winnings = 0; 
        this.bad_hands_winnings = 0; 
        this.number_of_bluffs = 0; 
    }
}