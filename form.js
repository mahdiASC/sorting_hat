// Will control game logic

//Demographics = click of button hides all (if valid) and starts game
// Game includes logic, pre-tech, and trait questions intermingled

// final submit takes all stored data and submits to google form

// api key = AIzaSyCbDnUm7XXOv54842Dq0Agh-8XyVXfenKA
// client id = 520347494565-o7qmirtc2nems9k0qdvu7uc6k1vaiuif.apps.googleusercontent.com

// Spreadsheet  =1UYcjaOT7Oz5zoDzYSHLeLyRSJ8-JvV4qMwQJOzzioe8
// secret = Ay8WDdRqPmGgMv3iCMUWJsM

// Where it starts
// https://github.com/heaversm/google-custom-form
/* <input type="hidden" name="entry.281452218" */
// https://docs.google.com/forms/u/1/d/e/1FAIpQLSdenq8Yy8kUlAAl_EBXySWGWFtP3pGRUSkF8WloELiTPl0wzw/formResponse
$('#form').one('submit',function(){
    
    let url = "https://docs.google.com/forms/u/1/d/e/1FAIpQLSdenq8Yy8kUlAAl_EBXySWGWFtP3pGRUSkF8WloELiTPl0wzw/formResponse?";
    var q1ID = "entry.1576322846";
    let name = encodeURIComponent($("#name").val());

    var q2ID = "entry.281452218";
    let email =  encodeURIComponent($("#email").val());

    var q3ID = "entry.175417006";
    let grade = encodeURIComponent($("input[type='radio'][name='grade']:checked").val());

    let submitRef = '&submit=-1382798946213553241';
    
    var submitURL = (url + q1ID + "=" + name + "&" + q2ID + "=" + email + "&" + q3ID + "=" + grade + submitRef);

    $(this)[0].action=submitURL;
    console.log(submitURL);
});


function clearAll(){
    let name = $("#name").val("");
    let email =  $("#email").val("");
    let grade = $("input[type='radio'][name='grade']:checked").prop("checked",false);
}