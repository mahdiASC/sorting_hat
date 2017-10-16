// Annoying CORS
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
// NOTE: csv need "+" as delimiter
//if 'student.json' exists, should use to reduce API calls
let useStudentJSON = true;
// let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8';
let api_key = 'AIzaSyD5rZpry5-4tfcw_wyvHkE7DAjfQlaBHsU';
// let directionsService = new google.maps.DirectionsService();
let secDelay = 1;//delay in seconds for api call
let splice_number = 100; //number of students per API call (max 100)
let max_distance = 10; //max distance student can be from cohort in miles
let priorities = [
    "score",
    "ethnicity",
    "distance",
    "grade",
    "school_type",
    "prev_cs"
]

let graph_colors = [
    "rgba(80,193,233,0.75)",
    "rgba(162,133,220,0.75)",
    "rgba(157,208,82,0.75)",
    "rgba(235,171,36,0.75)",
    "rgba(234,93,79,0.75)",
    "rgba(60,62,66,0.75)",
    "rgba(235,55,55,0.75)",
    "rgba(200,222,235,0.75)"
]
let max_distance_meters= max_distance *1609.34;
let priority_list = priorities.map(x=>Priority.find_by_name(x));

function setup() {
    noCanvas();
    //loading data into files
    store_file("../cohorts.csv",x => Cohort.createFromCSVString(x));
    store_file("../questions.json",x => Question.createFromJSON(x));
    //loading students as JSON (from previous load)
    if (useStudentJSON) {
        store_file("../students.json",x => Student.createFromJSON(x));
    } else {
        store_file("../students.csv",x => Student.createFromCSVString(x));
    }
}

var store_file = function(file, func){
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