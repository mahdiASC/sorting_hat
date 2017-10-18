class Statistic{
    //responsible for handling the stats for cohorts
    constructor(){
        this.cohorts = Cohort.all;
        this.students = Student.all;
        this.s_stats = {}; //will contain stats for all students
        this.c_stats = {}; //will contain all cohort specific stats by cohort name
        this.student_stats(); //must establish first
        this.cohort_stats();
    }
    
    student_stats(){
        //calculates metadata on all students
        this.s_stats = this.calc_stats(this.students);   
    }
    
    cohort_stats(){
        for(let cohort of this.cohorts){
            this.c_stats[cohort.name]=this.calc_stats(cohort);
        }
        return this.c_stats;
    }

    calc_stats(obj){
        //returns JSON of stats for given cohort object or Array of students
        let output = {};    
        let focus = obj;//Assumed array of student object
        if(!obj instanceof Cohort && Array.isArray(obj)){
            throw new Error(`Something went wrong! Input was not an Array or Cohort object, but was: ${obj.constructor.name}`);

        }else if (obj instanceof Cohort){
            focus = obj.class;
        }
        //Prop. of race
        output["ethnicity"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.ethnicity)) //average
        }

        //Prop. of gpa & stdDev
        let gpa_avg = avgArray(focus.map(x=>Number(x.gpa)));
        let gpa_sd = stdDevArray(focus.map(x=>Number(x.gpa)));
        output["gpa"] = {
            "avg" : gpa_avg,
            "sd" : gpa_sd
        }
        //Prop. of CS experience
        output["prev_cs"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.prev_cs))
        }
        //Prop. of grades
        output["grade"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.grade))
        }
        //Prop. of school_type
        output["school_type"] = {
            "avg":this.unique_array_prop(focus.map(x=>x.school_type))
        }
        return output;
    }
    
    unique_array_counts(arr){
        //returns object of counts for array of strings
        let output = {};
        arr.forEach(x=>output[x] = !!output[x] ? output[x]+1 : 1);
        return output;
    }

    unique_array_prop(arr){
        //return object of proportions for each string
        let output = {};
        let counts = this.unique_array_counts(arr);
        let sum = 0;
        for (let x of Object.keys(counts)){
            sum += counts[x];
        }
        for (let x of Object.keys(counts)){
            output[x] = counts[x]/sum;
        }
        return output;
    }

    visualize_stats(){
    //adds demographic breakdown of cohorts with average, and deviation from mean visually to html doc
    // http://www.chartjs.org/samples/latest/
        this.cohort_stats();
        for(let name of Object.keys(this.c_stats)){
            $("body").append(`<h1>Cohort: ${name}</h1>`);
            let c_stat = this.c_stats[name];
            let stats = [
                "ethnicity",
                "school_type",
                "grade",
                "prev_cs"
            ];

            for( let stat of stats){
                $("body").append(`<div class="chart-container" style="position: relative; height:30vh; width:30vw"><canvas id="${name}_${stat}" width:300px height:300px></canvas></div>`);
                makeGraph(`${name}_${stat}`, c_stat[stat].avg);
                // if(stat=="gpa"){
                //     makeBarGraph(`${name}_${stat}`, Cohort.find_by_name(name).class.map(x=>Number(x.gpa)));
                // }else{}
            }

            //giving happiness score
            // $("body").append(`<p>Average Student Happiness: ${this.scoreHappiness(Cohort.find_by_name(name))}</p>`);
            //listing students
            let add_string=`<ol id=${name}_students>`;
            let c_class = Cohort.find_by_name(name).class;
            for(let student of c_class){
                // let travel_time = student.durations.find(x=>x.cohort==student.cohort).duration;
                let travel_time = student.distances.find(x=>x.cohort==student.cohort).distance; //OMIT (change to duration)
                add_string +=`<li>${student.name} - Travel time to ${capFirst(student.cohort)}: ~${Math.round(travel_time/60/60,2)} minutes - Grade: ${student.grade}th</li>`;
            }
            add_string +=`</ol>`;
            $("body").append(add_string);

        }
    }

    scoreHappiness(cohort){
        // "happiness" of student's cohort by priority score
        let score = [];
        for(let student of cohort.class){
            let cohort_score_obj = student.scores.find(x=>x.cohort==student.cohort);
            let result = student.scores.indexOf(cohort_score_obj);
            if(result < 0){
                throw new Error(`Student ${student.name} could not be found in class of ${cohort.name}`);
            }
            score.push(result);
        }
        return avgArray(score);
    }
}

let makeGraph = function(name, myData){
    let full_labels = Object.keys(myData).sort((a,b)=>myData[b]-myData[a]);
    let full_values = full_labels.map(x=>myData[x]).map(x=>(x*100).toFixed(2));
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
            legend:{
                display: false
            }
        }
    });
}
