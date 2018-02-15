class Cohort extends _base {
    constructor(params){
        super(params);
    }

    setStudentDistance(students){
        // takes array of students and assigns proper timed distance from cohort
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let name = this.name;
                let origin_string = students.map(s=>encodeURIComponent(`${s.state} ${s.zip}`)).join("|");
                let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin_string}&destinations=${this.location.replace(/ /g, "+")}&key=${api_key}`
                $.get({
                    url: url,
                    success:data=>{
                        let data_rows = data.rows;
                        for(let i = 0; i <students.length; i++){
                            var num;
                            if(data_rows[i].elements[0].status!="OK"){
                                num = "Infinity";
                                console.log("Error: "+ data_rows[i].elements[0].status);
                            }else{
                                num =  data_rows[i].elements[0].duration.value;// the diratopm in second
                            }
    
                            students[i].travel_times.push({
                                "cohort": name,
                                "time": num
                            });
                        }
                        resolve();
                    }
                }).fail(err=>console.log(err));
            }, secDelay);
        })
    }

    setStudentPool(students){
        // given array of students, adds students to pool when within range (has a range in student.travel_times)
        this.pool = students.filter(x=>x.travel_times.some(y=>y.cohort===this.name));
        keepValids();
    }

    setStudentCohortScores(){

    }

    keepValids(){
        // filters pool for students that are assigned this cohort or have no cohort
        this.pool = this.pool.filter(x=>!x.cohort||x.cohort==this.name);
    }

    get class(){
        // returns students in the class from sorted pool of all elegable students
        keepValids();
        return this.pool.slice(0,21);
    }
    
    get waitlist(){
        // returns students in the class from sorted pool of all elegable students
        keepValids();
        return this.pool.slice(22);
    }
}

Cohort.setPools = function(students){
    Cohort.all.forEach(function(x){return x.setStudentPool(students)});
}
