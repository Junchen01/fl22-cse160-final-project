let suits = ["s", "h", "c", "d"];
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

let deck;
let playercount = 0;
let hands = [];
let board = [];
let onSelect = false;
let onSelectObject = null;

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

function displayDeck(deck){
    for(let i = 0; i < deck.length; i++){
        let img_tmp = '<img src="' + deck[i].path + '"';
        img_tmp += 'alt="' + deck[i].value + deck[i].suit + '"';
        img_tmp += 'id="' + deck[i].value + deck[i].suit + '"';
        img_tmp += 'class="selectable"';
        img_tmp += 'width="50"';
        img_tmp += 'onclick="selectDeck(this)">';
        $("#deck").append(img_tmp);
    }
}

function addPlayer(){
    playercount++;
    let player_tmp = '<div id="' + playercount + '">';
    player_tmp += '<h3>Player ' + playercount + ':</h3>';
    player_tmp += '<img src="card/back.png" alt="Girl in a jacket" width="75">';
    player_tmp += '<img src="card/back.png" alt="Girl in a jacket" width="75">';
    player_tmp += '</div>'; 
    $("#players").append(player_tmp);
    hands.push[null,null];
}

function removePlayer(){
    $("#"+ playercount).remove();
    hands.pop();
    playercount--;
}

function setupBoard(){
    for(let i = 0; i < 5; i++){
        let boardCard_tmp = '<img src="card/back.png"';
        boardCard_tmp += 'alt="empty card"';
        boardCard_tmp += 'id="board"';
        boardCard_tmp += 'width="75"';
        boardCard_tmp += 'class="empty board"';
        boardCard_tmp += 'onclick="selectCard(this)">';
        $("#board").append(boardCard_tmp);
    }
}

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

function setupPlayers(){
    for(let i = 0; i < 2; i++){
        addPlayer();
    }
}

$("#deck").empty().appendTo("hi");

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
        board = [];
        $('.board').each(function() {
            if($(this).attr("alt") !== 'empty card'){
                board.push($(this).attr("alt"));
            }
        });
        console.log(board)
    });

    $("#calculate").unbind().click(() => {
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
                $("#tableBody").html(json)
              },
              error: function (jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
              }
            }
          )
    });
});