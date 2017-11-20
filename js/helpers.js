/////////////////
// Conversions //
/////////////////
let max_seconds = max_travel_time * 3600;
let priority_list = priorities.map(x => Priority.find_by_name(x));
let delay = 1000*secDelay;
let rec_val = rec_bonus/100;

/////////////
// HELPERS //
/////////////
var store_file = function (file, func) {
    //helper method for making ajax request on local files
    let re = new RegExp(".csv");
    let _type = re.exec(file) ? "text" : "json";
    $.get({
        url: file,
        async: false,
        dataType: _type,
        success: func
    });
}

//updating file paths
$("div.fileUpload").each(function (x) {
    let main = $(this);
    let text = $(main.find(".file_text"));
    let input = $(main.find("input"));
    input.change(function () {
        text.text(this.value);
    });
})

//creates a download button and file for any plain text
let makeTextFile = function (file_name,text) {
    var data = new Blob([text], { type: 'text/plain' });    
    // returns a URL you can use as a href
    $("body").append($("<a />", {
        href: window.URL.createObjectURL(data),
        text: `Download "${file_name}"` ,
        download: file_name
    }));
    return text;
};
var x;
//tables slide up and down
function slideTable(h2) {
    let head_data = $(h2).attr("data-id");
    let table = $($(`#${head_data}`).find("table")[0]);
    let trs = table.find("tr");

    $(trs).slideToggle();
}