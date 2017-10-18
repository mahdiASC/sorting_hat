class Cohort extends _base {
    constructor(params) {
        super();
        this.class = [];
        this.waitlist = [];
        this.ideal_stats = {};
        this.name = params.name;
        this.capacity = params.capacity;
        this.location = params.location;
        this.img = params.img;
        let statKeys = Object.keys(params).filter(key => !Object.keys(this).includes(key));
        for (let i of statKeys) {
            this.ideal_stats[i] = Number(params[i]);
        }
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
        //adding cohort to student's list
        student.scores.push({
            "cohort": this.name,
            "score": score
        })

        // return score;
    }
    
    newdistStudent(student_arr, delay, timer){

        setTimeout(()=>{
            let name = this.name;
            let origin_string = student_arr.map(s=>encodeURIComponent(s.address)).join("|");
            // let origin_string = student_arr.map(s=>s.address.replace(/ /g, "+")).join("|");
            let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin_string}&destinations=${this.location.replace(/ /g, "+")}&key=AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8`
            $.get({
                url: url,
                // dataType:"jsonp",
                // jsonCallback:data=>console.log(data),
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

                        student_arr[i].distances.push({
                            "cohort": name,
                            "duration": num
                        });
                    }
                    timer.update(student_arr.length);
                }
            })
        }, delay);
    }

    scoreStudents() {
        for (let student of Student.all) {
           this.scoreStudent(student);
        }
        this.sortStudentScores();//creating waitlist by score
    }

    sortStudentScores(){
        this.waitlist = Student.all.filter(x=>!x.cohort).sort((a,b)=>{
            let fa = a.scores.find(x=>x.cohort==this.name);
            let fb = b.scores.find(x=>x.cohort==this.name);
            return fa.score-fb.score;
        });
    }

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

    assignStudentDist(timer, big_delay){
        //trying not to flood the api!
        setTimeout(()=>{
            let delay = 0; //millisecond delay
            let tempStudents = Student.all.map(x=>x);//making clone of array
            let students = tempStudents.splice(0,splice_number);
            while(students.length>0){//problem
                this.newdistStudent(students, delay, timer);
                students = tempStudents.splice(0,splice_number);
                delay += secDelay*1000;
            }
        },big_delay);
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
        this.waitlist.push(student);
        delete student.cohort;
    }

    add_student(student) {
        //adds student object to class (no limit)
        //also adds cohort to student!
        
        if(Array.isArray(student)){
            student.forEach(x=>this.add_student(x));
        }else{
            this.class.push(student);
            student.cohort = this.name; //take into account when pop
            this.sortStudentScores();
        }
    }

    remove_student(student){
        if(Array.isArray(student)){
            student.forEach(x=>this.remove_student(x));
        }else{
            if(this.class.indexOf(student)==-1){
                throw new Error(`Student not in ${this.name}'s .class`);
            }
    
            delete student.cohort;
            //adding to wait list
            return this.class.splice(this.class.findIndex(x=>x==student),1);
            this.sortStudentScores();
        }        
    }

    fullcheck() {
        // returns true if class full
        return this.class >= this.capacity;
    }
}

Cohort.find_by_name = function (name) {
    return Cohort.all.find(x => x.name == name);
}

Cohort.assessStudents = function () {
    //JSON Saved students already scored
    let length = Student.all.length;
    let delay = 0;
    let total_time = secDelay*Student.all.length*Cohort.all.length/splice_number;
    let minutes = Math.floor(total_time/60, 2);
    let seconds = Math.round(total_time - minutes*60,2);

    console.log("Estimated total time "+ minutes + " minute(s) " + seconds + " second(s)")  ;
    let timer = new Timer(Student.all.length*Cohort.all.length);
    for (let cohort of Cohort.all) {
        cohort.scoreStudents();
        cohort.assignStudentDist(timer,delay);
        delay += secDelay*1000*length/splice_number;
    }
}

var makeTextFile = function (text) {
    var data = new Blob([text], { type: 'text/plain' });

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};


