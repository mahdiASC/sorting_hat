class Statistic {
    //responsible for handling the stats for cohorts
    constructor() {
        this.cohorts = Cohort.all;
        this.students = Student.all;
        this.s_stats = {}; //will contain stats for all students
        this.c_stats = {}; //will contain all cohort specific stats by cohort name
        this.student_stats(); //must establish first
        this.cohort_stats();
    }

    student_stats() {
        //calculates metadata on array of students
        this.s_stats = this.calc_stats(this.students);
    }

    cohort_stats() {
        for (let cohort of this.cohorts) {
            this.c_stats[cohort.name] = this.calc_stats(cohort);
        }
        return this.c_stats;
    }

    calc_stats(obj) {
        //returns JSON of stats for given cohort object or Array of students
        let output = {};
        let focus = obj; //Assumed array of student object
        if (!obj instanceof Cohort && Array.isArray(obj)) {
            throw new Error(`Something went wrong! Input was not an Array or Cohort object, but was: ${obj.constructor.name}`);

        } else if (obj instanceof Cohort) {
            focus = obj.class;
            output["discontent"] = {
                "avg": avgArray(focus.map(student => student.scores.find(x => x.cohort == obj.name).score))
            }
        }
        //Prop. of race
        output["ethnicity"] = {
            "avg": this.unique_array_prop(focus.map(x => x.ethnicity)) //average
        }

        //Prop. of gpa & stdDev
        let gpa_avg = avgArray(focus.map(x => Number(x.gpa)));
        let gpa_sd = stdDevArray(focus.map(x => Number(x.gpa)));
        output["gpa"] = {
            "avg": gpa_avg,
            "sd": gpa_sd
        }
        //Prop. of CS experience
        output["prev_cs"] = {
            "avg": this.unique_array_prop(focus.map(x => x.prev_cs))
        }
        //Prop. of grades
        output["grade"] = {
            "avg": this.unique_array_prop(focus.map(x => x.grade))
        }
        //Prop. of school_type
        output["school_type"] = {
            "avg": this.unique_array_prop(focus.map(x => x.school_type))
        }
        return output;
    }

    popup_stats(){
        let output = {};
        let students = Student.all;
        
        // trait stats
        output["stats"] = {}
        
        students.forEach(x=>{
            let stat_names =  Object.keys(x._s);
            let i;
            for(i = 0; i < stat_names.length; i++){
                let stat = stat_names[i];
                if(!output["stats"][stat]){
                    output["stats"][stat]=0;
                }
                output["stats"][stat] += x._s[stat];
            }
        })
        
        let stats = Object.keys(output["stats"]);
        for (let x = 0; x < stats.length; x++) {
            let stat = stats[x];
            output["stats"][stat] = output["stats"][stat] / students.length;
        }
    
        // gpa, logic score, read score
        output["GPA"] = avgArray(students.map(x => x.gpa));
        output["Logic Score"] = avgArray(students.map(x => x.logic));
        output["Read Score"] = avgArray(students.map(x => x.essay_score));
        return output;
    }

    unique_array_counts(arr) {
        //returns object of counts for array of strings
        let output = {};
        arr.forEach(x => output[x] = !!output[x] ? output[x] + 1 : 1);
        return output;
    }

    unique_array_prop(arr) {
        //return object of proportions for each string
        let output = {};
        let counts = this.unique_array_counts(arr);
        let sum = 0;
        for (let x of Object.keys(counts)) {
            sum += counts[x];
        }
        for (let x of Object.keys(counts)) {
            output[x] = counts[x] / sum;
        }
        return output;
    }

    visualize_stats() {
        //adds demographic breakdown of cohorts with average, and deviation from mean visually to html doc
        // http://www.chartjs.org/samples/latest/
        let stats = [
            "ethnicity",
            "school_type",
            "grade",
            "prev_cs"
        ];

        let stats_proper = [
            "Ethnicity",
            "School Type",
            "Grade",
            "Prev. CS"
        ]
        
        this.cohort_stats();

        //adding metadata
        this.createMetaData(stats,stats_proper);

        //adding cohorts
        for (let name of Object.keys(this.c_stats)) {

            //setting up container
            let article = $("<article />");
            $(".statContainer").append(article); //need to make first to
            let c_stat = this.c_stats[name];
            let cohort = Cohort.find_by_name(name);

            //title
            let title = $("<header/>");
            title.append(`<img src='assets/${cohort.img}'>`); //cohort image
            title.append(`<h2>Cohort Name: ${name}</h2>`); //name of cohort
            title.append(`<h4>Size: ${cohort.class.length}</h4>`); //class size
            title.append(`<p>Average Discontent Deviation: ${Math.round(c_stat.discontent.avg)}</h2>`); //happiness of class
            article.append(title);

            let graphs_container = $('<div class="graphs_container"/>');
            article.append(graphs_container);

            for (let i = 0; i < stats.length; i++) {
                //graph head w/graph
                let stat = stats[i];
                let thumbnail = $('<div class="stat_graph"/>');
                graphs_container.append(thumbnail);
                let thumb_head = $('<div class="thumb_head"/>');
                thumb_head.append(`<header>${stats_proper[i]}</header>`);
                thumbnail.append(thumb_head);
                thumbnail.append(`<div class="chart-container"><canvas id="${name}_${stat}"></canvas></div>`);
                makeGraph(`${name}_${stat}`, c_stat[stat].avg);

                //graph stats
                let stats_obj = c_stat[stat].avg;
                let stat_keys = Object.keys(stats_obj).sort((a, b) => stats_obj[b] - stats_obj[a]);
                let listo = $("<table/>");
                let list_head = $(`<tr><th>${stats_proper[i]}</th><th>Percentage(%)</th></tr>`);
                listo.append(list_head);
                for (let s = 0; s < stat_keys.length; s++) {
                    let info = stat_keys[s];
                    let perc = stats_obj[info];
                    let row = $("<tr/>");
                    row.append(`<td>${info}</td>`);
                    row.append(`<td>${(perc*100).toFixed(2)}%</td>`);
                    listo.append(row);
                }

                thumbnail.append(listo);
            }

            //Student header
            let student_container = $(`<div id=${name}_students />`);
            article.append(student_container);
            let s_title = $("<div/>");
            s_title.append(`<h2 data-id="${name}_students">Student info for ${capFirst(name)}</h2>`);
            
            //adding functionality to slide down/up
            s_title.find("h2").on("click",function(e){
                slideTable(this);
            });
            student_container.append(s_title);

            //student list
            let student_table = $(`<table />`);
            student_container.append(student_table);
            let c_class = cohort.class;
            let s_headers = [
                "Name",
                "Ethnicity",
                "Grade",
                "School Type",
                "CS skill?",
                "Travel (min)",
                "Displeasure"
            ];

            _addHeader(student_table, s_headers);

            for (let student of c_class) {
                let travel = student.durations.find(x => x.cohort == student.cohort).duration;

                let travel_time = Math.round(travel / 60 / 60, 2);

                let s_displ = student.scores.find(x => x.cohort == student.cohort).score;

                let s_data = [
                    student.name,
                    student.ethnicity,
                    student.grade,
                    student.school_type,
                    student.prev_cs,
                    travel_time,
                    s_displ
                ];
                _addRow(this,student_table, s_data, student);
            }
        }

        //adding waitlist
        this.createWaitList();
        addAscDescFunctionality();
    }

    createWaitList(){
        // creates a table of waitlisted students, in order of average score between all cohorts
        let waitlisted = Student.all.filter(s => !s.cohort).sort((a,b)=>{
            return calc_disc_avg(a)-calc_disc_avg(b);
        })//sorting by avg discontent
        //setting up container
        let article = $("<article />");
        $(".statContainer").append(article);
        
        //title
        let title = $("<header/>");
        title.append(`<h2>Waiting List</h2>`); //name of cohort
        title.append(`<h4>Size: ${waitlisted.length}</h4>`); //class size

        let student_container = $(`<div id="waitlisted_students" />`);
        article.append(student_container);
        let s_title = $("<div/>");
        s_title.append(`<h2 data-id="waitlisted_students">Student info for Waitlisted</h2>`);

        //adding slide functionality
        s_title.find("h2").on("click",function(e){
            slideTable(this);
        });
        student_container.append(s_title);
        
        let waitlist_table = $(`<table />`);
        student_container.append(waitlist_table);

        //Adding header to table
        let s_headers = [
            "Name",
            "Ethnicity",
            "Grade",
            "School Type",
            "CS skill?",
            "Avg. Discontent"
        ];

        _addHeader(waitlist_table, s_headers);

        for (let student of waitlisted) {
            let s_displ_avg = calc_disc_avg(student);

            let s_data = [
                student.name,
                student.ethnicity,
                student.grade,
                student.school_type,
                student.prev_cs,
                s_displ_avg
            ];
            _addRow(this,waitlist_table, s_data, student);
        }
    }

    createMetaData(stats,stats_proper){
        // calculates stats for across all students
        let totals = {};
        let students_temp = Cohort.all.map(cohort=>cohort.class);
        let students = [];

        for(let s = 0; s < students_temp.length; s++){
            students = students.concat(students_temp[s]);
        }

        let stats_data_raw = this.calc_stats(students);
        

        // setting up container
        let article = $("<article />");
        $(".statContainer").append(article); //need to make first to

        //title
        let title = $("<header/>");

        title.append(`<h2>All Cohorts</h2>`); //name of cohort
        title.append(`<h4>Number of students: ${sumArray(Cohort.all.map(x=>x.class.length))}</h4>`); //class size
        // title.append(`<p>Average Discontent Deviation: ${Math.round(avgArray(students.map(x=>x.discontent.avg)))}</h2>`); //happiness of classes
        article.append(title);

        let graphs_container = $('<div class="graphs_container"/>');
        article.append(graphs_container);

            for (let i = 0; i < stats.length; i++) {
                //graph head w/graph
                let stat = stats[i];
                let stats_obj = stats_data_raw[stat].avg;
                
                let thumbnail = $('<div class="stat_graph"/>');
                graphs_container.append(thumbnail);
                let thumb_head = $('<div class="thumb_head"/>');
                thumb_head.append(`<header>${stats_proper[i]}</header>`);
                thumbnail.append(thumb_head);
                thumbnail.append(`<div class="chart-container"><canvas id="meta_${stat}"></canvas></div>`);
                makeGraph(`meta_${stat}`, stats_obj);

                //graph stats
                
                let stat_keys = Object.keys(stats_obj).sort((a, b) => stats_obj[b] - stats_obj[a]);
                let listo = $("<table/>");
                let list_head = $(`<tr><th>${stats_proper[i]}</th><th>Percentage(%)</th></tr>`);
                listo.append(list_head);
                for (let s = 0; s < stat_keys.length; s++) {
                    let info = stat_keys[s];
                    let perc = stats_obj[info];
                    let row = $("<tr/>");
                    row.append(`<td>${info}</td>`);
                    row.append(`<td>${(perc*100).toFixed(2)}%</td>`);
                    listo.append(row);
                }

                thumbnail.append(listo);
            }
    }
    
    scoreHappiness(cohort) {
        // "happiness" of student's cohort by priority score
        console.log(cohort)
        for (let student of cohort.class) {
            let cohort_score_obj = student.scores.find(x => x.cohort == student.cohort);
            let result = student.scores.indexOf(cohort_score_obj);
            if (result < 0) {
                throw new Error(`Student ${student.name} could not be found in class of ${cohort.name}`);
            }
            score.push(result);
        }
        return avgArray(score);
    }
}

let makeStudentPopup = function(student,stats,e){
    let outer_popup = $("<div/>");
    outer_popup.addClass("popup");
    
    let inner_popup = $("<div/>");
    inner_popup.addClass("popup-inner");

    outer_popup.append(inner_popup);
    
    //header

    let header = $(`<h3>${student.name}</h3>`);
    inner_popup.append(header);

    //content
    let content = $("<div/>");
    content.addClass("student_info");
    inner_popup.append(content);    

    // raw info
    let left_content = $("<div/>"); 
    left_content.addClass("popup-left");
    left_content.append("<h2>Info</h2>");
    left_content.append(`<img src='assets/${student.img}'>`);
    content.append(left_content);

    let titles = Object.keys(raw_info);
    for(let w = 0; w<titles.length; w++){
        let title = titles[w];
        let content = student[raw_info[title]] || "[Waitlisted]";
        left_content.append(`<div class="content_holder"><span class="popup_title">${title}:</span><span class="popup_content">${content}</span></div>`);
    }
    // graphs
    let right_content = $("<div/>");
    right_content.addClass("popup-right");
    right_content.append("<h2>Graphs</h2>");
    content.append(right_content);

    // traits graph
    let t_canvas = $("<canvas id='t_canvas'></canvas>");
    right_content.append(t_canvas);
    let labels = Object.keys(stats.stats);
    let t_data = {
        labels: labels,
        datasets:[{
            label: 'Average',
            backgroundColor:"rgba(80,193,233,0.75)",
            data: labels.map(x=>Math.round(stats.stats[x], 2))
            }
            , 
            {
                label: student.name.split(" ")[0],
                backgroundColor:"rgba(162,133,220,0.75)",
                data: labels.map(x=>student._s[x])
            }
        ]
    }
    
    // gpa graph
    let g_canvas = $("<canvas id='g_canvas'></canvas>");
    right_content.append(g_canvas);
    let g_data = {
        labels: ["GPA"],
        datasets:[{
            label: 'Average',
            backgroundColor:"rgba(80,193,233,0.75)",
            data: [Math.round(stats["GPA"],2)]
            }
            , 
            {
                label: student.name.split(" ")[0],
                backgroundColor:"rgba(157,208,82,0.75)",
                data: [student.gpa]
            }
        ]
    }

    // logic score graph
    let l_canvas = $("<canvas id='l_canvas'></canvas>");
    right_content.append(l_canvas);
    let l_data = {
        labels: ["Logic Score"],
        datasets:[{
            label: 'Average',
            backgroundColor:"rgba(80,193,233,0.75)",
            data: [Math.round(stats["Logic Score"],2)]
            }
            , 
            {
                label: student.name.split(" ")[0],
                backgroundColor:"rgba(235,171,36,0.75)",
                data: [student.logic]
            }
        ]
    }

    // readscore graph
    let r_canvas = $("<canvas id='r_canvas'></canvas>");
    right_content.append(r_canvas);
    let r_data = {
        labels: ["Read Score"],
        datasets:[{
            label: 'Average',
            backgroundColor:"rgba(80,193,233,0.75)",
            data: [Math.round(stats["Read Score"],2)]
            }
            , 
            {
                label: student.name.split(" ")[0],
                backgroundColor:"rgba(234,93,79,0.75)",
                data: [student.essay_score]
            }
        ]
    }

    //close buttons
    inner_popup.append('<p><a data-popup-close="popup-2" href="#">Close</a></p><a class="popup-close" data-popup-close="popup-2" href="#">x</a>');
    
    $("body").append(outer_popup);

    // can only load graphs until after on HTML
    makeBarGraph("t_canvas", t_data, "Traits");
    makeBarGraph("g_canvas", g_data, "GPA");
    makeBarGraph("l_canvas", l_data, "Logic");
    makeBarGraph("r_canvas", r_data, "Read");

    outer_popup.fadeIn(350);
    e.preventDefault();

    $('[data-popup-close]').on('click', function(e)  {
        outer_popup.fadeOut(350);
        e.preventDefault();
        outer_popup.remove();
    });
}

function makeBarGraph(canvas_name, barChartData, title){
    var ctx = document.getElementById(canvas_name);

    new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: false,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title
            }
            ,
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        // suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            }
        }
    });
}

function makeGraph(name, myData) {
    let full_labels = Object.keys(myData).sort((a, b) => myData[b] - myData[a]);
    let full_values = full_labels.map(x => myData[x]).map(x => (x * 100).toFixed(2));
    let data = {
        datasets: [{
            data: full_values,
            backgroundColor: graph_colors
        }],
        labels: full_labels
    };

    new Chart(name, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: false
            }
        }
    });
}

function calc_disc_avg(student){
    return avgArray(student.scores.map(x => x.score));
}

function _addHeader(table, headers) {
    //adds headers to table element
    let row = $("<tr/>");
    for (let i = 0; i < headers.length; i++) {
        row.append(`<th>${headers[i]}</th>`);
    }
    table.append(row);
}

function _addRow(self,table, data,student) {
    //adds data to table element
    let row = $('<tr/>');
    for (let i = 0; i < data.length; i++) {
        row.append(`<td>${data[i]}</td>`);
    }

    //adding popup functionality
    row.on("click",(e=>{
        let stats = self.popup_stats();
        makeStudentPopup(student, stats,e);
    }));

    table.append(row);

}

function addAscDescFunctionality() {
    $("tbody").each(function () {
        let tbody = $(this);
        tbody.find('th').each(function (col) {
            $(this).click(function () {
                if ($(this).hasClass('asc')) {
                    $(this).removeClass('asc');
                    $(this).addClass('desc selected');
                    sortOrder = -1;
                } else {
                    $(this).addClass('asc selected');
                    $(this).removeClass('desc');
                    sortOrder = 1;
                }

                $(this).siblings().removeClass('asc selected');
                $(this).siblings().removeClass('desc selected');

                var arrData = tbody.find('tr:not(:first-child)').get(); //need to omit header row!

                arrData.sort(function (a, b) {
                    var val1 = $(a).children('td').eq(col).text().toUpperCase();
                    var val2 = $(b).children('td').eq(col).text().toUpperCase();
                    if ($.isNumeric(val1) && $.isNumeric(val2))
                        return sortOrder == 1 ? val1 - val2 : val2 - val1;
                    else
                        return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
                });
                $.each(arrData, function (index, row) {
                    tbody.append(row);//appending element already inside will simply rearrange them
                });
            });
        });
    })
}

