class FileLoader {
    constructor(flag) {
        this.wantDownloads = flag;
    }

    loadout() {
        let standardErrorHandler = function (str) {
            throw new Error(str);
        }

        this.loadAllFiles().then(this.checkStudents).catch(standardErrorHandler).then(this.startSort).catch(standardErrorHandler);
    }

    loadAllFiles() {
        //loads all files and populates the Cohort, Student, and Questions classes
        return new Promise((resolve, reject) => {
            let file_ids = [
                "cohort_file",
                "question_file",
                "student_file"
            ]

            let urls = [
                "./data/cohorts.json",
                "./data/questions.json",
                "./data/students.json"
            ];

            let mainLoad = function (loop) {
                let index = loop.iteration();
                let file = document.getElementById(file_ids[index]).files[0];

                if (file) {
                    //path of loading user's file
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        if (file_ids[index] == "student_file") {
                            let j_re = new RegExp(".json");
                            let c_re = new RegExp(".csv");
                            if (j_re.exec(file.name)) {
                                Student.createFromJSON(JSON.parse(reader.result)).then(loop.next);
                            } else if (c_re.exec(file.name)) {
                                Student.createFromCSVString(reader.result).then(loop.next);
                            } else {
                                reject(`File error! ${file} was not read properly.`);
                            }
                        } else if (file_ids[index] == "question_file") {
                            Question.createFromJSONPromise(JSON.parse(reader.result)).then(loop.next);
                        } else if (file_ids[index] == "cohort_file") {
                            let j_re = new RegExp(".json");
                            let c_re = new RegExp(".csv");
                            if (j_re.exec(file.name)) {
                                Cohort.createFromJSON(JSON.parse(reader.result)).then(loop.next);
                            } else if (c_re.exec(file.name)) {
                                Cohort.createFromCSVString(reader.result).then(loop.next);
                            } else {
                                reject(`File error! ${file} was not read properly.`);
                            }
                        } else {
                            throw new Error("File error!");
                        }
                    }
                    reader.readAsText(file);
                } else {
                    //path of loading default file
                    if (file_ids[index] == "student_file") {
                        store_file(urls[index], x => Student.createFromJSON(x).then(loop.next));
                    } else if (file_ids[index] == "question_file") {
                        store_file(urls[index], x => Question.createFromJSONPromise(x).then(loop.next));
                    } else if (file_ids[index] == "cohort_file") {
                        store_file(urls[index], x => Cohort.createFromJSON(x).then(loop.next));
                    } else {
                        throw new Error("File error!");
                    }
                }
            }

            let completed = function () {
                $("#page-wrapper").hide();
                $(".mainContainer").show();
                resolve();
            }

            asyncLoop(file_ids.length, mainLoad, completed);
        })
    }

    checkStudents() {
        //checks if students are missing .scores and .durations and fills in accordingly
        return new Promise((resolve, reject) => {
            //if cohorts are already filled, no need to look at students
            if (Cohort.all.some(x => x.class.length < x.capacity)) {

                let i, k;
                //missing scores
                if (Student.all.some(x => x.scores.length == 0)) {
                    let missing_scores = Student.all.filter(x => x.scores.length < Cohort.all.length);
                    missing_scores.forEach(x => x.scores = []); //clearing all durations
                    for (i = 0; i < missing_scores.length; i++) {
                        for (k = 0; k < Cohort.all.length; k++) {
                            Cohort.all[k].scoreStudent(missing_scores[i]);
                        }
                    }
                }

                //missing durations (should be done in batches)
                if (Student.all.some(x => x.durations.length == 0)) {
                    let missing_durations = Student.all.filter(x => x.durations.length < Cohort.all.length);
                    missing_durations.forEach(x => x.durations = []); //clearing all durations

                    //Timer info
                    let total_secs = secDelay * missing_durations.length / splice_number * Cohort.all.length;
                    let minutes = Math.floor(total_secs / 60, 2);
                    let seconds = Math.round(total_secs - minutes * 60, 2);
                    console.log("Estimated total time " + minutes + " minute(s) " + seconds + " second(s)");

                    let mainLoad = function (loop) {
                        //loop = looping object for async for loop
                        let index = loop.iteration();
                        let cohort = Cohort.all[index];
                        cohort.assignStudentDur(missing_durations).then(loop.next);
                    }

                    asyncLoop(Cohort.all.length, mainLoad, resolve);
                } else {
                    // all student have all data loaded
                    resolve();
                }
            } else {
                //all cohorts are filled
                resolve();
            }
        })
    }

    startSort() {
        // showcasing randomly generated students and cohorts - OMIT!
        let dummy = new DummyData;
        dummy.randCohorts();
        dummy.randStudents();

        //actually begins sorting
        new Sort; //NOTE: a bit unnecessary if cohorts are already filled

        let x = new Validate() // prevents duplicates
        x.main();

        let stats = new Statistic;
        stats.visualize_stats();
        if (wantDownloads) {
            makeTextFile("students.json", JSON.stringify(Student.all));
            makeTextFile("cohorts.json", JSON.stringify(Cohort.all));
        }
    }
}