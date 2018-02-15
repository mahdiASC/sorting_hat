class Sort {
    constructor() {
        // load student data from files or default
        // create student and cohort objects
        // filter out invalids
        // use API to create distance map for each student
        // filter students who are not within range of any cohort (keep starred students)
        // create statistics of valid application pool
        // sort students into cohorts according to priority logic

        // ghetto way to not make API calls while testing
        // OMIT!
        let hack = () => {
            // circumvents API using JSON of applicants for students pre-assessed
            return new Promise((resolve, reject) => {
                $.get({
                    url: "data/students.json",
                    dataType: "json",

                    complete: data => {
                        let applicants = JSON.parse(data.responseText);
                        this.applicants = applicants.map(x => new Student(x));
                        resolve();
                    }
                })
            })
        }

        //NOTE: when using .then() with Promise and referring to "this", put the method call in a function! otherwise the object the method is being called from is undefined!
        this.loadFiles()

        // hack()
            // .then(() => this.loadDefaultData(cohort_data))
            .then(() => this.filterOutInvalids(), msg => { throw new Error(msg) })
            // .then(()=>this.addDistances()) // remove with hack()
            // .then(() => this.filterOutDistant())
            .then(() => this.filterDups())
            .then(()=>this.keepStars()) // error prone (i.e. student without email)
            .then(() => this.displayStudents())
        // .then(()=>this.createStats())
        // .then(()=>this.sort());

        // visualize cohorts
        // this.visualize();
    }

    loadFiles() {
        return new Promise((resolve, reject) => {
            let file = document.getElementById("student_file_1").files[0];

            if (file) {
                //custom file loaded
                //check for correct file extension
                let re = new RegExp(".tsv");
                let re2 = new RegExp(".csv");

                if (re.exec(file.name)) {
                    this.loadNewData(file).then(resolve);
                }else if (re2.exec(file.name)){
                    this.loadDefaultData(file,true).then(resolve);
                }else {
                    reject(`File "${file.name}" is not a TSV or CSV`);
                }
            } else {
                // loading defaults
                this.loadDefaultData(student_data[0]).then(()=>this.loadDefaultData(student_data[1])).then(resolve);
            }

            // added 2nd file for our unique A/B testing style
            let file_2 = document.getElementById("student_file_2").files[0];

            if (file_2) {
                //custom file loaded
                //check for correct file extension
                let re = new RegExp(".tsv");
                let re2 = new RegExp(".csv");

                if (re.exec(file.name)) {
                    this.loadNewData(file).then(resolve);
                }else if (re2.exec(file.name)){
                    this.loadDefaultData(file,true).then(resolve);
                }else {
                    reject(`File "${file.name}" is not a TSV or CSV`);
                }            }
        })
    }

    loadDefaultData(file,flag=true) {
        return new Promise((resolve, reject) => {
            // file is a string of file location
            let delim = "	";
            if(flag){
                delim = ",";
            }
            $.ajax({
                url: file,
                success: (data) => {
                    Papa.parse(data, {
                        delimiter: delim,
                        complete: (data) => {
                            // result is an array of each row of the spreadsheet
                            let result = data.data;
                            const header = result.shift(); // first row is header
                            if (student_data.includes(file)) {
                                result.shift(); // survey monkey has extra row for data typing
                                Student.createFrom2DArray(result, header, student_properties);
                            } else if (file === cohort_data) {
                                Cohort.createFrom2DArray(result, header, cohort_properties);
                            } else {
                                reject("Wrong file entered!");
                            }
                            resolve();
                        }
                    })
                }
            })
        })
    }

    loadNewData(file) {
        // file is a File or Blob object
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function (e) {
                Student.createFromCSVString(reader.result).then(resolve);
            }
            reader.readAsText(file);
        });
    }

    filterOutInvalids() {
        //removes invalid students for the SI
        //female, wrong grade, whites, blanks, while keeping starred
        // fix for multiple selection of secondary race
        return new Promise((resolve, reject) => {
            this.applicants = Student.all.filter(x => {

                if (x.name.trim() === "") {
                    x.rejection_messages.push(`Was nameless`);
                }

                if (!(x.gender === "Male" || x.gender === "Prefer to self-describe (elaborate here)")) {
                    x.rejection_messages.push(`Was not a male or self-described: ${x.gender}`);
                }

                if (x.grade !== "10th" && x.grade !== "11th") {
                    x.rejection_messages.push(`Was not in 10th or 11th grade: ${x.grade}`);
                }

                if (!(x.race_primary !== "Neither" || !(x.race_primary === "Neither" && x.race_secondary.includes("White") && x.race_secondary.length === 1))) {
                    x.rejection_messages.push(`Was white`);
                }

                if (!(x.essay_raw && x.logic_1 && x.logic_2 && x.logic_3 && x.logic_4)) {
                    x.rejection_messages.push(`Was missing essay and/or logic answers`);
                }

                if (!(x.zip && x.state)) {
                    x.rejection_messages.push(`Did not have a zip code and/or state`);
                }

                if (!x.email) {
                    x.rejection_messages.push(`Did not have an email`);
                }

                return x.rejection_messages.length < 1;
            })

            resolve();
        });
    }

    addDistances() {
        // adds distances to each applicant
        return new Promise((resolve, reject) => {
            // for each cohort, go through all students and add proper distance to student

            //chopping up applicants into 2D array depending on splice
            let tempStudents = [];
            let student_arr = this.applicants.map(x => x); //duplicating for spice
            while (student_arr.length > 0) {
                tempStudents.push(student_arr.splice(0, splice_number));
            }


            let mainLoad = function (loop) {
                let index = loop.iteration();
                let cohort = Cohort.all[index];
                console.log(`Finishing ${cohort.name} now...`);
                let innerLoad = function (in_loop) {
                    let in_index = in_loop.iteration();
                    let students = tempStudents[in_index];
                    cohort.setStudentDistance(students).then(() => {
                        in_loop.next();
                    });
                }
                asyncLoop(tempStudents.length, innerLoad, loop.next);
            }
            asyncLoop(Cohort.all.length, mainLoad, resolve);
        });
    }

    keepStars(){
        // keeping "stars"
        Student.all.forEach(val=>{
            if(!this.applicants.includes(val)&&val.star=="TRUE"){
                this.applicants.push(val);
            }
        })
    }

    filterOutDistant() {
        // remove students too far from a cohort, while keeping starred
        return new Promise((resolve, reject) => {
            this.applicants = this.applicants.map(y => {
                y.travel_times = y.travel_times.filter(x => x.time <= max_seconds);
                return y;
            }).filter(x => {
                if (x.travel_times.length < 1) {
                    x.rejection_messages.push(`Did not live close enough to any cohort. Zip code and state might be incorrect. ZIP:${x.zip} STATE:${x.state}`);
                }
                return x.rejection_messages.length < 1;
            });
            resolve();
        });
    }

    createStats() {
        // creates relevant statistics (score automatic)
        // if a string, categorical stats
        // if a number, average
        this.stats = {};
        for (let stat of Object.keys(student_stats)) {
            if (student_stats[stat] == "string") {
                //string data
                this.stats[stat] = this.stringStats(stat);
            } else {
                //number (gpa)
                this.stats[stat] = this.numberStats(stat);
            }
        }
    }

    stringStats(stat) {
        // takes a string of a stat and returns an object with relevant categorical stats
        return unique_array_prop(this.applicants.map(x => x[stat]));
    }

    numberStats(stat) {
        // takes a string of a stat and returns an object with relevant average stat
        return avgArray(this.applicants.map(x => Number(x[stat])));
    }

    filterDups() {
        // check first and last name duplication
        let uniques = [];

        let allnames = this.applicants.map(x => x.name);
        let dup_names = [];

        allnames.forEach((el, i) => {
            if (allnames.indexOf(el, allnames.indexOf(el) + 1) !== -1) {
                // duplicate found!
                if (!dup_names.includes(el)) {
                    dup_names.push(el);
                }
            } else if (!dup_names.includes(el)) {
                // unique and not a duplicate
                uniques.push(this.applicants[i])
            }
        });

        for (let name of dup_names) {
            let students = this.applicants.filter(x => x.name === name);
            uniques.push(this.get_best_student(students, "name"));
        }

        // reset
        this.applicants = uniques;

        uniques = [];
        // check email 
        let allemails = this.applicants.map(x => {
            return x.email.toLowerCase();
        });
        let dup_emails = [];

        allemails.forEach((el, i) => {
            if (allemails.indexOf(el, allemails.indexOf(el) + 1) !== -1) {
                // duplicate found!
                if (!dup_emails.includes(el)) {
                    dup_emails.push(el);
                }
            } else if (!dup_emails.includes(el)) {
                // unique and not a duplicate
                uniques.push(this.applicants[i]);
            }
        });

        for (let email of dup_emails) {
            let students = this.applicants.filter(x => x.email.toLowerCase() === email);
            uniques.push(this.get_best_student(students,"email"));
        }

        this.applicants = uniques;
    }

    get_best_student(students, err) {
        // returns student with most information filled out (or last of which in case of ties)
        // accepts error message
        let score = 0;
        let best_student;
        for (let student of students) {
            let student_score = Object.values(student).filter(x => !!x).length;
            if (student_score >= score) {
                score = student_score;
                best_student = student;
            }
        }
        
        // setting error message
        students.forEach(student=>{
            if(student !== best_student){
                student.rejection_messages.push("Suspected Duplicate based on "+err);
            }
        });
        
        return best_student;
    }

    filterDup(arr) {
        // takes array of students considered as duplicates and returns best one to keep

        let score = {}; //used to assess how "rich" a students information is, first picked if same score

        return arr[0];
    }

    sort() {
        // sorts applicants into proper cohorts accorting to priority list

        // First populate each cohort's student pool with students in distance range not already taken by another cohort
        Cohort.setPools(this.applicants);

        // Sort pool based on grade (favoring 11th graders), and then combined score and subtract difference from cohort's ideal (store in distance object)
        // (Cohort should have a "class" and "waitlist" method that returns the top 22 students and below-22 students from pool, respectively)

        // looping 3 times...check cohort class for validity
        //      if school_type proportion invalid (within 1) student correct for school type
        //          filter waitlist into temporary array of students with desired school type and move next valid student to the top of pool
        //          repeat until proportions even
        //      if grade proportion invalid (within 1) student correct for grade
        //          filter waitlist into temporary array of students with desired grade and move next valid student to the top of pool
        //          repeat until proportions even

    }

    cohortValidityCheck(cohort) {
        // returns true of the cohort is valid
        // valid == class school_type proportions for charter school are not more than average for whole applicant pool
        // valid == class grade proportions for 10th graders are not more than average for whole applicant pool (favors 11th graders)


    }

    displayStudents() {
        // hides buttons and displays students in grid for visualization

        // clearing screen
        $("#page-wrapper").empty();

        // getting stats for graphs
        this.graph = new Graph(this.applicants);
        // create graphs of all valid applicants
        
        // create table of valid applicants

        // create table of invalid applicants w/reasons


    }
}// end of Student class

// let x = new Sort();
