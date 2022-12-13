/**
 *  author: Junchen Bao
 *  email: jub424@lehigh.edu
 *  class: CSE 264
 *  assignment number: Final project
 */

import { calculateEquity } from 'poker-odds'
import express from 'express'
import path from 'path'

let app = express();

let publicPath = path.resolve(process.cwd(), "public");
app.use(express.static(publicPath));


function cal_hands(hands,board){
    const iterations = 100000 // optional
    const exhaustive = false // optional
    let hands_output = calculateEquity(hands, board, iterations, exhaustive);
    let probs_output = cal_probs(hands_output);
    return probs_output;
}

function cal_probs(hands_output){
    let probs_output= [];
    for(let i = 0; i < hands_output.length; i++){
        let total_hand = hands_output[i].count;
        let win_rate = (hands_output[i].wins/total_hand * 100).toFixed(2) + '%';
        let tie_rate = (hands_output[i].ties/total_hand * 100).toFixed(2) + '%';
        let handProbs = [];
        for(let j = 0; j < hands_output[i].handChances.length; j++){
            let name_temp = hands_output[i].handChances[j].name;
            let count_temp = hands_output[i].handChances[j].count;
            let prob_tmp = (count_temp/total_hand * 100).toFixed(2) + '%';
            let temp_pro = count_temp/total_hand;
            handProbs.push({name: name_temp, prob: prob_tmp, rank_num: temp_pro});
        }
        let player = { count: total_hand, win: win_rate, tie: tie_rate, handProbs: handProbs};
        probs_output.push(player);
    }
    return probs_output;
}

app.get("/calculate", function(req, res) {
    console.log(req.query.board);
    console.log(req.query.hands);
    console.log("---------------");

    let hands = req.query.hands;
    let board = req.query.board;
    
    let output = cal_hands(hands,board)
    let output_json = JSON.stringify(output);
    res.end(output_json);
});

app.listen(3000, () => console.log("Starting up poker game"));