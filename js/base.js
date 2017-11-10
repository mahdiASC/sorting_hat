let myChar = "/u0009";

class _base {
    //handles basic initialization and ALL storage for each
    //extended class
    constructor(params) {
        if (!this.constructor.all){
            this.constructor.all = []
        }
        this.constructor.all.push(this);
        for (let i in params) {
            this[i] = params[i];
        }
    }
}

_base.createFromCSVString = function (fileString) {
    return new Promise((resolve, reject)=>{
        let self = this;
        
        Papa.parse(fileString, {
            delimiter: myChar,
            complete: function (results) {
                let header = results.data[0];
                for (let i = 1; i < results.data.length; i++) {
                    _parseObjects.apply(self, [header, results.data[i]]);
                }
                resolve();
            }
        });
    })
}

_base.createFromJSON = function (json_array) {
    // input is an array of JSON objects
    return new Promise((resolve, reject)=>{
        let output = [];
        for (let i of json_array) {
            output.push(new this(i));
        }
        resolve(output);
    })
}

_parseObjects = function (header, arr) {
    let output = {};
    for (let x in header) {
        output[header[x]] = arr[x];
    }
    return new this(output);
}
