class Sort {
    //in charge of sorting students appropriatetly

    // will take prorities into account
    // ~20% of non-black or latino
    // average cs experience of +/- 1 student
    // average grade +/- 1 student
    // score on location (logged?) pulled from Google Maps API
    // average school_type +/- 3 students

    constructor() {
        this.cohorts = Cohort.all.map(x=>x); //making copy
        this.students = Student.all.map(x=>x);
        if(!useStudentJSON){
            Cohort.assessStudents();
        }
        Student.fullSort();
    }

    fillRosters() {
        //fills cohorts based on threshold restricitons and student priorities
        // for any remaining cohorts, waitlists are assessed and filled by student priorities only

        // if not enough student, returns error
        if(!(this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)<this.students.length)){
            throw new Error(`Number of students (${this.students.length}) insufficient to fill cohorts${this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)}`);
        }

        
        let priority_indx = 0;
        let indx_reset = priority_list.length;
        
        //filling out cohorts first by score
        //loops down the priority list diminishing each successive round until only 
        while(indx_reset>0){
            this.cohorts.forEach(x=>priority_list[priority_indx].call(x));
            priority_indx ++;
            if(priority_indx >= indx_reset){
                priority_indx = 0;
                indx_reset --;
            }
        }
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
