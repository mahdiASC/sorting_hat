class _base {
    //handles basic initialization and ALL storage for each
    //extended class
    constructor(params) {
        if (!this.constructor.all) {
            this.constructor.all = []
        }
        this.constructor.all.push(this);
        for (let i in params) {
            this[i] = params[i];
        }
    }
}

_base.createFromCSVString = function (fileString) {
    let self = this;
    return Papa.parse(fileString, {
        delimiter: "+",
        complete: function (results) {
            let header = results.data[0];
            for (let i = 1; i < results.data.length; i++) {
                parseObjects.apply(self, [header, results.data[i]]);
            }
        }
    });
}

const parseObjects = function (header, arr) {
    let output = {};
    for (let x in header) {
        output[header[x]] = arr[x];
    }
    new this(output);
}