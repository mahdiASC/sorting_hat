/////////////////
// Conversions //
/////////////////
let max_seconds = max_travel_time * 3600;
let delay = 1000*secDelay;

/////////////
// HELPERS //
/////////////
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
