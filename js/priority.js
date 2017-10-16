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
    return Priority.all.find(x=>x==this.priority);
}

new Priority(
    "score",
    cohort=>{

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