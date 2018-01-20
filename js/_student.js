class Student extends _base {
    constructor(params){
        super(params);
        // on creation, student scores logic and gives total score, including rec bonus
        let total = 0 + this.readscore;
        for(let i of Object.keys(correct_logic)){
            if(this[i]==correct_logic[i]){
                total++;
            }
        }

        if(this.rec == "TRUE"){
            total++;
        }

        this.score = total; // 8 highest possible score (3 readscore + 4 logic + 1 rec)
        
        this.travel_times = this.travel_times || [];
        this.rejection_messages = this.rejection_messages || [];
    }
}

Student.createFromCSVString = function (fileString) {
    return new Promise((resolve, reject)=>{
        let self = this;
        
        Papa.parse(fileString, {
            delimiter: "	",
            complete: data => {
                // result is an array of each row of the spreadsheet
                let result = data.data;
                const header = result.shift(); // first row is header
                result.shift(); // survey monkey has extra row for data typing
                this.createFrom2DArray(result, header, student_properties);
                resolve();
            }
        });
    })
}