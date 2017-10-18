class Priority{
    constructor(str, func){
        this.priority=str;
        if (!this.constructor.all) {
            this.constructor.all = []
        }
        this.constructor.all.push(this);
        this.call_func=()=>func.bind(this)();
    }

    unfilled_cohorts(){
        return Cohort.all.filter(x=>!x.fullcheck());
    }
    
    waiting_students(){
        return Student.all.filter(x=>!x.cohort);
    }
}

Priority.find_by_name = function(str){
    return Priority.all.find(x=>x.priority=str);
}

new Priority(
    "score",
    function(){
        if(this.counter){
            this.counter++;//each call will go to next priority for student
        }else{
            this.counter = 0;
        }

        let unfilled_cohorts = this.unfilled_cohorts();
        
        this.waiting_students().forEach(student=>{
            let cohort_name = student.scores[this.counter].cohort;
            Cohort.find_by_name(cohort_name).add_student(student);
        });

        unfilled_cohorts.forEach(cohort=>{
            while(cohort.class.length>cohort.capacity){
                cohort.popLowest();
            }
        })

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