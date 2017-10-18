// Annoying CORS
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
// NOTE: csv need "+" as delimiter
//if 'student.json' exists, should use to reduce API calls
let useStudentJSON = true;
let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8';
// let directionsService = new google.maps.DirectionsService();
let secDelay = 1;//delay in seconds for api call
let splice_number = 100; //number of students per API call (max 100)
let max_travel_time = 1; //in hours
// TURN INTO TIME NOT DISTANCE (under 1 hour time)

let priorities = [
    "score"
    // ,
    // "ethnicity",
    // "duration",
    // "grade"
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


// let urls = [
//     "https://raw.githubusercontent.com/mahdiASC/sorting_hat/master/cohorts.csv",
//     "https://raw.githubusercontent.com/mahdiASC/sorting_hat/master/questions.json",
//     "https://raw.githubusercontent.com/mahdiASC/sorting_hat/master/students.json",
//     "https://raw.githubusercontent.com/mahdiASC/sorting_hat/master/students.csv"
// ];

let urls = [
    "./cohorts.csv",
    "./questions.json",
    "./students.csv",
    "./students.json"
];
let max_seconds= max_travel_time *3600;
let priority_list = priorities.map(x=>Priority.find_by_name(x));

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

let y;

function setup() {
    noCanvas();
    //loading data into files
    store_file(urls[0],x => Cohort.createFromCSVString(x));
    // store_file("../cohorts.csv",x => Cohort.createFromCSVString(x));
    store_file(urls[1],x => Question.createFromJSON(x));
    // store_file("../questions.json",x => Question.createFromJSON(x));
    //loading students as JSON (from previous load)
    if (useStudentJSON) {
        store_file(urls[3],x => Student.createFromJSON(x));
        // store_file("../students.json",x => Student.createFromJSON(x));
    } else {
        store_file(urls[2],x => Student.createFromCSVString(x));
        // store_file("../students.csv",x => Student.createFromCSVString(x));
    }

    y = new Sort();
    // y.fillRosters();
}
