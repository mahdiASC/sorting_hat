class Priority{
    constructor(str, func){
        this.priority=str;
        if (!this.constructor.all) {
            this.constructor.all = []
        }
        this.constructor.all.push(this);
        this.call_func=()=>{
            console.log(`Sorting by ${capFirst(this.priority)}...`);
            return func.bind(this)();
        };
    }

    unfilled_cohorts(){
        return Cohort.all.filter(x=>!x.fullcheck());
    }
    
    waiting_students(){
        return Student.all.filter(x=>!x.cohort);
    }
}

Priority.find_by_name = function(str){
    return Priority.all.find(x=>x.priority==str);
}

new Priority(
    "score",
    function(){
        let unfilled_cohorts = this.unfilled_cohorts();
        if (unfilled_cohorts.length==0){
            return;
        }
        
        this.waiting_students().forEach(student=>{
            let counter = 0;
            while(!student.cohort && counter < student.scores.length){
                let cohort_name = student.scores[counter].cohort;
                let cohort = Cohort.find_by_name(cohort_name)
                if (!cohort.fullcheck()){
                    cohort.add_student(student);
                }
                counter++;
            }
        });
        
        //OMIT
        // unfilled_cohorts.forEach(cohort=>{
        //     while(cohort.class.length>cohort.capacity){
        //         cohort.popLowest();
        //     }
        // })
    });

// assess and fill all cohorts with valid student pool
new Priority(
    "ethnicity",
    function(){
        let browns = [
            'African American',
            'African',
            'Caribbean',
            'West Indian',
            'Hispanic/Latino'
        ];

        let calcIdealNumber = function(cohort){
            //returns minimum number of brown students to have at a cohort
            return Math.floor(cohort.capacity*minority_rate-minority_leeway);
        }

        let getBrowns = function(arr,flag=true){
            //return array of brown students from array of students
            if(flag){
                return arr.filter(student=>browns.includes(student.ethnicity));
            }else{
                return arr.filter(student=>!browns.includes(student.ethnicity));
            }
        }

        let add_ideal = function(cohort){
            //adds an ideal candidate from pool of brown students in waiting
            // returns true if adds student
            // cohort.sortStudentScores();//sets waitlist
            cohort.waitlist = Student.waitlist();
            let ideals = getBrowns(cohort.waitlist);
            if(ideals.length>0){
                cohort.add_student(ideals[0]);
                return true;
            }else{
                console.log(`There are not enough students in the waitlist pool to add to ${cohort.name}`);
                return false;
            }
        }

        let remove_non_ideal = function(cohort){
            //if needed, will remove a non-brown student from class
            if(cohort.class.length>=cohort.capacity && !validCohort(cohort)){
                //remove lowest scored non-brown student
                let c_class = getBrowns(cohort.sortClass("desc"),false);
                cohort.remove_student(c_class[0]);
            }
        }

        let validCohort = function(cohort){
            // returns true if cohort has ideal number of browns in class
            return getBrowns(cohort.class).length>=calcIdealNumber(cohort);
        }

        Cohort.all.forEach(cohort=>{
            while(!validCohort(cohort)){
                remove_non_ideal(cohort);
                if(!add_ideal(cohort)){
                    console.log("Breaking!");
                    break;//end loop if students cannot be added
                }
            }
        });
    });

new Priority(
    "duration",
    function(){
        let get_ideals = function(cohort,flag=true){
            // returns students within duration range
            let list;
            
            if(flag){
                list = cohort.waitlist;
            }else{
                list = cohort.class;
            }

            return list.filter(student=>{
                let duration_obj = student.durations.find(x=>x.cohort==cohort.name);

                if(flag){
                    return duration_obj.duration<=max_seconds;

                }else{
                    return duration_obj.duration>max_seconds;
                }
            });            
        }

        let add_ideals = function(cohort){
            //adds an ideal candidates from pool of students in waiting
            // cohort.sortStudentScores();
            cohort.waitlist = Student.waitlist();
            let sorted_ideals = get_ideals(cohort).sort((studentA,studentB)=>{
                let objA = studentA.durations.find(x=>x.cohort==cohort.name); 
                let objB = studentB.durations.find(x=>x.cohort==cohort.name); 
                
                return objA.duration-objB.duration;
            });

            let gap = cohort.capacity - cohort.class.length; //get number missing and only add what's needed
            // only adding enough to fill empty slots;
            cohort.add_student(sorted_ideals.splice(0,gap));
        }

        let remove_non_ideals = function(cohort){
            //removes any students in cohort's class over the threshold
            cohort.remove_student(get_ideals(cohort, false));
        }

        Cohort.all.forEach(cohort=>{
            remove_non_ideals(cohort);
            add_ideals(cohort);
        });
    });

new Priority(
    "grade",
    function(){
        // Must get average across all cohorts (percentage of 11th, assuming 10th is the diff);
        // calc ideal number taking leeway into account
        // remove students up to that point
        // add one student at a time based on highest score to cohort
        let get_10s = function(arr){
            //returns students from arr that are in 11th grade
            return arr.filter(x=>Number(x.grade)==10);
        }

        Cohort.all.forEach(cohort=>{
            let stat =  new Statistic();
    
            // NOTE: priority is on getting 11th graders into pipeline (10ths can always apply next year - also data suggest 11th graders do better in program)
            let perc_10 = stat.s_stats.grade.avg[10];//11th grade avg representation

            let cohort_stat = stat.c_stats[cohort.name].grade.avg[10]; //11th grade rep. of cohort
    
            let ideal_num = Math.round(cohort.capacity*perc_10)-grade_leeway;//this allows for more 11th graders
            
            //sorting class by score in desc order (worst are first)
            let c_class = cohort.sortClass("desc");
            let students_10s=get_10s(cohort.class);
            while(students_10s && students_10s.length>ideal_num && ideal_num > 0){
                cohort.remove_student(students_10s[0]);
                students_10s=get_10s(cohort.class);
            }
        })
    });
