// Annoying CORS
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
// NOTE: csv need "+" as delimiter

let useStudentJSON = true;
let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8';
let secDelay = 1;//delay in seconds for api call
let splice_number = 100; //number of students per API call (max 100)
let max_travel_time = 1; //in hours
let white_threshold = .03; //percentage of applicants we will consider - randomly removed up to this percent
let minority_rate = 0.8; //the percentage of brown students per cohort (this is rounded down by minority_leeway students as a minimum)
let minority_leeway = 2; //# of students that lowers the bar for minority_rate 
let grade_leeway = 2; //# of students that lowers the bar for grade level disparity (between 10th and 11th);
// TURN INTO TIME NOT DISTANCE (under 1 hour time)

// ARE WE EXCLUDING WHITE APPLICANTS, PERIOD?
let priorities = [
    "score"
    ,
    "duration"
    ,
    "ethnicity"
    ,
    "grade"
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
    "./data/cohorts.csv",
    "./data/questions.json",
    "./data/students.csv",
    "./data/students.json"
];
// let max_seconds = max_travel_time *3600;
let max_seconds = 1936026; //OMIT THIS (just for testing)
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

let x,y,z;

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

    //Filtering out white applicants to threshold

    //CODE THIS!
    y = new Sort();

    x = new Statistic();
    x.visualize_stats()
    //verify no students belong to multiple cohorts
    // z = new Validate();
    // z.main();
}

