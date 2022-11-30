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
console.log(publicPath);
app.use(express.static(publicPath));


function cal_props(hands,board){
    const iterations = 100000 // optional
    const exhaustive = false // optional
    let output = calculateEquity(hands, board, iterations, exhaustive);
    return output;
}

const hands = [['As', 'Kh'], ['Kd', 'Qs'],['Js','Jh']]
const board = []


let output = cal_props(hands,board)
console.log(output)





app.listen(3000, () => console.log("Starting up poker game"));