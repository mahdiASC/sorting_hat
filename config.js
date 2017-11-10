// Annoying CORS
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
// NOTE: csv need "/u0009" (tab) as delimiter

///////////////
// VARIABLES //
///////////////

let max_travel_time = 1; //max travel time to each cohort from student's home (hours)
let minority_rate = 0.8; //the percentage of brown students per cohort (this is rounded down by minority_leeway students as a minimum)
let minority_leeway = 2; //# of students that lowers the bar for minority_rate 
let grade_leeway = 2; //# of students that lowers the bar for grade level disparity (between 10th and 11th);
let white_threshold = 0; //percentage of white applicants we will consider
let rec_bonus = 0; //percentage reduction in discontent deviation for students who come recommended
let useStudentJSON = true; //if false, will allos download of student JSON file

/////////
// API //
/////////
let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8';
let secDelay = 1; //delay in seconds for api call
let splice_number = 100; //number of students per API call (max 100)

//////////////
// DEFAULTS //
//////////////

let priorities = [
    "score",
    "duration",
    "ethnicity",
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

let urls = [
    "./data/cohorts.csv",
    "./data/questions.json",
    "./data/students.csv",
    "./data/students.json"
];