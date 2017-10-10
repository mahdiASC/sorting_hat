// NOTE: csv need "+" as delimiter

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


// The sorting hat questions and application questions are intermingled
// Would be part of MOU and have host site complete the sorting test as well and use THAT
// as metric for sorting cohort students

// worry about waitlist peeps
class _base{
    //handles basic initialization and ALL storage for each
    //extended class
    constructor(params){
        if (!this.constructor.all){
        this.constructor.all = []
        }
        this.constructor.all.push(this);
        for(let i in params){
            this[i]=params[i];
        }
    }
}

_base.createFromCSVString = function(fileString){
    let self = this;
    return Papa.parse(fileString, {
        delimiter:"+",
        complete: function(results) {
            console.log(results);
            let header = results.data[0];
            for ( let i = 1; i < results.data.length; i++){
                parseObjects.apply(self,[header,results.data[i]]);
            }
        }
    });
}  

const parseObjects = function(header, arr){
    let output = {};
    for ( let x in header){
        output[header[x]]=arr[x];
    }
    new this(output);
}

_base.createFromJSON = function(json_obj){
    // let self = this;
    for(let i of json_obj){
        new this(i);
    }
}  

class Question extends _base{

    outcome(choice){
        return this.answers.find(c=>c.text==choice).outcome;
    }
}

Question.first = () => {
    return Question.all.find(x=> Number(x.id)==1);
};

Question.next = (q,choice) => {
    //accepts arguments of a Question object
    //returns the next logical Question object by traversing linkage backwards
    //handles sub_q
    let found = q.answers.find(x=>x.text == choice);
    if(Object.keys(found).some(key=>key=="sub_q")){
        return found.sub_q;
    }else{
        //backtrack 
        let root = Question.rootq(q);
        if (!root){
            return undefined;
        }
        return Question.find(Number(root.id)+1);
    }
}

Question.rootq = q => {
    //finds root question (with an id) of input Question object
    let output = q.parent
    if(!output){
        return undefined;
    }
    let attempt = output.parent;
    while(attempt!==undefined){
        output = attempt;
        attempt = attempt.parent;
    }
    return output;
}

Question.find = num => {
    //find question with id == num
    return Question.all.find(q=>Number(q.id) == num);
}

Question.createFromJSON = function(obj){
    //linked list styled questions
    //recursively creates questions w/subquestions
    if(obj["text"]){
        //single question
        let q = new this(obj);
        
        q.answers.forEach(a =>{
            if(a.sub_q){
                a.sub_q = Question.createFromJSON(a.sub_q);
                a.sub_q.parent = q;
            } 
        });
        return q;
    }else{
        //multiple questions
        for(let i of Object.keys(obj)){
            Question.createFromJSON(obj[i]);
        }
    }
}


class Cohort extends _base{
    constructor(params){
        super();
        this.class = [];
        this.waitlist = [];
        this.ideal_stats = {};
        this.name = params.name;
        this.capacity = params.capacity;
        let statKeys = Object.keys(params).filter(key=>key!="name" && key!="capacity");
        for(let i of statKeys){
            this.ideal_stats[i] = Number(params[i]);
        }
    }

    scoreStudent(student){
        //scores a single student
        // uses total R^2 (ideal candidate has R^2 of 0)
        let score = 0;
        for (let key of Object.keys(this.ideal_stats)){
            if(!student.stats[key]){
                student.stats[key] = 0;
            }
            let diff = Math.abs(student.stats[key] - this.ideal_stats[key]);
            score += Math.pow(diff,2);
        }

        //adding student to cohort's list
        // this.waitlist.push({
        //     student: student,
        //     score: score
        // });

        //adding cohort to student's list
        student.scores.push({
            "cohort":this.name,
            "score":score
        })

        return score;
    }

    scoreStudents(){
        for(let student of Student.all){
            this.scoreStudent(student);
        }
    }
    // sortStudents(){
    //     //limit on class, pop out lower students (can sort all then slice?)
    //     for(let student of Student.all){
    //         this.scoreStudent(student);
    //     }
    //     this.waitlist.sort( (a,b) =>a.score-b.score);
    //     return this.waitlist;
    // }

    popLowest(){
        //removes lowest scored student from class
        //sorts then pops
        this.class.sort( (a,b) =>a.score-b.score);
        let student = this.class.pop();
        delete student.cohort;
    }
    
    add_student(student){
        //adds student object to class (no limit)
        //also adds cohort to student!
        this.class.push(student);
        student.cohort = this.name; //take into account when pop
    }

    fullcheck(){
        // returns true if class full
        return this.class>=this.capacity;
    }
}

Cohort.find_by_name = function(name){
    return Cohort.all.find(x=>x.name == name);
}

// Cohort.fullSort = function(){
//     //sorts all student in each cohort
//     for(let cohort of Cohort.all){
//         cohort.sortStudents();
//     }
// }

Cohort.fullScore = function(){
    for(let cohort of Cohort.all){
        cohort.scoreStudents();
    }
}


class Student extends _base{

    constructor(params){
        super(params);
        this.scores = [];
    }
    get techScore(){
        if (this._ts!==undefined){
            return this._ts;
        }else{
            //specifically finds anything with a "q" followed by a number
            let re = new RegExp('q[0-9]+');
            return this._ts = Object.getOwnPropertyNames(this).filter(x=>x.match(re)).reduce((sum,val)=>sum+Number(this[val]), 0);
        }
    }
    
    //needed in order to reassign getter
    set techScore(param){
        delete this.techScore;
    }

    get stats(){
        if (this._s!==undefined){
            return this._s;
        }else{
            //traverses question links to get final stats (shouldn't change)
            //questions taken in order (starts with s + ##)
            // let re = new RegExp("s[0-9]+");
            // let total = Object.keys(this).filter(key=>re.test(this[key])).length;
            let q = Question.first();
            let i = 1;
            // for (let i = 1; i<total; i++){
            while(q){
                let result = q.outcome(this[`s${i}`]);
                if (!this._s){
                    this._s = {};
                }
                
                for(let w of Object.keys(result)){
                    let k = result[w];
                    if(!this._s[w]){
                        this._s[w] = 0;
                    }
                    this._s[w] += k;
                }
                
                q = Question.next(q,this[`s${i}`]);
                i++;
            }
            return this._s;
        }

    }

    //needed in order to reassign getter
    set stats(params){
    }

    //sorts list of cohorts by lowest priority
    selfSort(){
        this.scores = this.scores.sort( (a,b) =>a.score-b.score);
    }
}

Student.fullSort = function(){
    Student.all.forEach(x=>x.selfSort());
}

class Sort{
    //in charge of sorting students appropriatetly

    // will take prorities into account
    // ~20% of non-black or latino
    // average cs experience of +/- 1 student
    // average grade +/- 1 student
    // score on location (logged?) pulled from Google Maps API
    // average school_type +/- 3 students

    constructor(){
        Cohort.fullScore();
        Student.fullSort();
        this.cohorts = Cohort.all;
        this.students = Student.all;
        this.priorities = data.priorities;
        this.priorityList = this.students.sort((a,b)=>a.score-b.score);
    }

    call(){
        //does sorting algorithm;
        this.fillRosters();

        //creates waitlist
        this.createWaitlist();
    }


    fillRosters(){
    	//fills cohorts based on threshold restricitons and student priorities
    	// for any remaining cohorts, waitlists are assessed and filled by student priorities only
        // if(!(this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)<this.students.length)){
        //     throw new Error(`Number of students (${this.students.length}) insufficient to fill cohorts${this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)}`);
        // }

        // let priority = 0; //start with first choice and keeps decreasing until cohorts filled.
        // while(this.unfilledCohorts().length>0){
        //     this.fill_roster_by(priority);
        //     priority ++;
        // }
    }

    fill_roster_by(num){
        //priority to first picks
        //first fill classes
        this.students.forEach(student=>{
            if (!student.cohort){
                let cohort = Cohort.find_by_name(student.scores[num].cohort);
                cohort.add_student(student);
            }
        })
        //then wean out lowest scores
        this.cohorts.forEach(cohort=>{
            while(cohort.class.length>cohort.capacity){
                cohort.popLowest();
            }
        })

        // this.removeFromWaitlists();
    }

	createWaitlist(){
        //creates waitlist
        this.waitlist = this.students.filter(s=>!s.cohort);
    }

    unfilledCohorts(){
        //returns array of unfilled Cohort objects
        return this.cohorts.filter(x=>x.class.length<x.capacity);
    }

    get waitlist(){
        return this.students.filter(s=>!!s.cohort);
    }
}

let cohorts, questions, students;
[cohorts, questions, students] = [[],[],[]];
// DO I STILL NEED THIS?

let files = [];
files.push("cohorts");
files.push("priorities");

let data = {};

function setup(){
    noCanvas();
    //loading cohorts, priorities, and students
    for(let file of files){
        $.get({
            url:file+".csv",
            async: false,
            dataType:'text',
            success:x=>data[file]=x
        });
    }

    // not elegant solution
    files.push("students");

    //loading questions as JSON
    $.get({
        url:"questions.json",
        async: false,
        dataType:'json',
        success:x=>data["questions"]=x
    });
   
    //loading students as JSON (from previous load)
    if(!files.includes("students")){
        // console.log("Make sure to run this from node.js first!");
        $.get({
            url:"students.json",
            async: false,
            dataType:'json',
            success:x=>Student.createFromJSON(x)
        });
    }else{
        $.get({
            url:"students.csv",
            async: false,
            dataType:'text',
            success:x=>Student.createFromCSVString(x)
        });
    }
        
   //eventually want this to pull from Google Spreadsheet
   //No go - spreadsheet would need to be public
   

//    If any student is missing distance
    // if(Student.any(x=>!x.distance)){
    //     // add distances and save new csv
    //     // Student.add_distances();
    //     saveCSV(Student.all);
    //     throw new Error("Make sure to include distances! Run the 'set_locations.js' script in node.js");
    // }
    Cohort.createFromCSVString(data["cohorts"]);
    Question.createFromJSON(data["questions"]);
}

