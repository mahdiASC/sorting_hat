// Will control game logic

//Demographics = click of button hides all (if valid) and starts game
// Game includes logic, pre-tech, and trait questions intermingled

// final submit takes all stored data and submits to google form

// Where it starts
// https://github.com/heaversm/google-custom-form
/* <input type="hidden" name="entry.281452218" */
// https://docs.google.com/forms/u/1/d/e/1FAIpQLSdenq8Yy8kUlAAl_EBXySWGWFtP3pGRUSkF8WloELiTPl0wzw/formResponse
console.log("loaded");
 
let url = "https://docs.google.com/forms/u/1/d/e/1FAIpQLSevLTlqoqrkH3bNYNIStWbvjyzptP6JJV5bZC8RJAuRuxw8xg/formResponse?";
var q1ID = "entry.1466968445";
let name = encodeURIComponent($(`input`).val());//can do $.next();

let submitRef = '&submit=-459362922166947359';

var submitURL = (url + q1ID + "=" + name + submitRef);

console.log(submitURL);
$('#form')[0].action=submitURL;

// https://docs.google.com/forms/u/1/d/e/1FAIpQLSevLTlqoqrkH3bNYNIStWbvjyzptP6JJV5bZC8RJAuRuxw8xg/formResponse?entry.1466968445=asdf&submit=-459362922166947359
function reset(){
    let name = $("input").first.val("");
    // let email =  $("#email").val("");
    // let grade = $("input[type='radio'][name='grade']:checked").prop("checked",false);
}