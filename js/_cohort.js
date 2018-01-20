class Cohort extends _base {
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
                })
            }, delay);
        })
    }
}

