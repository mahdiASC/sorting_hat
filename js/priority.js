class Priority{
    constructor(str, func){
        this.priority=str;
        this.call=func
        if (!this.constructor.all) {
            this.constructor.all = []
        }
        this.constructor.all.push(this);
    }
}

Priority.find_by_name = function(str){
    return Priority.all.find(x=>x.priority=str);
}

new Priority(
    "score",
    cohort=>{
        let indx = 0;
        let templist = Student.all.filter(x=>!x.cohort).sort((a,b)=>a.scores[indx].score-b.scores[indx].score);
        console.log(this);
        while(!cohort.fullcheck() || indx >= Cohort.all.length){
            templist.forEach(x=>{
                cohort.add_student(x);
            });
            
            indx++;
            templist = Student.all.filter(x=>!x.cohort).sort((a,b)=>a.scores[indx].score-b.scores[indx].score);
        }

        while(cohort.class.length>cohort.capacity){
            cohort.popLowest();
        }
    });

new Priority(
    "ethnicity",
    cohort=>{

    });

new Priority(
    "distance",
    cohort=>{

    });

new Priority(
    "grade",
    cohort=>{

    });

new Priority(
    "school_type",
    cohort=>{

    });
    
new Priority(
    "prev_cs",
    cohort=>{

    });