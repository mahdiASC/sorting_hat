class Cohort extends _base {
    constructor(params) {
        super();
        this.class = params.class || [];
        this.waitlist = params.waitlist || []; //NOTE: not very useful. Can OMIT
        this.ideal_stats = params.ideal_stats || {};
        this.name = params.name;
        this.capacity = params.capacity;
        this.location = params.location;
        this.img = params.img;
        if (!this.ideal_stats){
            //when loaded from json, won't need to pull from property names
            let statKeys = Object.keys(params).filter(key => !Object.keys(this).includes(key));
            for (let i of statKeys) {
                this.ideal_stats[i] = Number(params[i]);
            }
        }
    }

    setStudentDur(student_arr, timer){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let name = this.name;
                let origin_string = student_arr.map(s=>encodeURIComponent(s.address)).join("|");
                let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin_string}&destinations=${this.location.replace(/ /g, "+")}&key=AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8`
                $.get({
                    url: url,
                    success:data=>{
                        let data_rows = data.rows;
                        for(let i = 0; i <student_arr.length; i++){
                            var num;
                            if(data_rows[i].elements[0].status!="OK"){
                                num = "Infinity";
                                console.log(student_arr[i].address);
                                console.log("Error: "+ data_rows[i].elements[0].status);
                            }else{
                                num =  data_rows[i].elements[0].duration.value;// the diratopm in second
                            }
    
                            student_arr[i].durations.push({
                                "cohort": name,
                                "duration": num
                            });
                        }
                        timer.update(student_arr.length);
                        resolve();
                    }
                })
            }, delay); //1 sec good idea
        })
    }
    
    assignStudentDur(student_arr){
        let timer = new Timer(student_arr.length*Cohort.all.length);
        
        //chopping up input student_arr into 2D array depending on splice
        let tempStudents = [];
        while(student_arr.length>0){
            tempStudents.push(student_arr.splice(0,splice_number));
        }
        
        return new Promise((resolve, reject)=>{

            let mainLoad = function(loop){
                let index = loop.iteration();
                let cohort = Cohort.all[index];
                
                let innerLoad = function(in_loop){
                    let in_index = in_loop.iteration();
                    let students = tempStudents[in_index];
                    cohort.setStudentDur(students, timer).then(()=>{
                        in_loop.next();
                    });
                }

                asyncLoop(tempStudents.length, innerLoad, loop.next);
            }

            asyncLoop(Cohort.all.length, mainLoad, resolve);
        })
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

        //including recommendation affect
        score *= 1 - rec_val;

        //adding cohort to student's list
        student.scores.push({
            "cohort": this.name,
            "score": score
        })
    }

    scoreStudents() {
        for (let student of Student.all) {
           this.scoreStudent(student);
        }
        // this.sortStudentScores();//creating waitlist by score
    }

    // sortStudentScores(){
    //     this.waitlist = Student.all.filter(x=>!x.cohort).sort((a,b)=>{
    //         let fa = a.scores.find(x=>x.cohort==this.name);
    //         let fb = b.scores.find(x=>x.cohort==this.name);
    //         return fa.score-fb.score;
    //     });
    // }

    sortClass(direction = "asc"){
        //reversible sort
        return this.class.sort((a,b)=>{
            let fa = a.scores.find(x=>x.cohort==this.name);
            let fb = b.scores.find(x=>x.cohort==this.name);
            if(direction = "asc"){
                return fa.score-fb.score;
            }else{
                return fb.score-fa.score;
            }
        });
    }

    popLowest(arr) {
        //removes lowest scored student from class
        //sorts then pops
        this.class.sort((a,b)=>{
            let fa = a.scores.find(x=>x.cohort==this.name);
            let fb = b.scores.find(x=>x.cohort==this.name);
            return fa.score-fb.score;
        });
        let student = this.class.pop();
        delete student.cohort;
    }

    add_student(student) {
        //adds student object to class (no limit)
        //also adds cohort to student!
        
        if(Array.isArray(student)){
            student.forEach(x=>this.add_student(x));
        }else if (student instanceof Student){
            if(!this.class.includes(student)){
                this.class.push(student);
                student.cohort = this.name; //take into account when pop
                // this.sortStudentScores();
            }else{
                throw new Error(`Attempted to duplicate student in class: ${student.name}`);
            }
        }else{
            throw new Error(`Input was not a Student object or an array of Student objects: ${student}`);
        }
    }

    remove_student(student){
        if(Array.isArray(student)){
            student.forEach(x=>this.remove_student(x));
        }else if(student instanceof Student){
            if(this.class.indexOf(student)==-1){
                throw new Error(`Student not in ${this.name}'s .class. index was ${this.class.indexOf(student)}`);
            }
    
            delete student.cohort;
            //adding to wait list
            return this.class.splice(this.class.findIndex(x=>x==student),1);
            // this.sortStudentScores();
        }else{
            throw new Error(`Input was not a Student object or an array of Student objects: ${student}`);
        }
    }

    fullcheck() {
        // returns true if class full
        return this.class.length >= this.capacity;
    }

    //for randomly reassinging non-vital parameters
    modifiedWith(params){
        for(let param of Object.keys(params)){
            this[param]= params[param];
        }
        return this;
    }
}

Cohort.find_by_name = function (name) {
    return Cohort.all.find(x => x.name == name);
}

