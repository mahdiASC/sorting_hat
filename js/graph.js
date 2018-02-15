class Graph{
    constructor(applicants){
        this.applicants = applicants;
        this.invalids = Student.all.filter(x=>!applicants.includes(x));
        this.makeStats();
        this.graphStats();
        this.populateValids();
        this.populateInvalids();
    }

    makeStats() {
        // creates the stats for the applicants
        this.stats = {};
    
        // trait stats
        let stat_names = Object.keys(graph_labels);
        for (let i = 0; i < stat_names.length; i++) {
            let stat = stat_names[i];
            this.stats[stat] = unique_array_prop(this.applicants.filter(x=>x[stat]).map(x=>x[stat])); 
        }    
    }

    graphStats(){
        // populates website with graphs for each stat
        let container = $("#page-wrapper");
        let graphs_container = $('<div class="graphs_container"/>');
        container.append(graphs_container);

        // Header text
        graphs_container.append("<h1>Stats on Valid Applicants</h1>");

        for (let stat of Object.keys(graph_labels)) {
            //graph head w/graph
            let graph_name = graph_labels[stat];
            let thumbnail = $('<div class="stat_graph"/>');
            graphs_container.append(thumbnail);
            
            let thumb_head = $('<div class="thumb_head"/>');
            thumbnail.append(thumb_head);

            thumb_head.append(`<header>${graph_name}</header>`);
            thumbnail.append(`<div class="chart-container"><canvas id="${stat}"></canvas></div>`);
            
            // creating graph
            let myData = this.stats[stat];
            let full_labels = Object.keys(myData).sort((a, b) => myData[b] - myData[a]);
            let full_values = full_labels.map(x => myData[x]).map(x => (x * 100).toFixed(2));

            this.makeGraph(stat, full_labels, full_values);
        
            // stats to sift through
            let listo = $("<table/>");
            let list_head = $(`<tr><th>${graph_name}</th><th>Percentage(%)</th></tr>`);
            listo.append(list_head);

            for (let s = 0; s < full_labels.length; s++) {
                let row = $("<tr/>");
                row.append(`<td>${full_labels[s]}</td>`);
                row.append(`<td>${full_values[s]}%</td>`);
                listo.append(row);
            }

            thumbnail.append(listo);
        }

    }

    populate(el_id, title, header, pulling_data_func, students, special_col_func){
        //populates students into table using inputs

        // setting up containers
        let table;

        // in case of remaking table (i.e. when student being added)
        if($(`#${el_id}`).length){ // hack to check if element exists
            let student_container = $(`#${el_id}`);

            table = $(`#${el_id} table`).empty(); //clearing for refill
        }else{
            // first time firing
            let student_container = $(`<div id="${el_id}" />`);
            
            let container = $("#page-wrapper");
            container.append(student_container);
            
            let s_title = $("<div/>");
            s_title.append(`<h2>${title}</h2>`);
            s_title.append(`<h4>Total: ??</h4>`);
            student_container.append(s_title);
    
            //creating student table
            table = $(`<table />`);
            student_container.append(table); 
            
            //adding student email creation button
            let phrase = capFirst(el_id.split("_").join(" "), true);
            let email_button = $(`<button>Create E-mail list of ${phrase}</button>`);
            email_button.on("click",e=>this.makeEmailPopup(el_id,e));
            $("#invalid_applicants div").append(email_button);
        }
        
        // adding headers
        this._addHeader(table, header);

        //populating table with students
        students.forEach(student=>{
            // should coincide with headers
            let data = pulling_data_func(student); // populates data properly given a student
            this._addRow(table, data, student, special_col_func);
        });
        
        // updating total in title
        this.updateTitles();

        this.addAscDescFunctionality();
    }

    populateInvalids(){
        // will create table of student applicants
        this.populate(
            "invalid_applicants",
            "Student info for Invalid Applicants",
            [ //headers
                "Name",
                "Reason",
                "Add?" // allowing user to remove student from pool
            ],
            student=>{
                return [
                    student.name,
                    student.rejection_messages.join(" | "),
                    "ADD" // Button to remove student from applicant pool
                ]
            },
            this.invalids,
            (student,row)=>{
                // remove row, add to invalids, remake invalid table
                this.applicants.push(this.invalids.splice(this.invalids.indexOf(student),1)[0]);
                this.populateValids();
                row.remove();
            }
        )
    }

    updateTitles(){
        // updates sum number under title
        let sections = $("table").parent().filter(":not(.stat_graph)");
        
        sections.each((i,v)=>{
            // length of each table
            let l =$(v).find("tr").length-1;
            let h2 = $(v).find("h4").text(`Total: ${l}`);
        })
    }
    populateValids(){
        this.populate(
            "valid_applicants",
            "Student info for Valid Applicants",
            [ //headers
                "Name",
                "Ethnicity",
                "Grade",
                "School Type",
                "CS skill?",
                "Recommended?",
                // "Special Case",
                "&#9734",
                "Remove?" // allowing user to remove student from pool
            ],
            student=>{
                return [
                    student.name,
                    student.race_primary,
                    student.grade,
                    student.school_type,
                    student.cs,
                    student.rec,
                    student.star,
                    "REMOVE" // Button to remove student from applicant pool
                ]
            },
            this.applicants,
            (student,row)=>{
                // remove row, add to invalids, remake invalid table
                this.invalids.push(this.applicants.splice(this.applicants.indexOf(student),1)[0]);
                if(!student.rejection_messages.includes("Removed by user")){
                    student.rejection_messages.push("Removed by user");
                }
                this.populateInvalids();
                row.remove();
            }
        )
    }

    visualize_stats(){
        //adds demographic breakdown of cohorts with average, and deviation from mean visually to html doc
        // http://www.chartjs.org/samples/latest/
        for (let name of Object.keys(this.stats)) {
            let stat = this.stats[name];
    
            //setting up container
            let article = $("<article />");
            $(".statContainer").append(article); //need to make first to
            let cohort = Cohort.find_by_name(name);
    
            //title
            let title = $("<header/>");
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
                    row.append(`<td>${(perc * 100).toFixed(2)}%</td>`);
                    listo.append(row);
                }
    
                thumbnail.append(listo);
            }
    
            //Student header
            let student_container = $(`<div id=${name}_students />`);
            article.append(student_container);
            let s_title = $("<div/>");
            s_title.append(`<h2>Student info for ${capFirst(name)}</h2>`);
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
                _addRow(student_table, s_data, student);
            }
        }
    
        this.createWaitList();
        addAscDescFunctionality();
    }

    makeGraph (name, full_labels, full_values) {
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

    addAscDescFunctionality() {
        $("tbody").each(function () {
            let tbody = $(this);
            tbody.find('th').each(function (col) {
                $(this).click(function () {
                    let sortOrder;
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
                        var val1 = $(a).children('td').eq(col).text().replace("%","").toUpperCase();
                        var val2 = $(b).children('td').eq(col).text().replace("%","").toUpperCase();
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
    
    _addHeader(table, headers) {
        //adds headers to table element
        let row = $("<tr/>");
        for (let i = 0; i < headers.length; i++) {
            row.append(`<th>${headers[i]}</th>`);
        }
        table.append(row);
    }
    
    _addRow(table, data, student, special_func) {
        //adds data to table element
        let row = $('<tr/>');
        for (let i = 0; i < data.length; i++) {
            row.append(`<td>${data[i]}</td>`);
        }

        // adding special function to last column's "on click"
        row.children().last().on("click",(e)=>special_func(student,row));

        row.children().first().on("click", (e => {
            this.makeStudentPopup(student, e);
        }));
        row.children().last().addClass("mouse");
        row.children().first().addClass("mouse");
        table.append(row);
    
    }

    makeStudentPopup (student, e) {
        let outer_popup = $("<div/>");
        outer_popup.addClass("popup");
    
        let inner_popup = $("<div/>");
        inner_popup.addClass("popup-inner");
    
        outer_popup.append(inner_popup);
    
        //header
        let header = $(`<h3>${student.name}</h3>`);
        if(student.star === "TRUE"){
            header.append("☆");
        }
        inner_popup.append(header);
    
        //content
        let props = student_display_properties(student);
        for(let i of Object.keys(props)){
            let word = i.split("_")[1];
            let content = $(`<p><span>${word}:</span> ${props[i]}</p>`);
            inner_popup.append(content);
        }
        
        //close buttons
        inner_popup.append('<p><a data-popup-close="popup-2" href="#">Close</a></p><a class="popup-close" data-popup-close="popup-2" href="#">x</a>');
    
        $("body").append(outer_popup);
        outer_popup.fadeIn(350);
        e.preventDefault();
    
        $('[data-popup-close]').on('click', function (e) {
            outer_popup.fadeOut(350);
            e.preventDefault();
            outer_popup.remove();
        });
    }

    goodInvalids(){
        // returns array of Students who would be valid if they completed form
        return this.invalids.filter(x => {

            if (x.name.trim() === "") {
                return false;
            }

            if (!(x.gender === "Male" || x.gender === "Prefer to self-describe (elaborate here)")) {
                return false;
            }

            if (x.grade !== "10th" && x.grade !== "11th") {
                return false;
            }

            if (!(x.race_primary !== "Neither" || !(x.race_primary === "Neither" && x.race_secondary.includes("White") && x.race_secondary.length === 1))) {
                return false;
            }
            if (!x.email) {
                return false;
            }
            let re = new RegExp("Duplicate");
            if(x.rejection_messages.some(x=>x.match(re))){
                return false;
            }

            return true;
        })
    }
    makeEmailPopup(el_id,e){

        let students;
        // hardcoding
        if(el_id === "valid_applicants"){
            students = this.applicants;
        }else{
            students = this.goodInvalids();
        }
        

        let outer_popup = $("<div/>");
        outer_popup.addClass("popup");
    
        let inner_popup = $("<div/>");
        inner_popup.addClass("popup-inner");
    
        outer_popup.append(inner_popup);
    
        //header
        let header = $(`<h3>Emails for students with incomplete forms</h3>`);
        let more_info = $("<h4>Only includes students missing essay/logic or address that are males, in 10th or 11th grade, and are not White</h4>");
        inner_popup.append(header);
        inner_popup.append(more_info);

        //content
        let growing_string = [];
        for(let i of students){
            growing_string.push(i.email);
        }
        
        let content = $(`<p>${growing_string.join(", ")}</p>`);
        inner_popup.append(content);
        //close buttons
        inner_popup.append('<p><a data-popup-close="popup-2" href="#">Close</a></p><a class="popup-close" data-popup-close="popup-2" href="#">x</a>');
    
        $("body").append(outer_popup);
        outer_popup.fadeIn(350);
        e.preventDefault();
    
        $('[data-popup-close]').on('click', function (e) {
            outer_popup.fadeOut(350);
            e.preventDefault();
            outer_popup.remove();
        });
    }
}


