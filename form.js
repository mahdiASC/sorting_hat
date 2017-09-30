// Will control game logic

//Demographics = click of button hides all (if valid) and starts game
// Game includes logic, pre-tech, and trait questions intermingled

// final submit takes all stored data and submits to google form

// api key = AIzaSyCbDnUm7XXOv54842Dq0Agh-8XyVXfenKA
// client id = 520347494565-o7qmirtc2nems9k0qdvu7uc6k1vaiuif.apps.googleusercontent.com

// Spreadsheet  =1UYcjaOT7Oz5zoDzYSHLeLyRSJ8-JvV4qMwQJOzzioe8
// secret = Ay8WDdRqPmGgMv3iCMUWJsM

let url = "https://docs.google.com/forms/d/1B0ju0fHxoM8DF3GjS_mvY3zzQFwkq8iF-Dwv9CA-Q_w";
function sendData(){
    let name = $("#name").val();
    let email =  $("#email").val();
    let grade = $("input[type='radio'][name='grade']:checked").val();
    let data = {

    };
    $.ajax({
        url: url,
        data: data,
        type: "post",
        dataType: "xml",
        statusCode: {
            0 : clearAll
        }

    })
}

function clearAll(){
    let name = $("#name").val("");
    let email =  $("#email").val("");
    let grade = $("input[type='radio'][name='grade']:checked").prop("checked",false);
}