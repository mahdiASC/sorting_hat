class Sort {
    //in charge of sorting students appropriatetly

    // will take prorities into account
    // ~20% of non-black or latino
    // average cs experience of +/- 1 student
    // average grade +/- 1 student
    // score on location (logged?) pulled from Google Maps API
    // average school_type +/- 3 students

    constructor(flag) {
        flag = flag || false; //controls whether students need assessment (student.csv is loaded)
        this.cohorts = Cohort.all.map(x=>x); //making copy
        Student.all = Student.all.filter(x=>x.ethnicity!="White"); //filtering out whites
        this.students = Student.all.map(x=>x)

        Student.fullSort();//students have their self scores sorted by best scores first
        this.fillRosters();
    }

    fillRosters() {
        // fills cohorts based on threshold restricitons and student priorities
        // for any remaining cohorts, waitlists are assessed and filled by student priorities only

        // if not enough student, returns error
        if(!(this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)<this.students.length)){
            throw new Error(`Number of students (${this.students.length}) insufficient to fill cohorts${this.cohorts.reduce((sum,val)=>sum+Number(val.capacity),0)}`);
        }

        // loops down the priority list diminishing each successive round until only 
        let temp_list = priority_list.map(x=>x);

        while(temp_list.length>0){
            //for each priority in priority_list, will cycle through each priority's .call()
            temp_list.forEach(x=>x.call_func());
            temp_list.pop();
        }
    }

    unfilledCohorts() {
        //returns array of unfilled Cohort objects
        return this.cohorts.filter(x => x.class.length < x.capacity);
    }

    get waitlist() {
        return this.students.filter(s => !s.cohort);
    }

}
