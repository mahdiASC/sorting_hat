// Annoying CORS
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

// upload to Google Drive Spreadsheet, make edits and download as tab-separated values (TSV)

///////////////
// VARIABLES //
///////////////
const cohort_data = "data/cohorts.tsv"; // location of default cohorts
// const student_data = "data/dummy_data.tsv"; // location of default student dummy data
const student_data = ["data/a.tsv","data/b.tsv"]; // location of default student dummy data
const max_travel_time = 3; //max travel time in hours for each students to their assigned cohort
const rec_bonus = 1; //amount a recommendation increases score for student
const class_size = 22;

const student_properties = { // gives name of property with column text found in .tsv     
    "First Name":"first_name",
    "Last Name":"last_name",
    "What is your gender?":"gender",
    "Do you primarily identify as:":"race_primary",
    "Zip Code":"zip",
    "State":"state",
    "City":"city",
    "What type of school is it?":"school_type",
    "What grade are you currently in?":"grade",
    "What is your current GPA? Convert your score to the 4.0 scale. (Example: An 85, or a B, is converted to a 3.0)This information is only for our data, and will not be factored into your admission.":"gpa",
    "Do you qualify for financial aid?":"f_aid",
    "Do you qualify for free/reduced lunch?":"f_lunch",
    "Do you have experience coding or computer science experience?Example: taking a computer science course in high school, or an online course.This information is only for our data, and will not be factored into your admission.":"cs",
    "Can you tell us about a time that you struggled with something? For example, a subject in school, a major assignment, or a personal project. What was challenging about it? What did you do?Please be thorough in your response.":"essay_raw",
    "https://lh3.googleusercontent.com/8rJRLwtVDlMT2RArWcjvgpcIWIT73aLjPA-eYGIbUq7sZ-88yEvipPmjlcmc4NJ49qJbKZU3UTMh0As3TbJKasaKFl7pfIahYJb9_lYcu31wfvXzpmk0YhHW3uJ-af05DNtUB1XXQvnbuXg":"logic_1",
    "COATS is to TACOS as 25317 is to...":"logic_2",
    "Which number comes next in the following sequence? 41, 40, 43, 42, 45, ...":"logic_3", // BEWARE "SPACE" AFTER QUESTION MARK, ASCII 160
    "FEATHER is to WING as...":"logic_4",
    "readscore":"readscore",
    "rec":"rec",
    "star":"star",    
    "What is your personal e-mail?":"email"
}

const cohort_properties = {
    "name":"name",
    "location":"location",
    "logo":"logo"
}

const correct_logic = { //use succinct/converted property names
    "logic_1":"https://lh6.googleusercontent.com/OS0wpZ0GeZM23FnjTN7LaTkphXb8dsvw3Up13aK3KjkFcYAsKXofjNk_SJn_NK5I9PsZjVv-wVISYsClq8HMNuYerLBFdBV6q5rAhkjEW2GvPWcPG8-DyfQKajY9_y_LAjtjhOAoxWyvjYQ",
    "logic_2":"13257",
    "logic_3":"44",
    "logic_4":"LEAF is to BRANCH"
}

const secondary_races = { 
    // Helps create secondary race array from columns by number of columns after and including star column number
    "Which of the following do you identify as? (Select as many as apply)": 12
}

const student_stats = { 
    // Used to create relevant stats for students (requires converted name from student_properties) and declare if stat is a number or string
    "school_type":"string",
    "grade":"string",
    "gpa":"number",
    "f_aid":"string",
    "f_lunch":"string",
    "cs":"string",
    "race_primary":"string"
}

/////////
// API //
/////////
let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8'; // for google distance map API
let secDelay = 1; //delay in seconds for api call
let splice_number = 100; //number of students per API call (max 100)

//////////////
// DEFAULTS //
//////////////

// what will be used to display graph data
// takes real property from Student obj and the displayed text as value
let graph_labels = {
    "cs":"CS Exp.",
    "race_primary":"Demographics",
    "school_type":"School Type",
    "grade":"Grade"
}

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

// returns array of proper obj properties as keys to be displayed on student popup as value
let student_display_properties = student => {
    let output = {};
    console.log(student)
    output["1_Name"] = student.name;
    output["2_Gender"] = student.gender;
    output["3_Race"] = student.race_primary;
    output["4_Address"] = `${student.city}, ${student.state} ${student.zip}`;
    output["5_School Type"] = student.school_type;
    output["6_Grade"]=student.grade;
    output["7_Financial Aid?"] = student.f_aid;
    output["8_Reduced Lunch?"] = student.f_lunch;
    output["9_Prev. CS?"] = student.cs;
    output["10_Recommended?"] = student.rec;
    output["12_Total Score"] = student.score;
    output["13_Essay"] = student.essay_raw;

    return output;
}

// NOTE: Sort visualization is highly customized to 2018 data