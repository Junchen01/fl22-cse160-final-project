var suits = ["s", "h", "c", "d"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
var deck = new Array();

function createDeck(){
    deck = new Array();
    for (var i = 0 ; i < values.length; i++){
        for(var j = 0; j < suits.length; j++)
        {
            var weight = parseInt(values[i]);
            if (values[i] == "T" || values[i] == "J" || values[i] == "Q" || values[i] == "K"){
                weight = 10;
            }
            if (values[i] == "A"){
                weight = 11;
            }
            let path = "img/" + values[i] + suits[j] + ".png";
            var card = { value: values[i], suit: suits[j], weight: weight, path: path };
            deck.push(card);
        }
    }
    shuffleArray(array);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

createDeck();
console.log(deck);


$(() => {
    
});

