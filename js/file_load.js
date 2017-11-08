$("div.fileUpload").each(function (x) {
    let main = $(this);
    let text = $(main.find(".file_text"));
    let input = $(main.find("input"));
    input.change(function () {
        console.log($(this));
        text.text(this.value);
    });
})

let myFunc = function () {

    let file_ids = [
        "cohort_file",
        "question_file",
        "student_file"
    ]

    let urls = [
        "./data/cohorts.csv",
        "./data/questions.json",
        "./data/students.csv",
        "./data/students.json"
    ];

    for (let i = 0; i < file_ids.length; i++) {
        let file = document.getElementById(file_ids[i]).files[0];
        if (file) {
            //path of loading user's file
            let reader = new FileReader();
            reader.onload = function (e) {
                if (file_ids[i] == "student_file") {
                    let j_re = new RegExp(".json");
                    let c_re = new RegExp(".csv");
                    if (j_re.exec(file.name)) {
                        Student.createFromJSON(JSON.parse(reader.result));
                    } else if (c_re.exec(file.name)) {
                        Student.createFromCSVString(reader.result);
                    } else {
                        throw new Error("File error!");
                    }
                } else if (file_ids[i] == "question_file") {
                    Question.createFromJSON(JSON.parse(reader.result));
                } else if (file_ids[i] == "cohort_file") {
                    Cohort.createFromCSVString(reader.result);
                } else {
                    throw new Error("File error!");
                }
            }
            reader.readAsText(file);
        } else {
            //path of loading default file
            if (file_ids[i] == "student_file") {
                let url;
                if (useStudentJSON) {
                    url = urls[i + 1];
                    store_file(url, x => Student.createFromJSON(x));
                } else {
                    url = urls[i];
                    store_file(url, x => Student.createFromCSVString(x));
                }
            } else if (file_ids[i] == "question_file") {
                store_file(urls[i], x => Question.createFromJSON(x));
            } else if (file_ids[i] == "cohort_file") {
                store_file(urls[i], x => Cohort.createFromCSVString(x));
            } else {
                throw new Error("File error!");
            }
        }
    }

    $("#page-wrapper").hide();
    $(".mainContainer").show();
    startSort();
}