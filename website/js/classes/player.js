module.exports = class Player{
    constructor(balance, name) {
        this.name = name;
        this.balance = balance;
        this.hand = [];
        this.current_bet = 0;
        this.blind = "";
        this.player_move = {move: "", amount: 0}; 
    }
}