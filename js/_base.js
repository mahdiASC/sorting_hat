class _base {
    //handles basic initialization and ALL storage for each
    //extended class
    constructor(params) {
        if (!this.constructor.all){
            this.constructor.all = []
        }
        this.constructor.all.push(this);
        this.params=params;
        for (let i in params) {
            this[i] = params[i];
        }
    }
}

_base.createFrom2DArray = function(arr, header, properties){
    // given 2d array of all rows of data, will use properties to find and properly create new objects
    for(let i of arr){
        let output = {};
        for(let j of Object.keys(properties)){
            let row = i;
            let property_name = properties[j];
            let property_index = header.indexOf(j);
            let value = row[property_index];
            // issue with duplicate column names!!!
            // if (property_name=="essay_raw") console.log();
            if(header.indexOf(j,property_index+1)>-1){
                property_index = header.indexOf(j, property_index+1);
                value = row[property_index];
            }

            output[property_name] = row[property_index];
        }

        // setting secondary race for Students (not ideal)
        if(properties === student_properties){
            output.race_secondary = [];
            for(let k of Object.keys(secondary_races)){
                let start = header.indexOf(k);
                
                for (let w = 0; w<secondary_races[k];w++){
                    let val = i[w+start];
                    if(val.length>0){
                        output.race_secondary.push();
                    }
                }
            }
        }
        new this(output);
    }
}