/**
 *  author: Junchen Bao
 *  email: jub424@lehigh.edu
 *  class: CSE 264
 *  assignment number: Final project
 */


 const express = require("express");
 const path = require("path");
 
 let app = express();
 
 let publicPath = path.resolve(__dirname, "public");
 app.use(express.static(publicPath));
 
 
 app.listen(3000, () => console.log("Starting up poker game"));