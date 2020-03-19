module.exports = function determine_winner(player1, player2){

        const high_card = 0,
        pair = 1,
        two_pairs = 2,
        three_of_kind = 3,
        straight = 4,
        flush = 5,
        full_house = 6,
        four_of_kind = 7,
        straight_flush = 8;

    //Sortere et array ud fra insertionsort ^^
    function sort_hand(hand_info) {
        for(let i = 1; i < hand_info.hand.length; i++) {

            let key = hand_info.hand[i];
            let j = i - 1;
            while(j >= 0 && hand_info.hand[j].rank < key.rank) {

                hand_info.hand[j + 1] = hand_info.hand[j];
                j--;
            }
            hand_info.hand[j + 1] = key;
        }
    }

    //Count amount of cards
    function find_count_rank(hand_info) {
        for(let i = 14; i >= 2; i--) {
            hand_info.count_rank[i] = 0; 

            for(let j = 0; j < hand_info.hand.length; j++) {

                if(hand_info.hand[j].rank == i) {
                    hand_info.count_rank[i] += 1;
                }
            }
        }
    }
    //Count suits
    function count_suits(hand_info) {

        for(let i = 3; i >= 0; i--) { //Løber igennem de forskellige suits. 
            hand_info.count_suit[i] = 0; 

            for(let j = 0; j < hand_info.hand.length; j++) { //Løber igennem de 7 kort. 

                if(hand_info.hand[j].suit == i) {
                    hand_info.count_suit[i] += 1; 
                }  
            }
        }
        return;
    }

    //Highcard
    function test_high_card(hand_info) {
        let array = [];
        for(let i = 0; i < 5; i++) {

            array.push(hand_info.hand[i].rank); 
        }
        hand_info.strong[high_card] = array;
    }

    //test flush
    function test_flush(hand_info) {
        let array = [];

        for(let i = 0; i < 4; i++) {
            if(hand_info.count_suit[i] >= 5) {  //VI har fundet en suit der er flush, nemlig "i"

                for(let j = 0; j < 7; j++) {
                    if(hand_info.hand[j].suit == i) {
                        array.push(hand_info.hand[j].rank);
                    }
                }
                hand_info.strong[flush] = array; // Problem, mangler at sortere array;
            }
        }
    } 

    //test for straightst
    function find_straight(hand_info) {
        let array = [];

        if(hand_info.hand[0] == 14) {
            hand_info.hand.push(1);   
        }

        for(let i = 0; i < hand_info.hand.length - 1; i++) {
            if(hand_info.hand[i].rank == hand_info.hand[i+1].rank + 1) {

                array.push(hand_info.hand[i].rank);

                if(array.length == 4) {
                    array.push(hand_info.hand[i+1].rank);
                    hand_info.strong[straight] = array;
                    if(hand_info.hand.length > 7) {
                        hand_info.hand.pop();
                    }
                    return; 
                }
            } else if(hand_info.hand[i].rank == hand_info.hand[i+1].rank) {
            } else {
                array = [];
            }
        }
        return;
    }

    function test_for_straight_flush(hand_info) {
        if(hand_info.strong[flush] == undefined && hand_info.strong[straight] == undefined) {
            return;
        }

        let array = [];

        if(hand_info.hand[0] == 14) {
            hand_info.hand.push(1);   
        }

        for(let i = 0; i < hand_info.hand.length - 1; i++) {
            if(hand_info.hand[i].rank == hand_info.hand[i+1].rank + 1  &&
            hand_info.hand[i].suit == hand_info.hand[i+1].suit) {

                array.push(hand_info.hand[i].rank);

                if(array.length == 4) {
                    array.push(hand_info.hand[i+1].rank);
                    hand_info.strong[straight_flush] = array;
                    if(hand_info.hand.length > 7) {
                        hand_info.hand.pop();
                    }
                    return; 
                }
            } else if(hand_info.hand[i].rank == hand_info.hand[i+1].rank) {
            } else {
                array = [];
            }
        }
        return;
    }

    function test_for_similar(amount, hand_info) {
        let streak = 1; 

        for(let i = 0; i < 6; i++) {

            if(hand_info.hand[i].rank == hand_info.hand[i+1].rank) {
                streak++;
                if(streak == amount) {
                    return hand_info.hand[i].rank;
                }
            } else {
                streak = 1;
            }
        }
        return false;
    }

    // 4 3 og 2 ens. 
    function find_2_3_4_of_a_kind(amount, hand_info, index) {
        let array = [];
        let k = test_for_similar(amount, hand_info);

        if(k){
            for(let i = 0; i < amount; i++) {
                array.push(k);
            }
            for(let i = 0; i < hand_info.hand.length; i++) {
                if(hand_info.hand[i].rank != k) {
                    array.push(hand_info.hand[i].rank);
                    if(array.length == 5) {
                        hand_info.strong[index] = array;
                        break;
                    }
                }
            }
        }
    }

    function test_pair(hand_info) {
        find_2_3_4_of_a_kind(2, hand_info, pair);
    }

    function test_for_three(hand_info) {
        find_2_3_4_of_a_kind(3, hand_info, three_of_kind);
    }
    function test_for_four(hand_info) {
        find_2_3_4_of_a_kind(4, hand_info, four_of_kind);
    }


    //TO par
    function test_two_pairs(hand_info) {            
        let pair1 = false,
            pair2 = false;
        let array = []; 
        let not_done = 1;
        
        let i = 14;
        while(i >= 2 && !pair1) {
            if(hand_info.count_rank[i] >= 2) {
                pair1 = i;
                array.push(pair1, pair1);
            }
            i--;
        }
        while(i >= 2 && !pair2) {
            if(hand_info.count_rank[i] >= 2) {
                pair2 = i;
                array.push(pair2, pair2);
            }
            i--;
        }   
        if(pair1 && pair2){
            for(let i = 0; i < 7 && not_done; i++) {
                if(hand_info.hand[i].rank != pair1 &&
                hand_info.hand[i].rank != pair2 ) {

                    array.push(hand_info.hand[i].rank);
                    hand_info.strong[two_pairs] = array;
                    not_done = 0;  //break
                }
            }
        }
        return;
    }

    function find_full_house(hand_info) {
        let threes = false, 
            pair = false;
        let array = [];
        let done = false;

        let i = 14;
        while(i >= 2 && !threes) {
            if(hand_info.count_rank[i] >= 3) {
                threes = i;
                array.push(threes, threes, threes);
            }
            i--;
        }
        i = 14;
        [7,7,7,4,4];
        while(i >= 2 && done == false) {

            if(hand_info.count_rank[i] >= 2) {
                pair = i;
                if(threes != pair) {
                    array.push(pair, pair);
                    done = true;
                }
            }
            i--;
        } 
        if(array.length == 5) {
            hand_info.strong[full_house] = array;
        }
    }
    

    //Placere spillerens 7 tilgængelige kort i hand, og sortere
    let hand_info1 = {hand: [], count_rank: [], count_suit: [], strong: []};
    let hand_info2 = {hand: [], count_rank: [], count_suit: [], strong: []};
    for(let i = 0; i < 5; i++) {
        hand_info1.hand[i] = this.table_cards[i];
        hand_info2.hand[i] = this.table_cards[i];
    }
    hand_info1.hand.push(player1.hand[0], player1.hand[1]);
    hand_info2.hand.push(player2.hand[0], player2.hand[1]);

    sort_hand(hand_info1);
    sort_hand(hand_info2);

    count_suits(hand_info1);
    count_suits(hand_info2);

    find_count_rank(hand_info1);
    find_count_rank(hand_info2);

    let a_function = [];
    a_function[high_card] = test_high_card;  
    a_function[pair] = test_pair;
    a_function[two_pairs] = test_two_pairs;
    a_function[three_of_kind] = test_for_three;
    a_function[straight] = find_straight;
    a_function[flush] = test_flush;
    a_function[full_house] = find_full_house;
    a_function[four_of_kind] = test_for_four;
    a_function[straight_flush] = test_for_straight_flush;


    for(let i = high_card; i < straight_flush; i++) {
        a_function[i](hand_info1);
        a_function[i](hand_info2);
    }


    console.log("\n\n\n")

    console.log(hand_info1);
    console.log("\n\n\n")
    console.log("\n\n\n")
    console.log(hand_info2);
    console.log("\n\n\n")


    if(hand_info1.strong.length > hand_info2.strong.length) {
        return player1;
    } else if (hand_info1.strong.length < hand_info2.strong.length) {
        return player2;
    } else {
        for(let i = 0; i < 5; i++) {
            if(hand_info1.strong[i] > hand_info2.strong[i]) {
                return player1;
            } else if (hand_info1.strong[i] < hand_info2.strong[i]) {
                return player2;
            }
        }
        return false;
    }
}
