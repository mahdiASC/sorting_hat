//To do for full game
// Setup static website
// using p5.js and p5.dom.js
// play game
// store data until game done
// update datasheet

// To Do for sorting
// create scoring calculation for all students
// sort students
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
        complete: function(results) {
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
        if (!this.class){
            this.class=[];
        }
        this.class.push({
            student: student,
            score: score
        });
        return score;
    }

    sortStudents(){
        this.class = [];
        //limit on class, pop out lower students (can sort all then slice?)
        for(let student of Student.all){
            this.scoreStudent(student);
            // if(this.class.length>this.capacity){
            //     this.popLowest();
            // }
        }
        this.class.sort( (a,b) =>a.score-b.score);
        return this.class;
    }


    popLowest(){
        //removes lowest scored student from class
        //sorts then pops
        this.class.sort( (a,b) =>a.score-b.score);
        this.class.pop();
    }
}


Cohort.fullSort = function(){
    //sorts all student in each cohort
    for(let cohort of Cohort.all){
        cohort.sortStudents();
    }
    
}

class Student extends _base{
    // class method for loading with csv

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
}

class Sort{
    //in charge of sorting students appropriatetly

}

let cohorts, questions, students;
[cohorts, questions, students] = [[],[],[]];

let files = ["cohorts","priorities","students"];
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
    //loading questions as JSON
    $.get({
        url:"questions.json",
        async: false,
        dataType:'json',
        success:x=>data["questions"]=x
    });
   
   Cohort.createFromCSVString(data["cohorts"]);
   
   //eventually want this to pull from Google Spreadsheet
   Student.createFromCSVString(data["students"]);

   Question.createFromJSON(data["questions"]);

}

