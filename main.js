//To do for full game
// Setup static website
// using p5.js and p5.dom.js
// play game
// store data until game done
// update datasheet

// To Do for sorting
// Configure Questions data structure (linked list)
// Give traversing students responsibility to student (should only ever execute once - otherwise delete - stored in property w/object?)


// The sorting hat questions and application questions are abutted
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
    //linked list style
    
}

Question.createFromJSON = function(obj){
    console.log(obj);
    let output = [];
    if(obj["id"]){
        for(let i of Object.keys(obj)){
            
        }
    }else{
    }

    if(output.lengh==1){
        return output[0];
    }

}

function createQ(obj){
    let _q = new this(obj[i]);
    if (_q.answers){
        _q.answers.forEach(que => {
            if(que["sub_q"]){
                que["sub_q"] = this.createFromJSON(que["sub_q"]);
            }
        })
        output.push(_q);
    }
}

class Cohort extends _base{
    scoreStudent(){
        //hidden
    }

    sortStudents(){
        
    }
}

class Student extends _base{
    // class method for loading with csv

    get techScore(){
        //specifically finds anything with a "q" followed by a number
        delete this.techScore;
        let re = new RegExp('q[0-9]+');
        return this.techScore = Object.getOwnPropertyNames(this).filter(x=>x.match(re)).reduce((sum,val)=>sum+Number(this[val]), 0)
    }
    
    //needed in order to reassign getter
    set techScore(param){
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
   Student.createFromCSVString(data["students"]);
   Question.createFromJSON(data["questions"]);

}

