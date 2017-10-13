
// NOTE: csv need "+" as delimiter
//if 'student.json' exists, should use to reduce API calls
let useStudentJSON = true;
let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8';
let directionsService = new google.maps.DirectionsService();
let secDelay = 1;//delay in seconds for api call
//REQUIRES 'mahdi.js'

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
//To do for full game
// Setup static website
// using p5.js and p5.dom.js
// play game
// store data until game done
// update datasheet

// To Do for sorting
// create algorithm for sorting students
// --competition and prioritization
// take into account waitlist?
// include image of student and cohorts in data


// The sorting hat questions and application questions are intermingled
// Would be part of MOU and have host site complete the sorting test as well and use THAT
// as metric for sorting cohort students

// worry about waitlist peeps
class _base {
    //handles basic initialization and ALL storage for each
    //extended class
    constructor(params) {
        if (!this.constructor.all) {
            this.constructor.all = []
        }
        this.constructor.all.push(this);
        for (let i in params) {
            this[i] = params[i];
        }
    }
}

_base.createFromCSVString = function (fileString) {
    let self = this;
    return Papa.parse(fileString, {
        delimiter: "+",
        complete: function (results) {
            let header = results.data[0];
            for (let i = 1; i < results.data.length; i++) {
                parseObjects.apply(self, [header, results.data[i]]);
            }
        }
    });
}

const parseObjects = function (header, arr) {
    let output = {};
    for (let x in header) {
        output[header[x]] = arr[x];
    }
    new this(output);
}

class Question extends _base {

    outcome(choice) {
        return this.answers.find(c => c.text == choice).outcome;
    }
}

Question.first = () => {
    return Question.all.find(x => Number(x.id) == 1);
};

Question.next = (q, choice) => {
    //accepts arguments of a Question object
    //returns the next logical Question object by traversing linkage backwards
    //handles sub_q
    let found = q.answers.find(x => x.text == choice);
    if (Object.keys(found).some(key => key == "sub_q")) {
        return found.sub_q;
    } else {
        //backtrack 
        let root = Question.rootq(q);
        if (!root) {
            return undefined;
        }
        return Question.find(Number(root.id) + 1);
    }
}

Question.rootq = q => {
    //finds root question (with an id) of input Question object
    let output = q.parent
    if (!output) {
        return undefined;
    }
    let attempt = output.parent;
    while (attempt !== undefined) {
        output = attempt;
        attempt = attempt.parent;
    }
    return output;
}

Question.find = num => {
    //find question with id == num
    return Question.all.find(q => Number(q.id) == num);
}

Question.createFromJSON = function (obj) {
    //linked list styled questions
    //recursively creates questions w/subquestions
    if (obj["text"]) {
        //single question
        let q = new this(obj);

        q.answers.forEach(a => {
            if (a.sub_q) {
                a.sub_q = Question.createFromJSON(a.sub_q);
                a.sub_q.parent = q;
            }
        });
        return q;
    } else {
        //multiple questions
        for (let i of Object.keys(obj)) {
            Question.createFromJSON(obj[i]);
        }
    }
}

class Timer {
    // in charge of keeping count and percent done
    constructor(total_count,cohort_name){
        this.total_count=total_count;
        this.current = 0;
        console.log(`Starting ${cohort_name}`);
    }

    update(){
        this.current++;
        if(this.done_check()){
            console.log("Done!");
            addStudentDownload();
        }else{
            console.log(Math.round((this.current/this.total_count)*100,2)+"% done...");
        }
    }

    done_check(){
        return this.current==this.total_count;
    }
}

class Cohort extends _base {
    constructor(params) {
        super();
        this.class = [];
        this.waitlist = [];
        this.ideal_stats = {};
        this.name = params.name;
        this.capacity = params.capacity;
        this.location = params.location;
        let statKeys = Object.keys(params).filter(key => !Object.keys(this).includes(key));
        for (let i of statKeys) {
            this.ideal_stats[i] = Number(params[i]);
        }
    }

    scoreStudent(student) {
        //scores a single student
        // uses total R^2 (ideal candidate has R^2 of 0)
        let score = 0;
        for (let key of Object.keys(this.ideal_stats)) {
            if (!student.stats[key]) {
                student.stats[key] = 0;
            }
            let diff = Math.abs(student.stats[key] - this.ideal_stats[key]);
            score += Math.pow(diff, 2);
        }

        //adding cohort to student's list
        student.scores.push({
            "cohort": this.name,
            "score": score
        })

        // return score;
    }

    distStudent(student, delay, timer) {
        //makes api request for distance
        let name = this.name;
        setTimeout(()=>{
            let address = student.address;
            let dest = this.location;
            var request = {
                origin: address.replace(/ /g, "+"),
                destination: dest.replace(/ /g, "+"),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                let num;
                if (status == google.maps.DirectionsStatus.OK) {
                   num = response.routes[0].legs[0].distance.value // the distance in metres
                } else {
                    num = Infinity;
                    console.log("Error: " + status);
                }
                student.distances.push({
                    "cohort": name,
                    "distance": num // the distance in metres
                });
                // $("body").append(JSON.stringify(student));
                timer.update();
            });
        }, delay);
    }

    scoreStudents() {
        //trying not to flood the api!
        if(!useStudentJSON){
            let delay = 0; //millisecond delay
            let timer = new Timer(Student.all.length, this.name);
            for (let student of Student.all) {
                this.scoreStudent(student);
                this.distStudent(student, delay, timer);
                delay += secDelay*1000;
            }
        }else{
            for (let student of Student.all) {
                this.scoreStudent(student);
            }
        }
    }

    popLowest() {
        //removes lowest scored student from class
        //sorts then pops
        this.class.sort((a, b) => a.score - b.score);
        let student = this.class.pop();
        delete student.cohort;
    }

    add_student(student) {
        //adds student object to class (no limit)
        //also adds cohort to student!
        this.class.push(student);
        student.cohort = this.name; //take into account when pop
    }

    remove_student(student){
        delete student.cohort;
        return this.class.splice(this.class.findIndex(x=>x==student),1);
    }

    fullcheck() {
        // returns true if class full
        return this.class >= this.capacity;
    }

}

addStudentDownload = function(){
    let url = makeTextFile(JSON.stringify(Student.all));
    $("body").append($("<a />", {
        href: url,
        text: "Download",
        download: "students.json"
    }));
}

Cohort.find_by_name = function (name) {
    return Cohort.all.find(x => x.name == name);
}

Cohort.fullScore = function () {
    let length = Student.all.length;
    if(!useStudentJSON){
        console.log("Estimated total time "+ Math.round(secDelay*Student.all.length*Cohort.all.length/60, 2) + " minute(s)");
    }
    
    let delay = 0;
    if(!useStudentJSON){  //JSON Saved students already scored
        for (let cohort of Cohort.all) {
            setTimeout(function(){
                cohort.scoreStudents();
            },delay);
            delay += secDelay*1000*length;
        }
    }
}


class Student extends _base {

    constructor(params) {
        super(params);
        this.scores = this.scores || [];
        this.distances = this.distances || [];
    }
    get techScore() {
        if (this._ts !== undefined) {
            return this._ts;
        } else {
            //specifically finds anything with a "q" followed by a number
            let re = new RegExp('q[0-9]+');
            return this._ts = Object.getOwnPropertyNames(this).filter(x => x.match(re)).reduce((sum, val) => sum + Number(this[val]), 0);
        }
    }

    //needed in order to reassign getter
    set techScore(param) {
        delete this.techScore;
    }

    get stats() {
        if (this._s !== undefined) {
            return this._s;
        } else {
            //traverses question links to get final stats (shouldn't change)
            //questions taken in order (starts with s + ##)
            // let re = new RegExp("s[0-9]+");
            // let total = Object.keys(this).filter(key=>re.test(this[key])).length;
            let q = Question.first();
            let i = 1;
            // for (let i = 1; i<total; i++){
            while (q) {
                let result = q.outcome(this[`s${i}`]);
                if (!this._s) {
                    this._s = {};
                }

                for (let w of Object.keys(result)) {
                    let k = result[w];
                    if (!this._s[w]) {
                        this._s[w] = 0;
                    }
                    this._s[w] += k;
                }

                q = Question.next(q, this[`s${i}`]);
                i++;
            }
            return this._s;
        }

    }

    //needed in order to reassign getter
    set stats(params) {
    }

    //sorts list of cohorts by lowest priority
    selfSort() {
        this.scores = this.scores.sort((a, b) => a.score - b.score);
    }
}

Student.fullSort = function () {
    Student.all.forEach(x => x.selfSort());
}

Student.createFromJSON = function (json_obj) {
    // let self = this;
    for (let i of json_obj) {
        new this(i);
    }
}

class Statistic{
    //responsible for handling the stats for cohorts
    constructor(){
        this.cohorts = Cohort.all;
        this.students = Student.all;
        this.s_stats = {}; //will contain stats for all students
        this.c_stats = {}; //will contain all cohort specific stats by cohort name
        this.student_stats(); //must establish first
    }
    
    student_stats(){
        //calculates metadata on all students
        this.s_stats = this.calc_stats(this.students);   
    }
    
    cohort_stats(){
        for(let cohort of this.cohorts){
            this.c_stats[cohort.name]=this.calc_stats(cohort);
        }
        return this.c_stats;
    }

    calc_stats(obj){
        //returns JSON of stats for given cohort object or Array of students
        let output = {};    
        let focus = obj;//Assumed array of student object
        if(!obj instanceof Cohort && Array.isArray(obj)){
            throw new Error(`Something went wrong! Input was not an Array or Cohort object, but was: ${obj.constructor.name}`);

        }else if (obj instanceof Cohort){
            focus = obj.class;
        }
        //Prop. of race
        output["ethnicity"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.ethnicity)) //average
        }

        //Prop. of gpa & stdDev
        let gpa_avg = avgArray(focus.map(x=>Number(x.gpa)));
        let gpa_sd = stdDevArray(focus.map(x=>Number(x.gpa)));
        output["gpa"] = {
            "avg" : gpa_avg,
            "sd" : gpa_sd
        }
        //Prop. of CS experience
        output["prev_cs"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.prev_cs))
        }
        //Prop. of grades
        output["grade"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.grade))
        }
        //Prop. of school_type
        output["school_type"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.school_type))
        }
        return output;
    }
    
    unique_array_counts(arr){
        //returns object of counts for array of strings
        let output = {};
        arr.forEach(x=>output[x] = !!output[x] ? output[x]+1 : 1);
        return output;
    }

    unique_array_prop(arr){
        //return object of proportions for each string
        let output = {};
        let counts = this.unique_array_counts(arr);
        let sum = 0;
        for (let x of Object.keys(counts)){
            sum += counts[x];
        }
        for (let x of Object.keys(counts)){
            output[x] = counts[x]/sum;
        }
        return output;
    }

    visualize_stats(){
    //adds demographic breakdown of cohorts with average, and deviation from mean visually to html doc
    // http://www.chartjs.org/samples/latest/
        this.cohort_stats();
        for(let name of Object.keys(this.c_stats)){
            $("body").append(`<h1>Cohort: ${name}</h1>`);
            let c_stat = this.c_stats[name];
            let stats = [
                "ethnicity",
                "school_type",
                "grade",
                "prev_cs"
            ];

            for( let stat of stats){
                $("body").append(`<div class="chart-container" style="position: relative; height:30vh; width:30vw"><canvas id="${name}_${stat}" width:300px height:300px></canvas></div>`);
                makeGraph(`${name}_${stat}`, c_stat[stat].avg);
                // if(stat=="gpa"){
                //     makeBarGraph(`${name}_${stat}`, Cohort.find_by_name(name).class.map(x=>Number(x.gpa)));
                // }else{}
            }

            //listing students
            let add_string=`<ol id=${name}_students>`;
            let c_class = Cohort.find_by_name(name).class;
            for(let student of c_class){
                add_string +=`<li>${student.name}</li>`;
            }
            add_string +=`</ol>`;
            $("body").append(add_string);

        }
    }
}

let makeGraph = function(name, myData){
    let full_labels = Object.keys(myData).sort((a,b)=>myData[b]-myData[a]);
    let full_values = full_labels.map(x=>myData[x]).map(x=>(x*100).toFixed(2));
    let data = {
        datasets: [{
            data: full_values,
            backgroundColor: graph_colors
        }],
        labels: full_labels
    };

    new Chart(name, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            legend:{
                display: false
            }
        }
    });
}

// let makeBarGraph = function(name, myData){
//     console.log(myData);
//     let full_labels = Object.keys(myData).sort((a,b)=>myData[b]-myData[a]);
//     let full_values = full_labels.map(x=>myData[x]).map(x=>(x*100).toFixed(2));
//     let data = {
//         datasets: [{
//             data: full_values,
//             backgroundColor: graph_colors
//         }],
//         labels: full_labels
//     };
    
//     new Chart(name, {
//         type: 'bar',
//         data: data,
//         options: {
//             responsive: true,
//             // legend:{
//             //     display: false
//             // }
//         }
//     });
// }

class Sort {
    //in charge of sorting students appropriatetly

    // will take prorities into account
    // ~20% of non-black or latino
    // average cs experience of +/- 1 student
    // average grade +/- 1 student
    // score on location (logged?) pulled from Google Maps API
    // average school_type +/- 3 students

    constructor() {
        Cohort.fullScore(); //includes location
        Student.fullSort();
        this.cohorts = Cohort.all.map(x=>x); //making copy
        this.students = Student.all.map(x=>x);
        // this.priorities = data.priorities; //NEEDED?
        this.call();
    }

    call() {
        //does sorting algorithm;
        this.fillRosters();

        //creates waitlist
        // this.createWaitlist();
    }


    fillRosters() {
        //fills cohorts based on threshold restricitons and student priorities
        // for any remaining cohorts, waitlists are assessed and filled by student priorities only

        // if not enough student, returns error
        if(!(this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)<this.students.length)){
            throw new Error(`Number of students (${this.students.length}) insufficient to fill cohorts${this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)}`);
        }

        // let priority = 0; //start with first choice and keeps decreasing until cohorts filled.
        // while(this.unfilledCohorts().length>0){
        //     this.fill_roster_by(priority);
        //     priority ++;
        // }


        // PLAN
        // 1) ADD PRIORITY STUDENTS UNTIL BLACK/LATINO quota filled
        // 2) If quota filled, try distance (log(distance)?)
        // 2) If 
    }

    fill_roster_by(num) {
        //priority to first picks
        //first fill classes
        this.students.forEach(student => {
            if (!student.cohort) {
                let cohort = Cohort.find_by_name(student.scores[num].cohort);
                cohort.add_student(student);
            }
        })
        //then wean out lowest scores
        this.cohorts.forEach(cohort => {
            while (cohort.class.length > cohort.capacity) {
                cohort.popLowest();
            }
        })

        // this.removeFromWaitlists();
    }

    createWaitlist() {
        //creates waitlist
        this.waitlist = this.students.filter(s => !s.cohort);
    }

    unfilledCohorts() {
        //returns array of unfilled Cohort objects
        return this.cohorts.filter(x => x.class.length < x.capacity);
    }

    get waitlist() {
        return this.students.filter(s => !!s.cohort);
    }
}



var makeTextFile = function (text) {
    var data = new Blob([text], { type: 'text/plain' });

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};

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

let x;
function setup() {
    noCanvas();

    //loading data into files
    store_file("cohorts.csv",x => Cohort.createFromCSVString(x));
    store_file("questions.json",x => Question.createFromJSON(x));
    //loading students as JSON (from previous load)
    if (useStudentJSON) {
        store_file("students.json",x => Student.createFromJSON(x));
    } else {
        store_file("students.csv",x => Student.createFromCSVString(x));
    }

    //FOR TESTING
    x=new Statistic();
    Cohort.all[0].class=Student.all;

}