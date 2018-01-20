class Sort{
    constructor(){
        // load student data from files or default
        // create student and cohort objects
        // filter out invalids
        // use API to create distance map for each student
        // filter students who are not within range of any cohort (keep starred students)

        //NOTE: when using .then() with Promise and referring to "this", put the method call in a function! otherwise the object the method is being called from is undefined!
        // this.loadFiles().then(()=>this.filterOutInvalids()).then(()=>this.addDistances())

        // ghetto way to not make API calls while testing
        // OMIT!
        let hack = ()=>{
            return new Promise((resolve, reject)=>{
                $.get({
                url:"data/students.json",
                    dataType: "json",
                    
                    complete:data=>{
                        let applicants = JSON.parse(data.responseText);
                        this.applicants = applicants.map(x=>new Student(x));
                        resolve();
                    }
                })
            })
        }
        
        hack().then(()=>this.filterOutDistant());

        // create statistics of valid application pool
        // this.createStats();

        // sort students into cohorts according to priority logic
        // this.sort();

        // visualize cohorts
        // this.visualize();
    }
    
    loadFiles(){
        return new Promise((resolve, reject)=>{
            let file = document.getElementById("student_file").files[0];
            
            if(file){
                //custom file loaded
                //check for .tsv
                let re = new RegExp(".tsv");
                if(re.exec(file.name)){
                    this.loadNewData(file).then(resolve);
                }else{
                    throw new TypeError(`File ${file.name} is not a TSV`);
                }
            }else{
                // loading defaults
                this.loadDefaultData(student_data).then(resolve);
            }
        }).then(()=>this.loadDefaultData(cohort_data));
    }

    loadDefaultData(file){
        return new Promise((resolve, reject)=>{
            // file is a string of file location
            $.ajax({
                url:file,
                success:(data)=>{
                    // console.log(data);
                    Papa.parse(data,{
                        delimiter: "	",
                        complete:(data)=>{
                            // result is an array of each row of the spreadsheet
                            let result = data.data;
                            const header = result.shift(); // first row is header
                            if(file === student_data){
                                result.shift(); // survey monkey has extra row for data typing
                                Student.createFrom2DArray(result, header, student_properties);
                            }else if(file === cohort_data){
                                Cohort.createFrom2DArray(result, header, cohort_properties);
                            }else{
                                throw new Error("Wrong file entered!");
                            }
                            resolve();
                        }
                    })
                }
            })
        })
    }

    loadNewData(file){
        // file is a File or Blob object
        return new Promise((resolve, reject)=>{
            let reader = new FileReader();
            reader.onload = function(e){
                Student.createFromCSVString(reader.result).then(resolve);
            }
            reader.readAsText(file);
        });
    }

    filterOutInvalids(){
        //removes invalid students for the SI
        //female, wrong grade, whites, blanks, while keeping starred
        // fix for multiple selection of secondary race
        return new Promise((resolve, reject)=>{
            this.applicants = Student.all.filter(x=>{
                
                if(x.gender === "Male" || x.gender === "Prefer to self-describe (elaborate here)"){
                    x.this.rejection_messages.push(`Was not a male or self-described: ${x.gender}`);
                }

                if(x.grade=="10th"||x.grade=="11th"){
                    x.this.rejection_messages.push(`Was not in 10th or 11th grade: ${x.grade}`);
                }

                if(x.race_primary!=="Neither"||!(x.race_primary==="Neither" && x.race_secondary.includes("White")&&x.race_secondary.length===1)){
                    x.this.rejection_messages.push(`Was white`);
                }

                if(x.essay_raw&&x.logic_1&&x.logic_2&&x.logic_3&&x.logic_4){
                    x.this.rejection_messages.push(`Was missing essay and/or logic answers`);
                }

                if(x.zip && x.state){
                    x.this.rejection_messages.push(`Did not have a zip code and/or state`);
                }

                return x.rejection_messages.length<1;
            })
            resolve();
        });
    }

    
    addDistances(){
        // adds distances to each applicant
        return new Promise((resolve, reject)=>{
            // for each cohort, go through all students and add proper distance to student
            
            //chopping up applicants into 2D array depending on splice
            let tempStudents = [];
            let student_arr = this.applicants.map(x=>x); //duplicating for spice
            while(student_arr.length>0){
                tempStudents.push(student_arr.splice(0,splice_number));
            }
            

            let mainLoad = function(loop){
                let index = loop.iteration();
                let cohort = Cohort.all[index];
                console.log(`Finishing ${cohort.name} now...`);
                let innerLoad = function(in_loop){
                    let in_index = in_loop.iteration();
                    let students = tempStudents[in_index];
                    cohort.setStudentDistance(students).then(()=>{
                        in_loop.next();
                    });
                }

                asyncLoop(tempStudents.length, innerLoad, loop.next);
            }

            asyncLoop(Cohort.all.length, mainLoad, resolve);
        });
    }
    
    filterOutDistant(){
        // remove students too far from a cohort, while keeping starred
        return new Promise((resolve, reject)=>{
            this.applicants = this.applicants.map(y=>{
                y.travel_times = y.travel_times.filter(x=>x.time<=max_seconds);
                return y;
            }).filter(x=>{
                if(x.travel_times.length<1){
                    x.rejection_messages.push(`Did not live close enough to any cohort. Zip code and state might be incorrect. ZIP:${x.zip} STATE:${x.state}`);
                }
                return x.rejection_messages.length<1;                
            });
        });
    }
    createStats(){
        // creates relevant statistics
    }

    sort(){
        // sorts applicants into proper cohorts accorting to priority list
    }

    visualize(){
        // takes assigned students and adds them to sorted list
    }
}

let x = new Sort();