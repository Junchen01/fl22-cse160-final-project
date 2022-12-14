let suits = ["s", "h", "c", "d"];
let values = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

let deck;
let playercount = 0;
let hands = [];
let board = [];
let onSelect = false;
let onSelectObject = null;

let checkempty = true;
let checkboard = true;

/**
 * use two for loop to creat object of poker with suits, value, weight and path to img
 * 
 * @returns the deck of poker
 */
function createDeck(){
    let deck = new Array();
    for(var j = 0; j < suits.length; j++){
        for (var i = 0 ; i < values.length; i++){
            var weight = parseInt(values[i]);
            if (values[i] == "T" || values[i] == "J" || values[i] == "Q" || values[i] == "K"){
                weight = 10;
            }
            if (values[i] == "A"){
                weight = 11;
            }
            let path = "card/" + values[i] + suits[j] + ".png";
            var card = { value: values[i], suit: suits[j], weight: weight, path: path };
            deck.push(card);
        }
    }
    return deck;
}

/**
 * add the poker image to a html table sting and use jquery to append it
 * 
 * @param {*} deck the deck of poker we want to display
 */
function displayDeck(deck){
    let i = 0;
    let img_tmp = '';
    for(let j = 0; j < 4; j++){
        img_tmp += '<tr>';
        for(let k = 0; k < 13; k++){
            img_tmp += '<td><img src="' + deck[i].path + '"';
            img_tmp += 'alt="' + deck[i].value + deck[i].suit + '"';
            img_tmp += 'id="' + deck[i].value + deck[i].suit + '"';
            img_tmp += 'class="selectable"';
            img_tmp += 'width="50"';
            img_tmp += 'onclick="selectDeck(this)"></td>';
            i++;
        }
        img_tmp += '</tr>';
    }
    $("#deck").empty().append(img_tmp);
}


/**
 * add a player and two empty card back, add to the html by use jquery
 */
function addPlayer(){
    playercount++;
    let player_tmp = '<div id="' + playercount + '" class="player">';
    player_tmp += '<h3>Player ' + playercount + ':</h3>';
    for(let i = 0; i < 2; i++){
        player_tmp += '<img src="card/back.png"';
        player_tmp += 'alt="empty card"';
        player_tmp += 'id="palyer' + playercount + '-' + (i+1) + '"';
        player_tmp += 'width="75"';
        player_tmp += 'class="empty player' + playercount + '"';
        player_tmp += 'onclick="selectCard(this)">';
    }
    player_tmp += '</div>';
    player_tmp += '<div style="clear:both;"></div>';
    $("#players").append(player_tmp);
}

/**
 * remove a play div use the jquery
 */
function removePlayer(){
    $("#"+ playercount).remove();
    hands.pop();
    playercount--;
}

/**
 * set up an emppty board add this to the div in the html
 */
function setupBoard(){
    let boardCard_tmp = '';
    for(let i = 0; i < 5; i++){
        boardCard_tmp += '<img src="card/back.png"';
        boardCard_tmp += 'alt="empty card"';
        boardCard_tmp += 'id="board' + (i+1) + '"';
        boardCard_tmp += 'width="75"';
        boardCard_tmp += 'class="empty board"';
        boardCard_tmp += 'onclick="selectCard(this)">';
    }
    $("#board").empty().append(boardCard_tmp);
}

/**
 * handle the click happen on the board
 * If this card has been selected:
 *      we remove the content and set back to empty card;
 * If this card has not been selected:
 *      we check if this hilgh light or not:
 *              If is, remove the high light
 *              else highlit it.
 *
 * @param {*} img the object img that been cleck
 */
function selectCard(img){
    if(img.classList.contains('selected')){
        img.src = 'card/back.png';
        document.getElementById(img.alt).classList.remove("unselectable");
        document.getElementById(img.alt).classList.add("selectable");
        img.classList.add('empty');
        img.classList.remove('selected');
        img.alt = 'empty card';
    }else{
        if(onSelectObject === img){
            onSelectObject = null;
            onSelect = false;
            img.style.border = '';
        }else{
            if(onSelectObject !== null){
                onSelectObject.style.border = '';
            }
            onSelectObject = img;
            img.style.border = "3px solid black";
            onSelect = true;
        }
    }
}

/**
 * handle the cilck on the deck
 * only work when there is a selectable borad card is high light
 * set the deck card to the dard style(by change color)
 * copy this to the board card.
 * 
 * @param {*} img the object img that been cleck
 */
function selectDeck(img){
    if(onSelect && img.classList.contains('selectable')){
        onSelectObject.src = img.src;
        onSelectObject.alt = img.id;
        onSelectObject.classList.remove("empty");
        onSelectObject.classList.add("selected");
        img.classList.remove("selectable");
        img.classList.add("unselectable");
        onSelectObject.style.border = '';
        onSelectObject = null;
        onSelect = false;
    }
}

/**
 * set up two player
 */
function setupPlayers(){
    $("#players").empty();
    for(let i = 0; i < 2; i++){
        addPlayer();
    }
}

/**
 * get the card value on board as array
 * @returns false if is not the preflop, flop, turn river; 
 *          true for correct situation
 */
function getBoardCard(){
    board = [];
    $('.board').each(function() {
        if($(this).attr("alt") !== 'empty card'){
            board.push($(this).attr("alt"));
        }
    });
    if(board.length === 1 || board.length === 2){
        return false;
    }else{
        return true;
    }
}

/**
 * get the card value of players as array of array
 * @returns true for all play have two card; false otherwise
 */
function getPlayersCard(){
    checkempty = true;
    hands = [];
    for(let i = 0; i < playercount; i++){
        let playerCard_tmp = [];
        $('.player' + (i+1)).each(function() {
            if($(this).attr("alt") !== 'empty card'){
                playerCard_tmp.push($(this).attr("alt"));
            }else{
                checkempty = false;
            }
        });
        hands.push(playerCard_tmp);
    }
    return checkempty;
}

/**
 * call getBoardCard() and getPlayersCard() to get card infor
 * @returns true for ok to calculate; false otherwise
 */
function getCardArrays(){
    if(!getBoardCard()){
        alert('must be the situation of PREFLOP, FLOP, TURN or RIVER\n(0/3/4/5 cards on the board)');
        return false;
    }else if(!getPlayersCard()){
        alert('must fill out ALL players card!');
        return false;
    }else{
        return true;
    }
}

/**
 * it add the win and tie rate to each player
 * @param {*} result the result structer save the result of the prob
 */
function showResulet(result){
    $( ".result" ).remove();
    for(let i = 0; i < playercount ; i++){
        let result_tmp = '<div class="result"><br><br><div class="innerResult"><h4>win: ' + result[i].win + '</h4>';
        result_tmp += '<h4>tie: ' + result[i].tie + '</h4></div></div>';
        $('#'+ (i + 1)).after(result_tmp);
    }
    showResuletTable(result);
}

/**
 * it use two forloop to create a table and append to this table
 * @param {*} result the result structer save the result of the prob
 */
function showResuletTable(result){
    let resultTable = '';
    resultTable += '<tr>';
    resultTable += '<td style="background-color:rgba(253, 195, 103, 0.8)">Rank</td>';
    for(let j = 0; j < result.length; j++){
        resultTable += '<td style="background-color:rgba(60, 144, 133, 0.8);">Player' + j + '</td>';
    }
    resultTable += '</tr>';
    for(let i = 0; i < 10; i++){
        resultTable += '<tr>';
        resultTable += '<td style="background-color:rgb(129, 200, 250, 0.8);"><p>' + result[0].handProbs[i].name + '</p></td>';
        for(let j = 0; j < result.length; j++){
            if(result[j].handProbs[i].rank_num < 0.01){
                resultTable += '<td style="background-color:rgba(253, 103, 103,0.4);"><p>';
                resultTable +=  result[j].handProbs[i].prob + '</p></td>';
            }else{
                resultTable += '<td style="background-color:rgba(0, 150, 0,' + result[j].handProbs[i].rank_num * 2 + ');"><p>';
                resultTable +=  result[j].handProbs[i].prob + '</p></td>';
            }
        }
        resultTable += '</tr>';
    }
    $("#resultTB").empty().append(resultTable);
}

/**
 * put the whole page in to one pdf and downlode it
 */
function getPDF(){
    var HTML_Width = $(".canvas_div_pdf").width();
    var HTML_Height = $(".canvas_div_pdf").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width+(top_left_margin*2);
    var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;
    var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
    html2canvas($(".canvas_div_pdf")[0],{allowTaint:true}).then(function(canvas) {
        canvas.getContext('2d');
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }        
        pdf.save("HTML-Document.pdf");
    });
};

$(() => {
    deck = createDeck();
    displayDeck(deck);
    setupBoard();
    setupPlayers();

    $("#add").unbind().click(() => {
        if(playercount < 9){
            addPlayer();
        }else{
            alert("at MOST NINE player on table")
        }
    });

    $("#remove").unbind().click(() => {
        if(playercount > 2){
            removePlayer();
        }else{
            alert("at LEAST TWO player on table")
        }
    });

    $("#new").unbind().click(() => {
        playercount = 0;
        deck = createDeck();
        displayDeck(deck);
        setupBoard();
        setupPlayers();
        $('#resultTB').empty();
    });
    

    $("#calculate").unbind().click(() => {
        if(getCardArrays()){
            $.ajax(
                "/calculate",
                {
                  type: "GET",
                  data: {
                    hands: hands,
                    board: board
                  },
                  dataType: "text",
                  success: function (json) {
                    let result = JSON.parse(json);
                    showResulet(result);
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error: " + jqXHR.responseText);
                    alert("Error: " + textStatus);
                    alert("Error: " + errorThrown);
                  }
                }
              )
        }
    });

    $("#save").unbind().click(() => {
        getPDF()
    });
});