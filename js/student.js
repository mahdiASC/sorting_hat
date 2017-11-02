// Export node module.
if ( typeof module !== 'undefined' )
{
    var _base = require("../js/base.js");
    var Question = require("../js/question.js");
}

class Student extends _base {

    constructor(params) {
        super(params);
        this.scores = this.scores || [];
        this.distances = this.distances || [];
    }
    get techScore() {
        if (this._ts !== undefined) {
            return this._ts;
        } else {
            //specifically finds anything with a "q" followed by a number
            let re = new RegExp('q[0-9]+');
            return this._ts = Object.getOwnPropertyNames(this).filter(x => x.match(re)).reduce((sum, val) => sum + Number(this[val]), 0);
        }
    }

    //needed in order to reassign getter
    set techScore(param) {
        delete this.techScore;
    }

    get stats() {
        if (this._s !== undefined) {
            return this._s;
        } else {
            //traverses question links to get final stats (shouldn't change)
            //questions taken in order (starts with s + ##)
            let q = Question.first();
            let i = 1;
            while (q) {
                let result = q.outcome(this[`s${i}`]);
                if (!this._s) {
                    this._s = {};
                }

                for (let w of Object.keys(result)) {
                    let k = result[w];
                    if (!this._s[w]) {
                        this._s[w] = 0;
                    }
                    this._s[w] += k;
                }

                q = Question.next(q, this[`s${i}`]);
                i++;
            }
            return this._s;
        }

    }

    //needed in order to reassign getter
    set stats(params) {}

    //sorts list of cohorts by lowest priority
    selfSort() {
        this.scores = this.scores.sort((a, b) => a.score - b.score);
    }
}

Student.fullSort = function () {
    Student.all.forEach(x => x.selfSort());
}

Student.createFromJSON = function (json_obj) {
    // let self = this;
    let output = [];
    for (let i of json_obj) {
        output.push(new this(i));
    }
    return output;
}

// Export node module.
if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
{
    module.exports = Student;
}
